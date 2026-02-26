package com.sneha.seatmgmtapp.exception;

import com.sneha.seatmgmtapp.utils.ApiResponseBody;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.CompletionException;


@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Override default handler for validation failures so we can return our
     * ApiResponseBody instead of Spring's default error JSON.
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(@NonNull MethodArgumentNotValidException ex, @NonNull HttpHeaders headers, @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        List<String> errorMessages = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(fe -> errorMessages.add(fe.getDefaultMessage()));
        log.warn("Validation failed: {}", errorMessages);
        return ResponseEntity.ok().body(ApiResponseBody.success(HttpStatus.BAD_REQUEST.value(), "Validation failed", errorMessages.getFirst()));
    }

    /**
     * This method handles {@link UsernameNotFoundException} exceptions.
     * It creates a custom success response with a message and a specific success
     * code.
     *
     * @param ex The {@link UsernameNotFoundException} exception to handle.
     * @return A {@link ResponseEntity} containing an {@link ApiResponseBody} with
     * success details and HTTP status 200.
     */
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponseBody<?>> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.NOT_FOUND.value(), ex.getMessage(), ""));
    }

    /**
     * This method handles any unhandled exceptions (catch-all).
     * It unwraps CompletionException if necessary and returns appropriate success
     * response.
     *
     * @param ex The {@link Exception} or {@link Throwable} to handle.
     * @return A {@link ResponseEntity} containing an {@link ApiResponseBody} with
     * success details and HTTP status 200.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponseBody<?>> handleAllExceptions(Throwable ex) {
        Throwable actualException = ex;

        // Unwrap CompletionException if needed
        if (ex instanceof CompletionException && ex.getCause() != null) {
            actualException = ex.getCause();
            log.error("Unwrapped exception: {}", actualException.getMessage(), actualException);
        }

        if (actualException instanceof InvalidOtpException) {
            log.error("Handled exception: {}", actualException.getMessage(), actualException);
            return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.UNAUTHORIZED.value(), actualException.getMessage(), ""));
        }

        if (actualException instanceof IllegalArgumentException) {
            log.error("Handled exception: {}", actualException.getMessage(), actualException);
            return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.BAD_REQUEST.value(), actualException.getMessage(), ""));
        }

        // For other exceptions
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Something went wrong", ""));
    }

    /**
     * This method handles {@link InvalidJwtTokenException}.
     *
     * @param ex The exception to handle.
     * @return A {@link ResponseEntity} containing an {@link ApiResponseBody} with
     * success details and HTTP status 200.
     */
    @ExceptionHandler(InvalidJwtTokenException.class)
    public ResponseEntity<ApiResponseBody<?>> handleInvalidJwtTokenException(InvalidJwtTokenException ex) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.UNAUTHORIZED.value(), ex.getMessage(), ""));
    }

    /**
     * This method handles {@link TooManyRequestsException}.
     *
     * @param ex The exception to handle.
     * @return A {@link ResponseEntity} containing an {@link ApiResponseBody} with
     * success details and HTTP status 429.
     */
    @ExceptionHandler(TooManyRequestsException.class)
    public ResponseEntity<ApiResponseBody<?>> handleTooManyRequestsException(TooManyRequestsException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS.value()).body(ApiResponseBody.success(HttpStatus.TOO_MANY_REQUESTS.value(), ex.getMessage(), ""));
    }

    @Override
    protected ResponseEntity<Object> handleNoResourceFoundException(NoResourceFoundException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.NOT_FOUND.value(), "The Server did not process the request -  " + ex.getMessage(), ""));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponseBody<?>> handleNoSuchElementException(NoSuchElementException ex) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.NOT_FOUND.value(), ex.getMessage(), ""));
    }

    /**
     * Handles InvalidOtpException.
     */
    @ExceptionHandler(InvalidOtpException.class)
    public ResponseEntity<ApiResponseBody<?>> handleInvalidOtpException(InvalidOtpException ex) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.UNAUTHORIZED.value(), ex.getMessage(), ""));
    }

    /**
     * Handles {@link ResourceNotFoundException}.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponseBody<?>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.NOT_FOUND.value(), ex.getMessage(), ""));
    }

    /**
     * Handles {@link QuotaFullException}.
     */
    @ExceptionHandler(QuotaFullException.class)
    public ResponseEntity<ApiResponseBody<?>> handleQuotaFullException(QuotaFullException ex) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CONFLICT.value(), ex.getMessage(), ""));
    }
}

