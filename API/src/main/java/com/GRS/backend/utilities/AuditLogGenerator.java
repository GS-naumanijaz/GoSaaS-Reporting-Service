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

    public void log(AuditLogAction action, AuditLogModule module, String moduleAlias, String username) {

        String details = "User " + username + " " + action + " " + module + " '" + moduleAlias + "'";

        AuditLog auditLog = new AuditLog(module, action, details, username);
        auditLogService.addAuditLog(auditLog);
    }

    public void log(AuditLogAction action, AuditLogModule module, String moduleAlias, String username, String appAlias) {

        String details = "User " + username + " " + action + " " + module + " '" + moduleAlias + "' in APPLICATION '" + appAlias + "'";

        AuditLog auditLog = new AuditLog(module, action, details, username);
        auditLogService.addAuditLog(auditLog);
    }

    public void logBulk(AuditLogAction action, AuditLogModule module, String[] moduleAlaises, String username, String appAlias) {

        String details = "User " + username + " BULK " + action + " " + module + "'s " + arrayToString(moduleAlaises) + " in APPLICATION '" + appAlias + "'";

        AuditLog auditLog = new AuditLog(module, action, details, username);
        auditLogService.addAuditLog(auditLog);
    }

    public void logBulk(AuditLogAction action, AuditLogModule module, List<String> moduleIds, String username, String appId) {
        // Convert List<Integer> to int[]
        String[] moduleIdArray = moduleIds.stream()
                .map(String::valueOf)
                .toArray(String[]::new);


        String details = "User " + username + " BULK " + action + " " + module + "'s " + arrayToString(moduleIdArray) + " in APPLICATION '" + appId + "'";

        AuditLog auditLog = new AuditLog(module, action, details, username);
        auditLogService.addAuditLog(auditLog);
    }


    private String arrayToString(String[] array) {
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

