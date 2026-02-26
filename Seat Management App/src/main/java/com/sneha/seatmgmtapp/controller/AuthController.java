package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.LoginRequest;
import com.sneha.seatmgmtapp.dto.request.UpdateProfileRequest;
import com.sneha.seatmgmtapp.dto.request.UserRegistrationRequest;
import com.sneha.seatmgmtapp.dto.response.UserResponse;
import com.sneha.seatmgmtapp.service.AuthService;
import com.sneha.seatmgmtapp.utils.ApiResponseBody;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration and login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Register a new user (Admin only)")
    public ResponseEntity<ApiResponseBody<UserResponse>> register(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "User login")
    public ResponseEntity<ApiResponseBody<?>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (Admin only)")
    public ResponseEntity<ApiResponseBody<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = authService.getAllUsers();
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Users fetched", users));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER','MANAGEMENT')")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponseBody<UserResponse>> getProfile(Authentication authentication) {
        Long userId = (authentication instanceof com.sneha.seatmgmtapp.config.security.JwtAuthenticationToken token)
                ? token.getId() : null;
        if (userId == null) {
            throw new IllegalStateException("Unable to resolve authenticated user");
        }
        UserResponse profile = authService.getProfile(userId);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Profile fetched", profile));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('ADMIN','ADMISSION_OFFICER','MANAGEMENT')")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponseBody<UserResponse>> updateProfile(Authentication authentication,
                                                                       @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = (authentication instanceof com.sneha.seatmgmtapp.config.security.JwtAuthenticationToken token)
                ? token.getId() : null;
        if (userId == null) {
            throw new IllegalStateException("Unable to resolve authenticated user");
        }
        UserResponse profile = authService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Profile updated", profile));
    }
}

