package com.sneha.seatmgmtapp.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
@Slf4j
public class LogDirectoryInitializer {

    @Value("${app.logging.dir:${user.dir}/logs}")
    private String logDir;

    @PostConstruct
    public void ensureLogDirectories() {
        try {
            File base = new File(logDir);
            if (!base.exists()) {
                boolean ok = base.mkdirs();
                if (ok) {
                    log.info("Created log directory: {}", base.getAbsolutePath());
                } else {
                    log.warn("Failed to create log directory: {}", base.getAbsolutePath());
                }
            }

            File mailDir = new File(base, "mail");
            if (!mailDir.exists()) {
                boolean ok = mailDir.mkdirs();
                if (ok) {
                    log.info("Created mail log directory: {}", mailDir.getAbsolutePath());
                } else {
                    log.warn("Failed to create mail log directory: {}", mailDir.getAbsolutePath());
                }
            }
        } catch (Exception e) {
            log.error("Error while creating log directories", e);
        }
    }
}

