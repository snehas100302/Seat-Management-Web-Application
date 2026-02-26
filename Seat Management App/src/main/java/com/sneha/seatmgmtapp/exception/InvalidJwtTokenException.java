package com.sneha.seatmgmtapp.exception;

import java.io.Serial;

/**
 * Exception thrown when JWT token is invalid.
 */
public class InvalidJwtTokenException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public InvalidJwtTokenException(String message) {
        super(message);
    }

    public InvalidJwtTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}

