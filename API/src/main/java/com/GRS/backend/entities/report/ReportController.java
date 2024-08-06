package com.GRS.backend.entities.report;

import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Object> getAllReports(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(name = "page_size", defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(name = "sort_order", defaultValue = "asc") String sortOrder) {

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        Page<Report> allReports = reportService.getAllReports(search, pageable);

        return Response.responseBuilder("Reports retrieved successfully", HttpStatus.OK, allReports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<Object> getReportById(@PathVariable int reportId) {
        Optional<Report> reportToAdd = reportService.getReportById(reportId);
        if (reportToAdd.isPresent()) {
            return Response.responseBuilder("Report found successfully", HttpStatus.OK, reportToAdd);
        } else {
            return Response.responseBuilder("Failed to find report", HttpStatus.OK, null);
        }
    }

    @PostMapping
    public ResponseEntity<Object> addReport(@RequestBody Report report) {
        Report createdReport = reportService.addReport(report);
        return Response.responseBuilder("Report added successfully", HttpStatus.OK, createdReport);
    }

    @PatchMapping("/{reportId}")
    public ResponseEntity<Object> updateReport(@RequestBody Report report, @PathVariable int reportId) {
        Report updatedReport = reportService.updateReport(reportId, report);
        return Response.responseBuilder("Report updated successfully", HttpStatus.OK, updatedReport);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Object> deleteReport(@PathVariable int reportId) {
        reportService.deleteReport(reportId);
        return Response.responseBuilder("Report deleted successfully", HttpStatus.OK, null);
    }
}
