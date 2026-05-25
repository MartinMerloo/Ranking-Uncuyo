package ar.edu.uncuyo.ranking.service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

/**
 * Canonical UNCuyo faculty names (aligned with frontend/lib/faculties.ts).
 */
public final class UncuyoFacultyCatalog {

    private static final List<String> FACULTIES = List.of(
            "Facultad de Ciencias Políticas y Sociales",
            "Facultad de Artes y Diseño",
            "Facultad de Ingeniería",
            "Facultad de Filosofía y Letras",
            "Facultad de Ciencias Médicas",
            "Facultad de Derecho",
            "Facultad de Ciencias Económicas",
            "Facultad de Ciencias Exactas y Naturales",
            "Facultad de Educación",
            "Facultad de Ciencias Agrarias",
            "Facultad de Odontología",
            "Facultad de Ciencias Aplicadas a la Industria");

    private UncuyoFacultyCatalog() {
    }

    public static List<String> allFaculties() {
        return FACULTIES;
    }

    /**
     * Resolves raw Excel faculty text to a canonical faculty name when possible.
     */
    public static String resolve(String raw) {
        if (raw == null || raw.isBlank()) {
            return "";
        }
        String trimmed = raw.trim();
        String normalizedInput = normalizeKey(trimmed);

        for (String faculty : FACULTIES) {
            if (normalizeKey(faculty).equals(normalizedInput)) {
                return faculty;
            }
        }

        for (String faculty : FACULTIES) {
            String normalizedFaculty = normalizeKey(faculty);
            if (normalizedFaculty.contains(normalizedInput) || normalizedInput.contains(normalizedFaculty)) {
                return faculty;
            }
        }

        if (!trimmed.toLowerCase(Locale.ROOT).startsWith("facultad")) {
            String withPrefix = "Facultad de " + trimmed;
            for (String faculty : FACULTIES) {
                if (normalizeKey(faculty).equals(normalizeKey(withPrefix))) {
                    return faculty;
                }
            }
        }

        return trimmed;
    }

    static String normalizeKey(String value) {
        String withoutAccents = Normalizer.normalize(value.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.toUpperCase(Locale.ROOT).replaceAll("\\s+", " ");
    }
}
