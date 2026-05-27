package ar.edu.uncuyo.ranking.service;

import org.springframework.stereotype.Component;

/**
 * Parses the Club/Ciudad field from Chess Results / Swiss Manager exports.
 *
 * Convention: "INGENIERIA/MECATRONICA"
 *   → faculty = "Facultad de Ingeniería"  (exact name from faculties library)
 *   → career  = "Mecatronica"             (right side, first-letter capitalized)
 *
 * Legacy (no slash): infer faculty from career name for backward compatibility.
 * Null or blank: return empty strings, no exception.
 */
@Component
public class ClubCiudadParser {

    public record ParsedClubCiudad(String faculty, String career) {}

    public ParsedClubCiudad parse(String clubCiudad) {
        if (clubCiudad == null || clubCiudad.isBlank()) {
            return new ParsedClubCiudad("", "");
        }

        String trimmed = clubCiudad.trim();

        if (trimmed.contains("/")) {
            String[] parts = trimmed.split("/", 2);
            String rawFaculty = parts[0].trim().toUpperCase();
            String rawCareer  = parts.length > 1 ? parts[1].trim() : "";
            return new ParsedClubCiudad(mapFaculty(rawFaculty), capitalizeFirst(rawCareer));
        }

        // Legacy format — no slash, backward compatibility
        String upper = trimmed.toUpperCase();
        return new ParsedClubCiudad(inferFacultyLegacy(upper), capitalizeFirst(trimmed));
    }

    // ── Capitalize helper ────────────────────────────────────────────────────
    // "MECATRONICA" → "Mecatronica"   "abogacia" → "Abogacia"   "" → ""

    private String capitalizeFirst(String s) {
        if (s == null || s.isBlank()) return "";
        String lower = s.toLowerCase();
        return Character.toUpperCase(lower.charAt(0)) + lower.substring(1);
    }

    // ── Faculty mapping (left side of "/") ──────────────────────────────────
    // Exact return values must match frontend/lib/faculties.ts

    private String mapFaculty(String raw) {
        return switch (raw) {
            case "INGENIERIA", "INGENIERÍA", "ING"
                -> "Facultad de Ingeniería";

            case "ARTES", "ARTES Y DISENO", "ARTES Y DISEÑO",
                 "ARQ", "ARQUITECTURA"
                -> "Facultad de Artes y Diseño";

            case "ECONOMIA", "ECONOMÍA", "ECO",
                 "CIENCIAS ECONOMICAS", "CIENCIAS ECONÓMICAS"
                -> "Facultad de Ciencias Económicas";

            case "DERECHO", "DER"
                -> "Facultad de Derecho";

            case "MEDICINA", "MED",
                 "CIENCIAS MEDICAS", "CIENCIAS MÉDICAS"
                -> "Facultad de Ciencias Médicas";

            case "EXACTAS", "CIENCIAS EXACTAS",
                 "CIENCIAS EXACTAS Y NATURALES"
                -> "Facultad de Ciencias Exactas y Naturales";

            case "FILOSOFIA", "FILOSOFÍA", "FILO",
                 "FILOSOFIA Y LETRAS", "FILOSOFÍA Y LETRAS"
                -> "Facultad de Filosofía y Letras";

            case "POLITICAS", "POLÍTICAS",
                 "CIENCIAS POLITICAS", "CIENCIAS POLÍTICAS"
                -> "Facultad de Ciencias Políticas y Sociales";

            case "EDUCACION", "EDUCACIÓN"
                -> "Facultad de Educación";

            case "ODONTOLOGIA", "ODONTOLOGÍA", "ODO"
                -> "Facultad de Odontología";

            case "AGRARIAS", "CIENCIAS AGRARIAS"
                -> "Facultad de Ciencias Agrarias";

            case "APLICADAS", "CIENCIAS APLICADAS",
                 "CIENCIAS APLICADAS A LA INDUSTRIA", "CAI"
                -> "Facultad de Ciencias Aplicadas a la Industria";

            // Unknown: return capitalized raw so it's visible in Step 2
            default -> capitalizeFirst(raw);
        };
    }

    // ── Legacy: no slash — infer faculty from career name ───────────────────
    // Only for tournaments imported before the FACULTY/CAREER convention.

    private String inferFacultyLegacy(String upper) {
        return switch (upper) {
            case "MECATRONICA", "MECATRÓNICA",
                 "CIVIL", "INDUSTRIAL", "COMPUTACION", "COMPUTACIÓN",
                 "SISTEMAS", "ELECTRONICA", "ELECTRÓNICA",
                 "QUIMICA", "QUÍMICA", "PETROLERA", "ARQUITECTURA"
                -> "Facultad de Ingeniería";

            case "ADMINISTRACION", "ADMINISTRACIÓN",
                 "CONTADOR", "CONTADURIA", "CONTADURÍA",
                 "ECONOMIA", "ECONOMÍA"
                -> "Facultad de Ciencias Económicas";

            case "ABOGACIA", "ABOGACÍA", "NOTARIADO"
                -> "Facultad de Derecho";

            case "MEDICINA", "ENFERMERIA", "ENFERMERÍA",
                 "NUTRICION", "NUTRICIÓN"
                -> "Facultad de Ciencias Médicas";

            case "MATEMATICA", "MATEMÁTICA", "FISICA", "FÍSICA",
                 "BIOLOGIA", "BIOLOGÍA"
                -> "Facultad de Ciencias Exactas y Naturales";

            case "FILOSOFIA", "FILOSOFÍA", "HISTORIA",
                 "LETRAS", "GEOGRAFIA", "GEOGRAFÍA"
                -> "Facultad de Filosofía y Letras";

            case "ODONTOLOGIA", "ODONTOLOGÍA"
                -> "Facultad de Odontología";

            default -> "";
        };
    }
}
