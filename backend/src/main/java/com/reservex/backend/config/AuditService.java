package com.reservex.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j

public class AuditService {
    public void log(String username, String action, String detail) {
        log.info("[AUDIT] user={} action={} detail={}", username, action, detail);
    }
}
