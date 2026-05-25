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
     * Title-cased display name; preserves accents, trims and collapses spaces.
     * Example: "  rodriguez   thiago " → "Rodriguez Thiago"
     */
    public static String toDisplayName(String fullName) {
        String canonical = toCanonical(fullName);
        if (canonical.isEmpty()) {
            return "";
        }
        String[] words = canonical.split(" ");
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            if (i > 0) {
                builder.append(' ');
            }
            builder.append(capitalizeWord(words[i]));
        }
        return builder.toString();
    }

    private static String capitalizeWord(String word) {
        if (word.isEmpty()) {
            return word;
        }
        int firstCodePoint = word.codePointAt(0);
        int firstCharCount = Character.charCount(firstCodePoint);
        String first = new String(Character.toChars(Character.toTitleCase(firstCodePoint)));
        if (word.length() == firstCharCount) {
            return first;
        }
        String rest = word.substring(firstCharCount).toLowerCase(Locale.ROOT);
        return first + rest;
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
