package com.sneha.seatmgmtapp.config;

import com.sneha.seatmgmtapp.entity.User;
import com.sneha.seatmgmtapp.enums.UserRole;
import com.sneha.seatmgmtapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds the database with a default admin user on first startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) {
		if (!userRepository.existsByUsername("admin")) {
			User admin = User.builder()
					.username("admin")
					.password(passwordEncoder.encode("admin123"))
					.fullName("System Administrator")
					.email("admin@seatmgmt.com")
					.role(UserRole.ADMIN)
					.isActive(true)
					.isDeleted(false)
					.build();
			userRepository.save(admin);
			log.info("Default admin user created: admin / admin123");
		}

		if (!userRepository.existsByUsername("officer@institution.edu")) {
			User officer = User.builder()
					.username("officer@institution.edu")
					.password(passwordEncoder.encode("officer123"))
					.fullName("Admission Officer")
					.email("officer@institution.edu")
					.role(UserRole.ADMISSION_OFFICER)
					.isActive(true)
					.isDeleted(false)
					.build();
			userRepository.save(officer);
			log.info("Default officer user created: officer@institution.edu / officer123");
		}
	}
}

