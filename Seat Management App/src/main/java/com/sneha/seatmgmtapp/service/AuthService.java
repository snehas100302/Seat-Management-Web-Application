package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.LoginRequest;
import com.sneha.seatmgmtapp.dto.request.UserRegistrationRequest;
import com.sneha.seatmgmtapp.dto.response.UserResponse;
import com.sneha.seatmgmtapp.utils.ApiResponseBody;

import java.util.List;

public interface AuthService {
    UserResponse register(UserRegistrationRequest request);
    ApiResponseBody<?> login(LoginRequest request);
    List<UserResponse> getAllUsers();
}

