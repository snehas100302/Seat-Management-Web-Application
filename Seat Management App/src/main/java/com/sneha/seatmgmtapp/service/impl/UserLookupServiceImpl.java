package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.repository.UserRepository;
import com.sneha.seatmgmtapp.service.UserLookupService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * UserLookupService implementation that resolves users from the User entity.
 */
@Service
@RequiredArgsConstructor
public class UserLookupServiceImpl implements UserLookupService {

    private final UserRepository userRepository;

    @Override
    public String providerId() {
        return "ROLE_USER";
    }

    @Override
    public UserDetails loadByMobile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
}

