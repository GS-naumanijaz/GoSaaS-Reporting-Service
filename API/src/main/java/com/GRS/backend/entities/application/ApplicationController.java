package com.GRS.backend.entities.application;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.report.ReportService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import com.GRS.backend.utilities.AuditLogGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ReportService reportService;

    Logger logger = LoggerFactory.getLogger(ApplicationController.class);

    @GetMapping
    public ResponseEntity<Object> getAllApplications(
            @QueryParams(pageSize = 6, searchBy = "alias") QueryArgumentResolver.QueryParamsContainer queryParams,
            @RequestParam(defaultValue = "all") String status) {
        String search = queryParams.getSearch();
        String searchBy = queryParams.getSearchBy();
        Pageable pageable = queryParams.getPageable();
        LocalDate startDate = queryParams.getStartDate();
        LocalDate endDate = queryParams.getEndDate();

        Page<Application> allApplications = applicationService.getAllApplications(search, searchBy, pageable, status, startDate, endDate);

        return Response.responseBuilder("Applications retrieved successfully", HttpStatus.OK, allApplications);
    }

    @GetMapping("/{appId}")
    public ResponseEntity<Object> getApplicationById(@PathVariable int appId) {
        Application applicationToAdd = applicationService.getApplicationById(appId);
        return Response.responseBuilder("Application found successfully", HttpStatus.OK, applicationToAdd);
    }

    @PostMapping
    public ResponseEntity<Object> addApplication(@Valid @RequestBody Application application) {
        Application createdApplication = applicationService.addApplication(application);
        AuditLogGenerator.getInstance().log(AuditLogAction.CREATED, AuditLogModule.APPLICATION, createdApplication.getAlias(), 1);
        return Response.responseBuilder("Application added successfully", HttpStatus.OK, createdApplication);
    }

    @PatchMapping("")
    public ResponseEntity<Object> bulkUpdateApplications(@RequestBody List<Integer> applicationIds, @RequestParam boolean isActive) {

        List<Application> updatedApps = applicationService.bulkUpdateIsActive(applicationIds, isActive);

        if (updatedApps.size() == applicationIds.size()) {
            return Response.responseBuilder("All Source Connections updated successfully", HttpStatus.OK, updatedApps);
        } else if (updatedApps.size() != 0){
            return Response.responseBuilder("Some Source Connections could not be updated", HttpStatus.PARTIAL_CONTENT, updatedApps);
        } else {
            return Response.responseBuilder("None of the Source Connections could not be updated", HttpStatus.BAD_REQUEST, updatedApps);
        }

    }

    @PatchMapping("/{appId}")
    public ResponseEntity<Object> updateApplication(@RequestBody Application application, @PathVariable int appId) {
        Application updatedApplication = applicationService.updateApplication(appId, application);
        AuditLogGenerator.getInstance().log(AuditLogAction.MODIFIED, AuditLogModule.APPLICATION, updatedApplication.getAlias(), 1);
        return Response.responseBuilder("Application updated successfully", HttpStatus.OK, updatedApplication);
    }

    @DeleteMapping("/{appId}")
    public ResponseEntity<Object> deleteApplication(@PathVariable int appId) {
        Application deletedApplication = applicationService.deleteApplication(appId);
        AuditLogGenerator.getInstance().log(AuditLogAction.DELETED, AuditLogModule.APPLICATION, deletedApplication.getAlias(), 1);
        return Response.responseBuilder("Application deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/pinnedReports")
    public ResponseEntity<Object> getAllPinnedReports() {
        List<Report> allSourceConnections = reportService.getAllPinnedReports();

        return Response.responseBuilder("Destination Connections found successfully", HttpStatus.OK, allSourceConnections);
    }



    @DeleteMapping("")
    public ResponseEntity<Object> deleteApplication(@RequestBody List<Integer> applicationIds) {
        Integer deletedCount = applicationService.bulkDeleteApplications(applicationIds);
        if (deletedCount == applicationIds.size()) {
            return Response.responseBuilder("All Source Connections deleted successfully", HttpStatus.OK);
        } else if (deletedCount != 0){
            return Response.responseBuilder("Some Source Connections could not be deleted", HttpStatus.PARTIAL_CONTENT);
        } else {
            return Response.responseBuilder("None of the Source Connections could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }
}
