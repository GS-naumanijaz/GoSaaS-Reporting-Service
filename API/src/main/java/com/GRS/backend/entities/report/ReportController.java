package com.GRS.backend.entities.report;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.destination_connection.DestinationConnectionService;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.entities.source_connection.SourceConnectionService;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import com.GRS.backend.exceptionHandler.exceptions.InvalidRequestBodyException;
import com.GRS.backend.models.DTO.ReportDTO;
import com.GRS.backend.models.ReportRequestBody;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import com.GRS.backend.utilities.AuditLogGenerator;
import com.GRS.backend.utilities.OAuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @Autowired
    private UserService userService;

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
    public ResponseEntity<Object> addReport(@Valid @RequestBody ReportRequestBody reportRequest, @PathVariable int appId, OAuth2AuthenticationToken auth) {

        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application reportApp = applicationService.getApplicationById(appId);
        Report report = reportRequest.report;


        if (report == null || report.getAlias() == null || report.getAlias().isEmpty()) {
            throw new InvalidRequestBodyException("The report object in the request body is invalid or empty.");
        }
        report.setApplication(reportApp);

        if (reportRequest.sourceId != null) {
            SourceConnection sourceConnection = sourceConnectionService.getSourceConnectionById(reportRequest.sourceId);
            sourceConnection.encryptPassword();
            sourceConnection.addReport(report);
//              sourceConnectionService.addSourceConnection(sourceConnection);
        }

        if (reportRequest.destinationId != null) {
            DestinationConnection destinationConnection = destinationConnectionService.getDestinationConnectionById(reportRequest.destinationId);
            destinationConnection.encryptSecretKey();

            destinationConnection.addReport(report);
//              destinationConnectionService.addDestinationConnection(destinationConnection);
        }
        Report createdReport = reportService.addReport(report, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.CREATED, AuditLogModule.REPORT, createdReport.getAlias(), username, reportApp.getAlias());
        return Response.responseBuilder("Report added successfully", HttpStatus.CREATED, createdReport);
    }

    @PatchMapping("/{reportId}")
    public ResponseEntity<Object> updateReport(@RequestBody ReportRequestBody reportRequest, @PathVariable int reportId, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        Report report = reportRequest.report;
        if (report == null || report.getAlias() == null || report.getAlias().isEmpty()) {
            throw new InvalidRequestBodyException("The report object in the request body is invalid or empty.");
        }

        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application reportApp = applicationService.getApplicationById(appId);
        Report updatedReport = reportService.updateReport(reportId, reportRequest.report, username);


        if (reportRequest.sourceId != null && reportRequest.sourceId != updatedReport.getSourceConnection().getId()) {
            SourceConnection sourceConnection = sourceConnectionService.getSourceConnectionById(reportRequest.sourceId);
            sourceConnection.encryptPassword();
            sourceConnection.addReport(updatedReport);
            sourceConnectionService.addSourceConnection(sourceConnection, username);
        }

        if (reportRequest.destinationId != null && reportRequest.destinationId != updatedReport.getDestinationConnection().getId()) {
            DestinationConnection destinationConnection = destinationConnectionService.getDestinationConnectionById(reportRequest.destinationId);
            destinationConnection.encryptSecretKey();
            destinationConnection.addReport(updatedReport);
            destinationConnectionService.addDestinationConnection(destinationConnection, username);
        }

        reportService.addReport(updatedReport, username);

        AuditLogGenerator.getInstance().log(AuditLogAction.MODIFIED, AuditLogModule.REPORT, updatedReport.getAlias(), username, reportApp.getAlias());
        return Response.responseBuilder("Report updated successfully", HttpStatus.OK, updatedReport);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Object> deleteReport(@PathVariable int reportId, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application reportApp = applicationService.getApplicationById(appId);
        Report deletedReport = reportService.deleteReport(reportId, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.DELETED, AuditLogModule.REPORT, deletedReport.getAlias(), username, reportApp.getAlias());
        return Response.responseBuilder("Report deleted successfully", HttpStatus.OK);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteReports(@RequestBody List<Integer> reportIds, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application reportApp = applicationService.getApplicationById(appId);
        List<String> deletedAliases = reportService.bulkDeleteReports(reportIds, username);
        if (deletedAliases.size() == reportIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.DELETED, AuditLogModule.REPORT, deletedAliases, username, reportApp.getAlias());
            return Response.responseBuilder("All Reports deleted successfully", HttpStatus.OK);
        } else if (!deletedAliases.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.DELETED, AuditLogModule.REPORT, deletedAliases, username, reportApp.getAlias());
            return Response.responseBuilder("Some Reports could not be deleted", HttpStatus.MULTI_STATUS);
        } else {
            return Response.responseBuilder("None of the Reports could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/upload/{reportId}")
    public ResponseEntity<String> handleFileUpload(@RequestParam("file") MultipartFile file, @PathVariable int reportId) {
        try {
            reportService.uploadFile(file, reportId);
            return ResponseEntity.ok("File uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }
    }

}
