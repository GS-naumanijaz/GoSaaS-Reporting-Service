package com.GRS.backend.entities.audit_log;

import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/audit-log")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Object> getAllAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(name = "page_size", defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(name = "sort_order", defaultValue = "asc") String sortOrder) {

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        Page<AuditLog> allAuditLogs = auditLogService.getAllAuditLogs(search, pageable);

        return Response.responseBuilder("Audit Logs retrieved successfully", HttpStatus.OK, allAuditLogs);

    }

    @GetMapping("/{logId}")
    public ResponseEntity<Object> getAuditLogById(@PathVariable int logId) {
        Optional<AuditLog> logToAdd = auditLogService.getAuditLogById(logId);
        if (logToAdd.isPresent()) {
            return Response.responseBuilder("Audit Log found successfully", HttpStatus.OK, logToAdd);
        } else {
            return Response.responseBuilder("Failed to find log", HttpStatus.OK, null);
        }
    }

    @PostMapping
    public ResponseEntity<Object> addAuditLog(@RequestBody AuditLog auditLog) {
        AuditLog createdAuditLog = auditLogService.addAuditLog(auditLog);
        return Response.responseBuilder("Audit Log added successfully", HttpStatus.OK, createdAuditLog);
    }

    @PatchMapping("/{logId}")
    public ResponseEntity<Object> updateAuditLog(@RequestBody AuditLog auditLog, @PathVariable int logId) {
        AuditLog updatedAuditLog = auditLogService.updateAuditLog(logId, auditLog);
        return Response.responseBuilder("Audit Log updated successfully", HttpStatus.OK, updatedAuditLog);
    }

    @DeleteMapping("/{logId}")
    public ResponseEntity<Object> deleteAuditLog(@PathVariable int logId) {
        auditLogService.deleteAuditLog(logId);
        return Response.responseBuilder("Audit Log deleted successfully", HttpStatus.OK, null);
    }
    
}
