package com.GRS.backend.entities.report;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.entities.source_connection.SourceConnectionService;
import com.GRS.backend.resolver.QueryArgumentResolver;
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

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private SourceConnectionService sourceConnectionService;

    @GetMapping
    public ResponseEntity<Object> getAllReports(@QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        Pageable pageable = paginationParams.getPageable();

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

    @PostMapping("/{appId}")
    public ResponseEntity<Object> addReport(@RequestBody Report report, @PathVariable int appId) {
        Optional<Application> reportApp = applicationService.getApplicationById(appId);

        report.setApplication(reportApp.get());
//        reportApp.get().addReport(report);

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

    @PutMapping("/{reportId}/source-connections/{sourceId}")
    public ResponseEntity<Object> connectSourceToReport(@PathVariable int reportId, @PathVariable int sourceId) {
        Report report = reportService.getReportById(reportId).get();
        SourceConnection sourceConnection = sourceConnectionService.getSourceConnectionById(sourceId).get();

        sourceConnection.addReport(report);

        sourceConnectionService.addSourceConnection(sourceConnection);
        reportService.addReport(report);

        return Response.responseBuilder("Source Connection connected to Report Successfully", HttpStatus.OK, null);
    }

}
