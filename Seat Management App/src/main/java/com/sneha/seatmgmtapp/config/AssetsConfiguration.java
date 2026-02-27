package com.sneha.seatmgmtapp.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.server.autoconfigure.ServerProperties;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * Configuration for serving static assets (images, icons, etc.)
 * 
 * Supports multiple environments:
 * - Development: http://localhost:8080/assets/ (local file serving)
 * - Production: https://api.seatcms.com/assets/ (custom domain)
 * - AWS S3: https://s3.amazonaws.com/seatcms-assets/ (cloud storage)
 * 
 * The port is read from:
 * 1. Spring Boot server.port property (from environment, YAML, or command-line
 * args)
 * 2. Falls back to 8080 if not configured
 * 
 * Configuration in application.yml:
 * server:
 * port: 8085
 * app:
 * assets:
 * strategy: DYNAMIC # DYNAMIC, STATIC, S3, CDN
 * base-url: # (optional override)
 * context-path: /assets/ # Base path for static resources
 * 
 * The strategy determines how asset URLs are built:
 * - DYNAMIC: Uses server's IP/hostname and port
 * (http://192.168.1.100:8080/assets/)
 * - STATIC: Uses fixed URL from base-url property
 * - S3: Uses AWS S3 bucket URL
 * - CDN: Uses CDN URL from base-url property
 */
@Slf4j
@Data
@Component
@ConfigurationProperties(prefix = "app.assets")
public class AssetsConfiguration {

    // ServerProperties may not always be present in the context; inject optionally
    @Autowired(required = false)
    private ServerProperties serverProperties;

    /**
     * Asset serving strategy
     * - DYNAMIC: Automatically detect server IP and port
     * - STATIC: Use fixed URL from base-url property
     * - S3: Use AWS S3 bucket URL
     * - CDN: Use CDN URL from base-url property
     */
    private String strategy = "DYNAMIC";

    /**
     * Base URL override (used when strategy is STATIC, S3, or CDN)
     * Examples:
     * - https://api.seatcms.com/assets/
     * - https://s3.amazonaws.com/seatcms-assets/
     * - https://cdn.seatcms.com/assets/
     */
    private String baseUrl;

    /**
     * Context path for static resources
     * Default: /assets/
     */
    private String contextPath = "/assets/";

    /**
     * Whether to use HTTPS in DYNAMIC mode
     * Default: false (uses http://)
     */
    private Boolean useHttps = false;

    /**
     * Custom hostname/IP override for DYNAMIC mode
     * If not set, server will auto-detect IP address
     */
    private String hostname;

    /**
     * Default image filename to serve when requested resource is not found
     * Examples: "placeholder.png", "no-image-available.png"
     * Default: "placeholder.png"
     */
    private String defaultImage = "placeholder.png";

    /**
     * Get the effective base URL based on configuration strategy
     *
     * @return The base URL for serving assets
     */
    public String getEffectiveBaseUrl() {
        switch (strategy == null ? "DYNAMIC" : strategy.toUpperCase()) {
            case "DYNAMIC":
                return buildDynamicUrl();
            case "STATIC":
            case "CDN":
            case "S3":
                if (baseUrl == null || baseUrl.isBlank()) {
                    log.warn("Strategy is {} but baseUrl is not configured. Falling back to DYNAMIC mode.", strategy);
                    return buildDynamicUrl();
                }
                return baseUrl;
            default:
                log.warn("Unknown strategy: {}. Falling back to DYNAMIC mode.", strategy);
                return buildDynamicUrl();
        }
    }

    /**
     * Build dynamic URL using server's IP/hostname and port
     *
     * Examples:
     * - http://192.168.1.100:8080/assets/
     * - https://api.seatcms.com:8080/assets/
     * - http://localhost:8080/assets/
     *
     * @return Dynamic URL with protocol, host, port, and context path
     */
    private String buildDynamicUrl() {
        String protocol = Boolean.TRUE.equals(useHttps) ? "https" : "http";
        String host = getHostname();

        // safe default port
        Integer port = 8080;
        if (serverProperties != null && serverProperties.getPort() != null) {
            port = serverProperties.getPort();
        }

        // Don't include port if it's standard (80 for http, 443 for https)
        String urlWithPort;
        if ((Boolean.TRUE.equals(useHttps) && port == 443) || (!Boolean.TRUE.equals(useHttps) && port == 80)) {
            urlWithPort = String.format("%s://%s%s", protocol, host, contextPath);
        } else {
            urlWithPort = String.format("%s://%s:%d%s", protocol, host, port, contextPath);
        }

        // log.info("Dynamic asset base URL: {}", urlWithPort);
        return urlWithPort;
    }

    /**
     * Get the hostname for asset serving
     *
     * Priority:
     * 1. Custom hostname from configuration (if set)
     * 2. Server IP address (auto-detected)
     * 3. "localhost" (fallback)
     *
     * @return Hostname or IP address
     */
    public String getHostname() {
        // If custom hostname is configured, use it
        if (hostname != null && !hostname.isBlank()) {
            log.debug("Using configured hostname: {}", hostname);
            return hostname;
        }

        // Try to auto-detect server IP address
        try {
            String serverIp = InetAddress.getLocalHost().getHostAddress();
            // log.info("Auto-detected server IP address: {}", serverIp);
            return serverIp;
        } catch (UnknownHostException e) {
            log.warn("Could not auto-detect server IP address. Using localhost fallback.", e);
            return "localhost";
        }
    }

    @Override
    public String toString() {
        Integer port = 8080;
        if (serverProperties != null && serverProperties.getPort() != null) {
            port = serverProperties.getPort();
        }
        return "AssetsConfiguration{" +
                "strategy='" + strategy + '\'' +
                ", baseUrl='" + baseUrl + '\'' +
                ", port=" + port +
                ", contextPath='" + contextPath + '\'' +
                ", useHttps=" + useHttps +
                ", hostname='" + hostname + '\'' +
                ", defaultImage='" + defaultImage + '\'' +
                ", effectiveBaseUrl='" + getEffectiveBaseUrl() + '\'' +
                '}';
    }
}
