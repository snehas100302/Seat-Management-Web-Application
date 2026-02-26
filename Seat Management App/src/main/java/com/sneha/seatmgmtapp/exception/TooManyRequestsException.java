package com.sneha.seatmgmtapp.exception;

import java.io.Serial;

/**
 * Exception thrown when rate limit is exceeded.
 */
public class TooManyRequestsException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public TooManyRequestsException(String message) {
        super(message);
    }

    public TooManyRequestsException(String message, Throwable cause) {
        super(message, cause);
    }
}

