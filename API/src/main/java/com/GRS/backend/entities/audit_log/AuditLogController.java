package com.GRS.backend.entities.audit_log;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/auditLog")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<Object> getAllAuditLogs(@QueryParams(sortBy = "createdAt") QueryArgumentResolver.QueryParamsContainer queryParams) {

        String search = queryParams.getSearch();
        String searchBy = queryParams.getSearchBy();
        Pageable pageable = queryParams.getPageable();
        LocalDate startDate = queryParams.getStartDate();
        LocalDate endDate = queryParams.getEndDate();

        Page<AuditLog> allAuditLogs = auditLogService.getAllAuditLogs(search, searchBy, pageable, startDate, endDate);

        return Response.responseBuilder("Audit Logs retrieved successfully", HttpStatus.OK, allAuditLogs);

    }
    
}
