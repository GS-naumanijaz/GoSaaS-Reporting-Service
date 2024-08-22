package com.GRS.backend.entities.audit_log;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuditLogService {
    
    @Autowired
    private AuditLogRepository auditLogRepository;

    public Page<AuditLog> getAllAuditLogs(String search, String searchBy, Pageable pageable, LocalDate startDate, LocalDate endDate) {
        Specification<AuditLog> spec = Specification.where(BaseSpecification.betweenDates("createdAt", startDate, endDate));

        if (search != null && !search.isEmpty()) {
            spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
        }

        return auditLogRepository.findAll(spec, pageable);
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
