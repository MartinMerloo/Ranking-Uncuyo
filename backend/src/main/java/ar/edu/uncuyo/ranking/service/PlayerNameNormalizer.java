package ar.edu.uncuyo.ranking.service;

import java.util.Locale;

/**
 * Normalizes player full names for duplicate detection during tournament import.
 */
public final class PlayerNameNormalizer {

    private PlayerNameNormalizer() {
    }

    /**
     * Canonical form for persistence: trimmed with single spaces between words.
     */
    public static String toCanonical(String fullName) {
        if (fullName == null) {
            return "";
        }
        return fullName.trim().replaceAll("\\s+", " ");
    }

    /**
     * Normalized key for comparison: canonical + lowercase (locale-root).
     */
    public static String normalize(String fullName) {
        return toCanonical(fullName).toLowerCase(Locale.ROOT);
    }

    public static boolean areSamePerson(String left, String right) {
        return normalize(left).equals(normalize(right));
    }
}
