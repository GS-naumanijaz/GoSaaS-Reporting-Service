package com.GRS.backend.entities.audit_log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;

    public Page<AuditLog> getAllAuditLogs(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            //implement search here
        }
        return auditLogRepository.findAll(pageable);
    }

    public Optional<AuditLog> getAuditLogById(int logId) {
        return auditLogRepository.findById(logId);
    }

    public AuditLog addAuditLog(AuditLog auditLog) {
        return auditLogRepository.save(auditLog);
    }

    public AuditLog updateAuditLog(int logId, AuditLog auditLog) {
        Optional<AuditLog> existingAuditLog = auditLogRepository.findById(logId);

        if (existingAuditLog.isPresent()) {
            AuditLog auditLogToUpdate = existingAuditLog.get();

            //validation & updating here


            return auditLogRepository.save(auditLogToUpdate);
        }
        return null;
    }

    public void deleteAuditLog(int logId) {
        auditLogRepository.deleteById(logId);
    }
    
    
}
