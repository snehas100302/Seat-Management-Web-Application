package com.sneha.seatmgmtapp.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Role enum with display names, short codes and database values.
 * Mirrors the utility behaviour provided in `Gender` for consistent parsing/serialization.
 */
public enum UserRole {
	ADMIN("Admin", "ADMIN", "admin"),
	ADMISSION_OFFICER("Admission Officer", "ADMISSION_OFFICER", "admission_officer"),
	MANAGEMENT("Management", "MANAGEMENT", "management");

	private final String displayName;

	@Getter
	private final String code;

	@Getter
	private final String dbValue;

	// Lookup maps for efficient searching
	private static final Map<String, UserRole> BY_DISPLAY_NAME = Arrays.stream(values())
			.collect(Collectors.toMap(r -> r.displayName, Function.identity()));

	private static final Map<String, UserRole> BY_CODE = Arrays.stream(values())
			.collect(Collectors.toMap(r -> r.code, Function.identity()));

	private static final Map<String, UserRole> BY_DB_VALUE = Arrays.stream(values())
			.collect(Collectors.toMap(r -> r.dbValue, Function.identity()));

	UserRole(String displayName, String code, String dbValue) {
		this.displayName = displayName;
		this.code = code;
		this.dbValue = dbValue;
	}

	/**
	 * Returns the display name for JSON serialization.
	 */
	@JsonValue
	public String getDisplayName() {
		return displayName;
	}

	public static Optional<UserRole> fromDisplayName(String displayName) {
		if (displayName == null) return Optional.empty();
		return BY_DISPLAY_NAME.entrySet().stream()
				.filter(e -> e.getKey().equalsIgnoreCase(displayName.trim()))
				.map(Map.Entry::getValue)
				.findFirst();
	}

	public static Optional<UserRole> fromCode(String code) {
		if (code == null) return Optional.empty();
		return BY_CODE.entrySet().stream()
				.filter(e -> e.getKey().equalsIgnoreCase(code.trim()))
				.map(Map.Entry::getValue)
				.findFirst();
	}

	public static Optional<UserRole> fromDbValue(String dbValue) {
		if (dbValue == null) return Optional.empty();
		return BY_DB_VALUE.entrySet().stream()
				.filter(e -> e.getKey().equalsIgnoreCase(dbValue.trim()))
				.map(Map.Entry::getValue)
				.findFirst();
	}

	/**
	 * JSON deserialization support. Accepts display name, code, enum name, or dbValue for flexibility.
	 */
	@JsonCreator
	public static UserRole fromString(String value) {
		if (value == null || value.trim().isEmpty()) return null;
		String trimmed = value.trim();

		Optional<UserRole> r = fromDisplayName(trimmed);
		if (r.isPresent()) return r.get();

		r = fromCode(trimmed);
		if (r.isPresent()) return r.get();

		r = fromDbValue(trimmed);
		if (r.isPresent()) return r.get();

		for (UserRole role : values()) {
			if (role.name().equalsIgnoreCase(trimmed)) return role;
		}

		throw new IllegalArgumentException("Invalid role value: " + value + ". Valid values are: " + Arrays.toString(values()));
	}

	public static boolean isValid(String value) {
		try {
			fromString(value);
			return true;
		} catch (IllegalArgumentException e) {
			return false;
		}
	}

	public static String[] getAllDisplayNames() {
		return Arrays.stream(values()).map(UserRole::getDisplayName).toArray(String[]::new);
	}

	public static String[] getAllCodes() {
		return Arrays.stream(values()).map(UserRole::getCode).toArray(String[]::new);
	}

	@Override
	public String toString() {
		return displayName;
	}
}

