package com.GRS.backend.entities.report;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.destination_connection.DestinationConnectionService;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.entities.source_connection.SourceConnectionService;
import com.GRS.backend.models.ReportRequestBody;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/applications/{appId}/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private SourceConnectionService sourceConnectionService;

    @Autowired
    private DestinationConnectionService destinationConnectionService;

    @GetMapping
    public ResponseEntity<Object> getAllReports(@PathVariable int appId, @QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        String searchBy = paginationParams.getSearchBy();
        Pageable pageable = paginationParams.getPageable();

        Page<Report> allReports = reportService.getAllReports(appId, search, searchBy, pageable);

        return Response.responseBuilder("Reports retrieved successfully", HttpStatus.OK, allReports);
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<Object> getReportById(@PathVariable int reportId) {
        Report reportToAdd = reportService.getReportById(reportId);

        return Response.responseBuilder("Report found successfully", HttpStatus.OK, reportToAdd);

    }

    @PostMapping("")
    public ResponseEntity<Object> addReport(@Valid @RequestBody ReportRequestBody reportRequest, @PathVariable int appId) {
        Application reportApp = applicationService.getApplicationById(appId);

        Report report = reportRequest.report;

        report.setApplication(reportApp);

        System.out.println(report.getStoredProcedure());
        System.out.println(report.getParams()[0]);

        if (reportRequest.sourceId != null) {
            SourceConnection sourceConnection = sourceConnectionService.getSourceConnectionById(reportRequest.sourceId);

            sourceConnection.addReport(report);

//            sourceConnectionService.addSourceConnection(sourceConnection);
        }

        if (reportRequest.destinationId != null) {
            DestinationConnection destinationConnection = destinationConnectionService.getDestinationConnectionById(reportRequest.destinationId);

            destinationConnection.addReport(report);

//            destinationConnectionService.addDestinationConnection(destinationConnection);
        }

        Report createdReport = reportService.addReport(report);

        return Response.responseBuilder("Report added successfully", HttpStatus.OK, createdReport);
    }

    @PatchMapping("/{reportId}")
    public ResponseEntity<Object> updateReport(@RequestBody ReportRequestBody reportRequest, @PathVariable int reportId) {
        Report updatedReport = reportService.updateReport(reportId, reportRequest.report);

        if (reportRequest.sourceId != null && reportRequest.sourceId != updatedReport.getSourceConnection().getId()) {
            SourceConnection sourceConnection = sourceConnectionService.getSourceConnectionById(reportRequest.sourceId);

            sourceConnection.addReport(updatedReport);
            sourceConnectionService.addSourceConnection(sourceConnection);
        }

        if (reportRequest.destinationId != null && reportRequest.destinationId != updatedReport.getDestinationConnection().getId()) {
            DestinationConnection destinationConnection = destinationConnectionService.getDestinationConnectionById(reportRequest.destinationId);
            destinationConnection.addReport(updatedReport);
            destinationConnectionService.addDestinationConnection(destinationConnection);
        }

        reportService.addReport(updatedReport);

        return Response.responseBuilder("Report updated successfully", HttpStatus.OK, updatedReport);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Object> deleteReport(@PathVariable int reportId) {
        reportService.deleteReport(reportId);
        return Response.responseBuilder("Report deleted successfully", HttpStatus.OK, null);
    }

    @PutMapping("/{reportId}/source-connections/{sourceId}")
    public ResponseEntity<Object> connectSourceToReport(@PathVariable int reportId, @PathVariable int sourceId) {
        Report report = reportService.getReportById(reportId);
        SourceConnection sourceConnection = sourceConnectionService.getSourceConnectionById(sourceId);

        sourceConnection.addReport(report);

        sourceConnectionService.addSourceConnection(sourceConnection);
        reportService.addReport(report);

        return Response.responseBuilder("Source Connection connected to Report Successfully", HttpStatus.OK, null);
    }

    @PutMapping("/{reportId}/destination-connections/{destinationId}")
    public ResponseEntity<Object> connectDestinationToReport(@PathVariable int reportId, @PathVariable int destinationId) {
        Report report = reportService.getReportById(reportId);
        DestinationConnection destinationConnection = destinationConnectionService.getDestinationConnectionById(destinationId);

        destinationConnection.addReport(report);

        destinationConnectionService.addDestinationConnection(destinationConnection);
        reportService.addReport(report);

        return Response.responseBuilder("Destination Connection connected to Report Successfully", HttpStatus.OK, null);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteReports(@RequestBody List<Integer> reportIds) {
        Integer deletedCount = reportService.bulkDeleteReports(reportIds);
        if (deletedCount == reportIds.size()) {
            return Response.responseBuilder("All Reports deleted successfully", HttpStatus.OK);
        } else if (deletedCount != 0){
            return Response.responseBuilder("Some Reports could not be deleted", HttpStatus.PARTIAL_CONTENT);
        } else {
            return Response.responseBuilder("None of the Reports could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }

}
