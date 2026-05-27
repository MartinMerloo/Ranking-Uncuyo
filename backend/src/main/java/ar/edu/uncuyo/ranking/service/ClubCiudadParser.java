package ar.edu.uncuyo.ranking.service;

import org.springframework.stereotype.Component;

import java.text.Normalizer;
import java.util.Locale;

/**
 * Parses the Club/Ciudad field from Chess Results exports.
 * New convention: "INGENIERIA/MECATRONICA" → faculty + career resolved automatically.
 * Legacy (no "/"): infers faculty from career keyword (backward compatible).
 * Null/blank → returns ("", "") without throwing.
 */
@Component
public class ClubCiudadParser {

    public record ParsedClubCiudad(String faculty, String career) {}

    public ParsedClubCiudad parse(String clubCiudad) {
        if (clubCiudad == null || clubCiudad.isBlank()) {
            return new ParsedClubCiudad("", "");
        }

        String normalized = normalize(clubCiudad.trim());

        if (normalized.contains("/")) {
            String[] parts = normalized.split("/", 2);
            String rawFaculty = parts[0].trim();
            String rawCareer  = parts.length > 1 ? parts[1].trim() : "";
            return new ParsedClubCiudad(mapFaculty(rawFaculty), mapCareer(rawCareer));
        }

        // Legacy: no slash — infer faculty from career keyword
        return new ParsedClubCiudad(inferFacultyFromCareer(normalized), mapLegacyCareer(normalized));
    }

    // ── Normalization ────────────────────────────────────────────────────────

    private String normalize(String raw) {
        return Normalizer.normalize(raw.toUpperCase(Locale.ROOT), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }

    // ── Faculty mapping (left side of "/") ──────────────────────────────────

    private String mapFaculty(String raw) {
        // Expand abbreviations to full words that UncuyoFacultyCatalog can resolve
        String expanded = switch (raw) {
            case "ING"                                       -> "INGENIERIA";
            case "ARQ", "ARQUITECTURA"                       -> "ARTES Y DISENO";
            case "ECO"                                       -> "ECONOMIA";
            case "DER"                                       -> "DERECHO";
            case "MED"                                       -> "MEDICINA";
            case "FILO"                                      -> "FILOSOFIA Y LETRAS";
            case "ODO"                                       -> "ODONTOLOGIA";
            case "APLICADAS", "CIENCIAS APLICADAS"           -> "CIENCIAS APLICADAS A LA INDUSTRIA";
            case "AGRARIAS"                                  -> "CIENCIAS AGRARIAS";
            case "EXACTAS", "CIENCIAS EXACTAS"               -> "CIENCIAS EXACTAS Y NATURALES";
            case "POLITICAS", "CIENCIAS POLITICAS"           -> "CIENCIAS POLITICAS Y SOCIALES";
            case "ARTES", "ARTES Y DISENO"                   -> "ARTES Y DISENO";
            case "EDUCACION"                                 -> "EDUCACION";
            default                                          -> raw;
        };

        String resolved = UncuyoFacultyCatalog.resolve(expanded);
        if (UncuyoFacultyCatalog.allFaculties().contains(resolved)) {
            return resolved;
        }
        return capitalize(raw);
    }

    // ── Career mapping (right side of "/") ──────────────────────────────────

    private String mapCareer(String raw) {
        if (raw.isBlank()) return "";
        return switch (raw) {
            // Engineering
            case "MECATRONICA"                          -> "Ingeniería en Mecatrónica";
            case "CIVIL"                                -> "Ingeniería Civil";
            case "INDUSTRIAL"                           -> "Ingeniería Industrial";
            case "SISTEMAS"                             -> "Ingeniería en Sistemas de Información";
            case "ELECTRONICA"                          -> "Ingeniería Electrónica";
            case "QUIMICA"                              -> "Ingeniería Química";
            case "PETROLERA"                            -> "Ingeniería en Petróleo";
            case "COMPUTACION"                          -> "Licenciatura en Ciencias de la Computación";
            // Architecture / Arts & Design
            case "ARQUITECTURA"                         -> "Arquitectura";
            case "DISENO", "DISENO INDUSTRIAL"          -> "Diseño Industrial";
            // Economics
            case "ADMINISTRACION"                       -> "Licenciatura en Administración";
            case "CONTADOR", "CONTADURIA", "CONTABILIDAD" -> "Contador Público Nacional";
            case "ECONOMIA"                             -> "Licenciatura en Economía";
            // Law
            case "ABOGACIA", "ABOGADO"                  -> "Abogacía";
            case "NOTARIADO"                            -> "Notariado";
            // Medicine
            case "MEDICINA"                             -> "Medicina";
            case "ENFERMERIA"                           -> "Enfermería";
            case "NUTRICION"                            -> "Nutrición";
            // Exact Sciences
            case "MATEMATICA"                           -> "Licenciatura en Matemática";
            case "FISICA"                               -> "Licenciatura en Física";
            case "BIOLOGIA"                             -> "Licenciatura en Biología";
            // Philosophy & Letters
            case "FILOSOFIA"                            -> "Filosofía";
            case "HISTORIA"                             -> "Historia";
            case "LETRAS"                               -> "Letras";
            case "GEOGRAFIA"                            -> "Geografía";
            // Dentistry
            case "ODONTOLOGIA"                          -> "Odontología";
            default                                     -> capitalize(raw);
        };
    }

    // ── Legacy: no slash, career keyword only (backward compatibility) ───────

    private String mapLegacyCareer(String raw) {
        return switch (raw) {
            case "MECATRONICA"  -> "Ingeniería en Mecatrónica";
            case "CIVIL"        -> "Ingeniería Civil";
            case "INDUSTRIAL"   -> "Ingeniería Industrial";
            case "COMPUTACION"  -> "Licenciatura en Ciencias de la Computación";
            case "ARQUITECTURA" -> "Arquitectura";
            case "SISTEMAS"     -> "Ingeniería en Sistemas de Información";
            case "ELECTRONICA"  -> "Ingeniería Electrónica";
            default             -> capitalize(raw);
        };
    }

    private String inferFacultyFromCareer(String raw) {
        return switch (raw) {
            case "MECATRONICA", "CIVIL", "INDUSTRIAL", "COMPUTACION",
                 "SISTEMAS", "ELECTRONICA", "QUIMICA", "PETROLERA"
                    -> "Facultad de Ingeniería";
            case "ARQUITECTURA", "DISENO", "DISENO INDUSTRIAL"
                    -> "Facultad de Artes y Diseño";
            case "ADMINISTRACION", "CONTADOR", "CONTADURIA",
                 "CONTABILIDAD", "ECONOMIA"
                    -> "Facultad de Ciencias Económicas";
            case "ABOGACIA", "ABOGADO", "NOTARIADO"
                    -> "Facultad de Derecho";
            case "MEDICINA", "ENFERMERIA", "NUTRICION"
                    -> "Facultad de Ciencias Médicas";
            case "MATEMATICA", "FISICA", "BIOLOGIA"
                    -> "Facultad de Ciencias Exactas y Naturales";
            case "FILOSOFIA", "HISTORIA", "LETRAS", "GEOGRAFIA"
                    -> "Facultad de Filosofía y Letras";
            case "ODONTOLOGIA"
                    -> "Facultad de Odontología";
            default -> "";
        };
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String capitalize(String s) {
        if (s == null || s.isBlank()) return s;
        String lower = s.toLowerCase(Locale.ROOT);
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }
}
