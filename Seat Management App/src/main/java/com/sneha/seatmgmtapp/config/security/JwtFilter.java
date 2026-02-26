package com.sneha.seatmgmtapp.config.security;

import com.sneha.seatmgmtapp.service.UserLookupService;
import com.sneha.seatmgmtapp.service.impl.JwtOtpService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

/**
 * JWT Authentication Filter.
 * Validates JWT tokens and sets authentication in the security context.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final List<UserLookupService> userLookupServices;
    private final JwtOtpService jwtOtpService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String token = request.getHeader("Authorization");

        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);

            try {
                // Use JwtOtpService to validate token and extract claims
                if (!jwtOtpService.validateToken(token)) {
                    log.debug("JWT validation failed for token");
                } else {
                    String mobileNumber = jwtOtpService.extractMobileNumber(token);
                    Long id = jwtOtpService.extractId(token);
                    String roleClaim = jwtOtpService.extractRole(token);

                    String normalizedRole = roleClaim == null ? "" : (roleClaim.startsWith("ROLE_") ? roleClaim : "ROLE_" + roleClaim);

                    if (mobileNumber != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        try {
                            UserLookupService provider = userLookupServices.stream()
                                    .filter(s -> {
                                        String pid = s.providerId();
                                        return pid != null && (pid.equalsIgnoreCase(normalizedRole) || pid.equalsIgnoreCase(roleClaim));
                                    })
                                    .findFirst().orElse(null);

                            log.debug("JWT filter: mobile={}, roleClaim={}, normalizedRole={}, providerFound={}", mobileNumber, roleClaim, normalizedRole, provider != null);

                            if (provider != null) {
                                try {
                                    UserDetails userDetails = provider.loadByMobile(mobileNumber);

                                    JwtAuthenticationToken authentication = new JwtAuthenticationToken(
                                            mobileNumber,
                                            id,
                                            userDetails.getAuthorities());
                                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                    SecurityContextHolder.getContext().setAuthentication(authentication);
                                } catch (UsernameNotFoundException unfe) {
                                    log.debug("Provider {} could not load user {}: {}. Falling back to minimal authentication.", provider.providerId(), mobileNumber, unfe.getMessage());
                                    JwtAuthenticationToken authentication = new JwtAuthenticationToken(
                                            mobileNumber,
                                            id,
                                            Collections.singletonList(new SimpleGrantedAuthority(normalizedRole)));
                                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                    SecurityContextHolder.getContext().setAuthentication(authentication);
                                }
                            } else {
                                JwtAuthenticationToken authentication = new JwtAuthenticationToken(
                                        mobileNumber,
                                        id,
                                        Collections.singletonList(new SimpleGrantedAuthority(normalizedRole)));
                                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                            }

                        } catch (Exception e) {
                            log.warn("Authentication processing failed: {}", e.getMessage());
                            JwtAuthenticationToken authentication = new JwtAuthenticationToken(
                                    mobileNumber,
                                    id,
                                    Collections.singletonList(new SimpleGrantedAuthority(normalizedRole)));
                            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                        }
                    }
                }
            } catch (Exception e) {
                log.debug("JWT processing failed: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
