package com.sneha.seatmgmtapp.utils;

import lombok.*;
import lombok.Builder.Default;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ApiResponseBody<T> {

	@Default
	private Integer code = 200;

	@Default
	private String message = "";

	@Default
	private String errorMsg = "";

	@Default
	private T data = null;

	@Default
	private PaginationDataClass paginationData = PaginationDataClass.builder().build();

	@Default
	private String accessToken = "";

	@Default
	private String refreshToken = "";

	public static <T> ApiResponseBody<T> success(int code, String message, T data, PaginationDataClass paginationData) {
		return new ApiResponseBody<>(code, message, "", data, paginationData, "", "");
	}

	public static <T> ApiResponseBody<T> success(int code, String message, T data) {
		return new ApiResponseBody<>(code, message, "", data, PaginationDataClass.builder().build(), "", "");
	}

	/**
	 * Convenience helper to return both access and refresh tokens separately.
	 */
	public static <T> ApiResponseBody<T> successWithTokens(int code, String message, T data, String accessToken,
														   String refreshToken) {
		return new ApiResponseBody<>(code, message, "", data, PaginationDataClass.builder().build(), accessToken, refreshToken);
	}

	public static <T> ApiResponseBody<T> error(int code, String message, Throwable ex) {
		return new ApiResponseBody<>(code,
				ex.getMessage() != null ? ex.getMessage() : "Null Pointer Exception",
				message, null, PaginationDataClass.builder().build(), "", "");
	}

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	@SuperBuilder
	public static class PaginationDataClass {

		@Default
		public Integer pageNumber = 0;
		@Default
		public Integer pageSize = 0;
		@Default
		public Integer totalPages = 0;
		@Default
		public Long totalElements = 0L;
	}

}