package com.sneha.seatmgmtapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration for the application.
 * Provides different configurations for development and production environments.
 *
 * @author Sneha A S
 * @since 1.0
 */
@Configuration
public class CorsConfig {

    @Bean
    @Profile("dev")
    CorsConfigurationSource corsConfigurationSourceDev() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:8080",
                "http://localhost:8085",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://192.168.1.12:8080",
                "http://192.168.1.12:8085",
                "http://localhost:8081",
                "http://localhost:19000",
                "null"
        ));

        return getCorsConfigurationSource(corsConfiguration);
    }


    @Bean
    @Primary
    @Profile("prod")
    CorsConfigurationSource corsConfigurationSourceProd() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(List.of("", "null"));
        return getCorsConfigurationSource(corsConfiguration);
    }

    private CorsConfigurationSource getCorsConfigurationSource(CorsConfiguration corsConfiguration) {
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}

