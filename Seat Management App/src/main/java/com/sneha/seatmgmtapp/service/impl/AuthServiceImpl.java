package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.LoginRequest;
import com.sneha.seatmgmtapp.dto.request.UpdateProfileRequest;
import com.sneha.seatmgmtapp.dto.request.UserRegistrationRequest;
import com.sneha.seatmgmtapp.dto.response.UserResponse;
import com.sneha.seatmgmtapp.entity.User;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.UserRepository;
import com.sneha.seatmgmtapp.service.AuthService;
import com.sneha.seatmgmtapp.service.JwtService;
import com.sneha.seatmgmtapp.utils.ApiResponseBody;
import com.sneha.seatmgmtapp.utils.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;

	@Override
	public UserResponse register(UserRegistrationRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new IllegalArgumentException("Username '" + request.getUsername() + "' already exists");
		}

		User user = User.builder()
				.username(request.getUsername())
				.password(passwordEncoder.encode(request.getPassword()))
				.fullName(request.getFullName())
				.email(request.getEmail())
				.phone(request.getPhone())
				.role(request.getRole())
				.build();
		user = userRepository.save(user);
		log.info("Registered user: {} with role: {}", user.getUsername(), user.getRole());
		return EntityMapper.toUserResponse(user);
	}

	@Override
	public ApiResponseBody<?> login(LoginRequest request) {
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new ResourceNotFoundException("User", "username", request.getUsername()));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new IllegalArgumentException("Invalid credentials");
		}

		if (!user.isEnabled()) {
			throw new IllegalArgumentException("User account is disabled");
		}

		String role = "ROLE_" + user.getRole().name();
		String accessToken = jwtService.generateOtpToken(user.getUsername(), user.getId(), role);
		String refreshToken = jwtService.generateRefreshToken(user.getUsername(), user.getId(), role);

		log.info("User logged in: {} with role: {}", user.getUsername(), user.getRole());

		return ApiResponseBody.successWithTokens(
				HttpStatus.OK.value(),
				"Login successful",
				EntityMapper.toUserResponse(user),
				accessToken,
				refreshToken
		);
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponse getProfile(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		return EntityMapper.toUserResponse(user);
	}

	@Override
	public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

		user.setFullName(request.getFullName());
		user.setEmail(request.getEmail());
		user.setPhone(request.getPhone());
		if (request.getPassword() != null && !request.getPassword().isBlank()) {
			user.setPassword(passwordEncoder.encode(request.getPassword()));
		}
		user = userRepository.save(user);
		return EntityMapper.toUserResponse(user);
	}

	@Override
	@Transactional(readOnly = true)
	public List<UserResponse> getAllUsers() {
		return userRepository.findAll().stream()
				.map(EntityMapper::toUserResponse).toList();
	}
}

