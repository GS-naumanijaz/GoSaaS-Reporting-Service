package com.GRS.backend.entities.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping
    public ResponseEntity<Page<Report>> getAllReports(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(name = "page_size", defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "reportId") String sortBy,
            @RequestParam(name = "sort_order", defaultValue = "asc") String sortOrder) {

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.fromString(sortOrder), sortBy));
        Page<Report> reports = reportService.getAllReports(search, pageable);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<Report> getReportById(@PathVariable int reportId) {
        Optional<Report> report = reportService.getReportById(reportId);
        return report.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addReport(@RequestBody Report report) {
        Report createdReport = reportService.addReport(report);
        Map<String, Object> response = createResponse("Report added successfully", createdReport);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{reportId}")
    public ResponseEntity<Map<String, Object>> updateReport(@RequestBody Report report, @PathVariable int reportId) {
        Report updatedReport = reportService.updateReport(reportId, report);
        if (updatedReport == null) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = createResponse("Report updated successfully", updatedReport);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Map<String, String>> deleteReport(@PathVariable int reportId) {
        reportService.deleteReport(reportId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Report deleted successfully");
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createResponse(String message, Report report) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("report", report);
        return response;
    }
}
