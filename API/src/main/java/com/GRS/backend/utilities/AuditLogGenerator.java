package com.GRS.backend.utilities;

import com.GRS.backend.entities.audit_log.AuditLog;
import com.GRS.backend.entities.audit_log.AuditLogService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuditLogGenerator {

    @Autowired
    private AuditLogService auditLogService;

    // Static instance of the class
    private static AuditLogGenerator instance;

    // Private constructor to prevent instantiation
    private AuditLogGenerator() {
        // Initialize the instance
        instance = this;
    }

    // Method to return the singleton instance
    public static AuditLogGenerator getInstance() {
        if (instance == null) {
            // Handle the case where the instance is not initialized (shouldn't happen with Spring)
            throw new IllegalStateException("AuditLogGenerator is not initialized properly.");
        }
        return instance;
    }

    public void log(AuditLogAction action, AuditLogModule module, int moduleId, int userId) {

        String details = "User " + userId + " " + action + " " + module + " with id " + moduleId;

        AuditLog auditLog = new AuditLog(module, action, details, userId);
        auditLogService.addAuditLog(auditLog);
    }

    public void log(AuditLogAction action, AuditLogModule module, int moduleId, int userId, int appId) {

        String details = "User " + userId + " " + action + " " + module + " with id " + moduleId + " in APPLICATION with id " + appId;

        AuditLog auditLog = new AuditLog(module, action, details, userId);
        auditLogService.addAuditLog(auditLog);
    }

    public void logBulk(AuditLogAction action, AuditLogModule module, int[] moduleIds, int userId, int appId) {

        String details = "User " + userId + " BULK " + action + " " + module + " with ids " + arrayToString(moduleIds) + " in APPLICATION with id " + appId;

        AuditLog auditLog = new AuditLog(module, action, details, userId);
        auditLogService.addAuditLog(auditLog);
    }

    public void logBulk(AuditLogAction action, AuditLogModule module, List<Integer> moduleIds, int userId, int appId) {
        // Convert List<Integer> to int[]
        int[] moduleIdArray = moduleIds.stream().mapToInt(Integer::intValue).toArray();

        String details = "User " + userId + " BULK " + action + " " + module + " with ids " + arrayToString(moduleIdArray) + " in APPLICATION with id " + appId;

        AuditLog auditLog = new AuditLog(module, action, details, userId);
        auditLogService.addAuditLog(auditLog);
    }


    private String arrayToString(int[] array) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < array.length; i++) {
            sb.append(array[i]);
            if (i < array.length - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }
}

