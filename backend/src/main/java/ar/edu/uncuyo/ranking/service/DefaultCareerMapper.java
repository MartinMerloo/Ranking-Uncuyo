package ar.edu.uncuyo.ranking.service;

import ar.edu.uncuyo.ranking.dto.ClubCareerMapping;

import java.util.Locale;

public final class DefaultCareerMapper {

    public static final String DEFAULT_CAREER = "Sin especificar";

    private DefaultCareerMapper() {
    }

    public static ClubCareerMapping suggest(String clubCiudad) {
        if (clubCiudad == null || clubCiudad.isBlank()) {
            return new ClubCareerMapping("", "");
        }

        String normalized = clubCiudad.trim().toUpperCase(Locale.ROOT)
                .replace("Ó", "O")
                .replace("Í", "I")
                .replace("Á", "A")
                .replace("É", "E")
                .replace("Ú", "U");

        if (normalized.contains("INDUSTRIAL")) {
            return new ClubCareerMapping("Facultad de Ingeniería", "Ingeniería Industrial");
        }
        if (normalized.contains("MECATRONICA") || normalized.contains("MECATRONI")) {
            return new ClubCareerMapping("Facultad de Ingeniería", "Ingeniería en Mecatrónica");
        }
        if (normalized.contains("COMPUTACION")) {
            return new ClubCareerMapping("Facultad de Ingeniería", "Ingeniería en Computación");
        }
        if (normalized.contains("ARQUITECTURA") || normalized.contains("ARQUITECTECT")) {
            return new ClubCareerMapping("Facultad de Ingeniería", "Arquitectura");
        }
        if (normalized.contains("CIVIL")) {
            return new ClubCareerMapping("Facultad de Ingeniería", "Ingeniería Civil");
        }
        if (normalized.contains("DERECHO")) {
            return new ClubCareerMapping("Facultad de Derecho", "Derecho");
        }
        if (normalized.contains("MEDICINA") || normalized.contains("MEDICA")) {
            return new ClubCareerMapping("Facultad de Ciencias Médicas", "Medicina");
        }
        if (normalized.contains("EXACTAS")) {
            return new ClubCareerMapping("Facultad de Ciencias Exactas y Naturales", DEFAULT_CAREER);
        }

        return new ClubCareerMapping("", "");
    }
}
