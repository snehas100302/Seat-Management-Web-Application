package com.sneha.seatmgmtapp.service;

import io.jsonwebtoken.Claims;

import java.util.function.Function;

/**
 * Public API for JWT operations. Implementations live in the shared module.
 */
public interface JwtService {

    String generateOtpToken(String mobileNumber, Long id, String role);

    // include role so refresh token can carry role claim
    String generateRefreshToken(String mobileNumber, Long id, String role);

    String refreshAccessToken(String refreshToken);

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    String extractMobileNumber(String token);

    Long extractId(String token);

    String extractRole(String token);

    boolean isRefreshToken(String token);

    boolean isAccessToken(String token);

    boolean validateToken(String token);

    boolean validateOtpToken(String token);

    boolean validateRefreshToken(String token);
}
