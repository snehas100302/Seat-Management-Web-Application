package com.sneha.seatmgmtapp.exception;

import java.io.Serial;

/**
 * Exception thrown when OTP validation fails.
 */
public class InvalidOtpException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public InvalidOtpException(String message) {
        super(message);
    }

    public InvalidOtpException(String message, Throwable cause) {
        super(message, cause);
    }
}

