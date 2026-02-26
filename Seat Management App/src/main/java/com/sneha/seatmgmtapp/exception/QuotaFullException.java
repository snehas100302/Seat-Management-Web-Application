package com.sneha.seatmgmtapp.exception;

import java.io.Serial;

/**
 * Exception thrown when trying to allocate a seat in a full quota.
 */
public class QuotaFullException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public QuotaFullException(String message) {
        super(message);
    }
}

