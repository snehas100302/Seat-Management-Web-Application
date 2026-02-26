package com.sneha.seatmgmtapp.config.security;

import lombok.Getter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serial;
import java.util.Collection;

/**
 * Custom JWT Authentication Token.
 * Holds the authenticated user's mobile number and ID.
 *
 * @author Orampo Team - Pushkar D
 * @since 1.0.1
 */
@Getter
public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    @Serial
    private static final long serialVersionUID = 1L;

    private final String mobileNumber;
    private final Long id;

    public JwtAuthenticationToken(String mobileNumber, Long id) {
        super((Collection<? extends GrantedAuthority>) null);
        this.mobileNumber = mobileNumber;
        this.id = id;
        setAuthenticated(true);
    }

    public JwtAuthenticationToken(String mobileNumber, Long id, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.mobileNumber = mobileNumber;
        this.id = id;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return "";
    }

    @Override
    public Object getPrincipal() {
        return mobileNumber;
    }

}

