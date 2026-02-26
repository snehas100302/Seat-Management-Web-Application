package com.sneha.seatmgmtapp.service;

import org.springframework.security.core.userdetails.UserDetails;

/**
 * Lookup abstraction used by shared security components to resolve a user by mobile
 * and to indicate which role/provider it supports.
 */
public interface UserLookupService {

    /**
     * Provider id (should match role claim value), e.g. "ROLE_USER" or "ROLE_PARTNER".
     */
    String providerId();

    /**
     * Load UserDetails by mobile number. Throw UsernameNotFoundException if not found.
     */
    UserDetails loadByMobile(String mobile);
}

