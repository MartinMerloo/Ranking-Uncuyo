package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.config.EloProperties;
import ar.edu.uncuyo.ranking.exception.BadRequestException;
import ar.edu.uncuyo.ranking.model.MatchResult;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class CrossTableExcelParser {

    private static final int ROW_TOURNAMENT_NAME = 1;
    private static final int ROW_HEADER = 4;
    private static final int ROW_FIRST_PLAYER = 5;
    private static final int COL_SEED = 0;
    private static final int COL_NAME = 2;
    private static final int COL_ELO = 3;
    private static final int CLASSIFICATION_COL_SEED = 0;
    private static final int CLASSIFICATION_COL_CLUB = 6;

    private static final Pattern ROUND_RESULT_PATTERN =
            Pattern.compile("^(\\d+)([bw])(.+)$", Pattern.CASE_INSENSITIVE);

    private final DataFormatter dataFormatter = new DataFormatter();
    private final EloProperties eloProperties;

    public CrossTableExcelParser(EloProperties eloProperties) {
        this.eloProperties = eloProperties;
    }

    public ParsedCrossTable parse(MultipartFile crossTableFile, MultipartFile classificationFile) {
        if (crossTableFile == null || crossTableFile.isEmpty()) {
            throw new BadRequestException("Excel file is required");
        }

        try (InputStream inputStream = crossTableFile.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getNumberOfSheets() > 0 ? workbook.getSheetAt(0) : null;
            if (sheet == null || !looksLikeCrossTable(sheet)) {
                throw invalidFormat();
            }

            String tournamentName = readRequiredCell(sheet, ROW_TOURNAMENT_NAME, 0);
            Row headerRow = sheet.getRow(ROW_HEADER);
            List<Integer> roundColumns = detectRoundColumns(headerRow);
            if (roundColumns.isEmpty()) {
                throw invalidFormat();
            }

            AcademicColumns academicColumns = detectAcademicColumns(headerRow);
            boolean hasExplicitAcademicColumns = academicColumns.hasBoth();

            Map<Integer, String> seedToClub = hasExplicitAcademicColumns
                    ? Map.of()
                    : (classificationFile != null && !classificationFile.isEmpty()
                            ? parseClassificationFile(classificationFile)
                            : Map.of());

            List<ParsedPlayer> players = new ArrayList<>();
            for (int rowIndex = ROW_FIRST_PLAYER; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    continue;
                }

                Optional<Integer> seed = readSeed(row.getCell(COL_SEED));
                if (seed.isEmpty()) {
                    break;
                }

                String fullName = readCell(row.getCell(COL_NAME));
                if (fullName == null || fullName.isBlank()) {
                    continue;
                }

                int excelElo = readElo(row.getCell(COL_ELO));
                String clubCiudad = hasExplicitAcademicColumns
                        ? ""
                        : seedToClub.getOrDefault(seed.get(), "");

                String faculty = "";
                String career = "";
                if (hasExplicitAcademicColumns) {
                    faculty = UncuyoFacultyCatalog.resolve(
                            readCell(row.getCell(academicColumns.facultadColumn())));
                    career = toCanonicalCareer(readCell(row.getCell(academicColumns.carreraColumn())));
                }

                List<ParsedRoundResult> roundResults = new ArrayList<>();
                List<Integer> byeRounds = new ArrayList<>();
                for (int roundIndex = 0; roundIndex < roundColumns.size(); roundIndex++) {
                    final int round = roundIndex + 1;
                    int columnIndex = roundColumns.get(roundIndex);
                    String raw = readCell(row.getCell(columnIndex));
                    if (raw == null || raw.isBlank()) {
                        continue;
                    }
                    if (isBye(raw)) {
                        byeRounds.add(round);
                        continue;
                    }
                    if (isNoShow(raw)) {
                        continue;
                    }
                    parseRoundResult(raw).ifPresent(result ->
                            roundResults.add(new ParsedRoundResult(round, result)));
                }

                players.add(new ParsedPlayer(
                        seed.get(),
                        PlayerNameNormalizer.toDisplayName(fullName),
                        excelElo,
                        clubCiudad,
                        faculty,
                        career,
                        roundResults,
                        byeRounds));
            }

            if (players.isEmpty()) {
                throw invalidFormat();
            }

            return new ParsedCrossTable(
                    tournamentName.trim(),
                    roundColumns.size(),
                    hasExplicitAcademicColumns,
                    players);
        } catch (BadRequestException ex) {
            throw ex;
        } catch (IOException ex) {
            throw new BadRequestException("Could not read Excel file: " + ex.getMessage());
        } catch (Exception ex) {
            throw invalidFormat();
        }
    }

    private Map<Integer, String> parseClassificationFile(MultipartFile classificationFile) {
        Map<Integer, String> seedToClub = new HashMap<>();
        try (InputStream inputStream = classificationFile.getInputStream();
             Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int rowIndex = 0; rowIndex <= sheet.getLastRowNum(); rowIndex++) {
                Row row = sheet.getRow(rowIndex);
                if (row == null) {
                    continue;
                }
                Optional<Integer> seed = readSeed(row.getCell(CLASSIFICATION_COL_SEED));
                if (seed.isEmpty()) {
                    continue;
                }
                String club = readCell(row.getCell(CLASSIFICATION_COL_CLUB));
                if (club != null && !club.isBlank()) {
                    seedToClub.put(seed.get(), club.trim());
                }
            }
        } catch (IOException ex) {
            throw new BadRequestException("Could not read classification Excel: " + ex.getMessage());
        }
        return seedToClub;
    }

    private boolean looksLikeCrossTable(Sheet sheet) {
        Row header = sheet.getRow(ROW_HEADER);
        if (header == null) {
            return false;
        }
        Row titleRow = sheet.getRow(3);
        String title = titleRow != null ? readCell(titleRow.getCell(0)) : null;
        return (title != null && title.toLowerCase().contains("cuadro"))
                || !detectRoundColumns(header).isEmpty();
    }

    private AcademicColumns detectAcademicColumns(Row headerRow) {
        Integer facultadColumn = null;
        Integer carreraColumn = null;
        if (headerRow == null) {
            return new AcademicColumns(null, null);
        }
        for (int columnIndex = 0; columnIndex < headerRow.getLastCellNum(); columnIndex++) {
            String header = normalizeHeader(readCell(headerRow.getCell(columnIndex)));
            if ("FACULTAD".equals(header)) {
                facultadColumn = columnIndex;
            }
            if ("CARRERA".equals(header)) {
                carreraColumn = columnIndex;
            }
        }
        return new AcademicColumns(facultadColumn, carreraColumn);
    }

    private String normalizeHeader(String header) {
        if (header == null || header.isBlank()) {
            return "";
        }
        String withoutAccents = Normalizer.normalize(header.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.toUpperCase(Locale.ROOT).replaceAll("\\s+", " ");
    }

    private String toCanonicalCareer(String career) {
        if (career == null) {
            return "";
        }
        return career.trim().replaceAll("\\s+", " ");
    }

    private List<Integer> detectRoundColumns(Row headerRow) {
        List<Integer> columns = new ArrayList<>();
        if (headerRow == null) {
            return columns;
        }
        for (int columnIndex = 0; columnIndex < headerRow.getLastCellNum(); columnIndex++) {
            String value = readCell(headerRow.getCell(columnIndex));
            if (value != null && value.matches(".*\\d+\\.?\\s*Rd.*")) {
                columns.add(columnIndex);
            }
        }
        if (columns.isEmpty()) {
            for (int columnIndex = 5; columnIndex <= 12; columnIndex++) {
                columns.add(columnIndex);
            }
        }
        return columns;
    }

    private boolean isBye(String raw) {
        return "-1".equals(raw.trim());
    }

    private boolean isNoShow(String raw) {
        return "0".equals(raw.trim());
    }

    private Optional<ParsedRoundResultData> parseRoundResult(String raw) {
        String trimmed = raw.trim();
        if (isBye(trimmed) || isNoShow(trimmed)) {
            return Optional.empty();
        }

        Matcher matcher = ROUND_RESULT_PATTERN.matcher(trimmed);
        if (!matcher.matches()) {
            return Optional.empty();
        }

        int opponentSeed = Integer.parseInt(matcher.group(1));
        char color = Character.toLowerCase(matcher.group(2).charAt(0));
        double playerScore = parsePlayerScore(matcher.group(3));
        return Optional.of(new ParsedRoundResultData(opponentSeed, color, playerScore));
    }

    private double parsePlayerScore(String scorePart) {
        String normalized = scorePart.trim()
                .replace("½", "0.5")
                .replace("1/2", "0.5");
        if ("1".equals(normalized)) {
            return 1.0;
        }
        if ("0".equals(normalized)) {
            return 0.0;
        }
        if ("0.5".equals(normalized)) {
            return 0.5;
        }
        throw new BadRequestException("Unrecognized round result score: " + scorePart);
    }

    public MatchResult toMatchResult(char playerColor, double playerScore) {
        if (playerColor == 'w') {
            if (playerScore >= 1.0) {
                return MatchResult.WHITE_WIN;
            }
            if (playerScore <= 0.0) {
                return MatchResult.BLACK_WIN;
            }
            return MatchResult.DRAW;
        }
        if (playerScore >= 1.0) {
            return MatchResult.BLACK_WIN;
        }
        if (playerScore <= 0.0) {
            return MatchResult.WHITE_WIN;
        }
        return MatchResult.DRAW;
    }

    private int readElo(Cell cell) {
        String value = readCell(cell);
        if (value == null || value.isBlank()) {
            return eloProperties.initialRatingForNewPlayers();
        }
        try {
            double numeric = Double.parseDouble(value.replace(",", "."));
            int elo = (int) Math.round(numeric);
            return elo <= 0 ? eloProperties.initialRatingForNewPlayers() : elo;
        } catch (NumberFormatException ex) {
            return eloProperties.initialRatingForNewPlayers();
        }
    }

    private Optional<Integer> readSeed(Cell cell) {
        String value = readCell(cell);
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }
        try {
            double numeric = Double.parseDouble(value.replace(",", "."));
            if (Double.isNaN(numeric)) {
                return Optional.empty();
            }
            return Optional.of((int) Math.round(numeric));
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }
    }

    private String readRequiredCell(Sheet sheet, int rowIndex, int columnIndex) {
        Row row = sheet.getRow(rowIndex);
        if (row == null) {
            throw invalidFormat();
        }
        String value = readCell(row.getCell(columnIndex));
        if (value == null || value.isBlank()) {
            throw invalidFormat();
        }
        return value;
    }

    private String readCell(Cell cell) {
        if (cell == null) {
            return null;
        }
        String value = dataFormatter.formatCellValue(cell);
        return value != null ? value.trim() : null;
    }

    private BadRequestException invalidFormat() {
        return new BadRequestException(
                "El archivo no tiene el formato esperado de Chess Results (Cuadro cruzado)");
    }

    private record AcademicColumns(Integer facultadColumn, Integer carreraColumn) {
        boolean hasBoth() {
            return facultadColumn != null && carreraColumn != null;
        }
    }

    public record ParsedCrossTable(
            String tournamentName,
            int rounds,
            boolean hasExplicitAcademicColumns,
            List<ParsedPlayer> players) {
    }

    public record ParsedPlayer(
            int seed,
            String fullName,
            int excelElo,
            String clubCiudad,
            String faculty,
            String career,
            List<ParsedRoundResult> roundResults,
            List<Integer> byeRounds) {
    }

    public record ParsedRoundResult(int round, ParsedRoundResultData data) {
    }

    public record ParsedRoundResultData(int opponentSeed, char color, double playerScore) {
    }
}
