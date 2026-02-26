package com.sneha.seatmgmtapp.config.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT Utility class for token generation and validation.
 *
 * @author Orampo Team
 * @since 1.0
 */
@Component
public class JwtUtils {

    @Value("${jwt.secret.key}")
    private String secret;

    private SecretKey key;

    private SecretKey getSigningKey() {
        if (key == null) {
            byte[] keyBytes = Decoders.BASE64.decode(secret);
            this.key = Keys.hmacShaKeyFor(keyBytes);
        }
        return key;
    }

    /**
     * Generates a JWT token for the given user details.
     *
     * @param mobileNumber User's mobile number
     * @param id           User's ID
     * @param role         User's role
     * @return Generated JWT token
     */
    public String generateToken(String mobileNumber, Long id, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("mobileNumber", mobileNumber);
        claims.put("id", id);
        claims.put("role", role);

        return Jwts.builder()
                .claims(claims)
                .subject(mobileNumber)
                .issuedAt(new Date())
//                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validates the given JWT token.
     *
     * @param token JWT token to validate
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extracts mobile number from the JWT token.
     *
     * @param token JWT token
     * @return Mobile number
     */
    public String extractMobileNumber(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("mobileNumber", String.class);
    }

    /**
     * Extracts user ID from the JWT token.
     *
     * @param token JWT token
     * @return User ID
     */
    public Long extractId(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("id", Long.class);
    }

    /**
     * Extracts role from the JWT token.
     *
     * @param token JWT token
     * @return User role
     */
    public String extractRole(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }
}

