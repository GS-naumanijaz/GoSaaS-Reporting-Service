package com.GRS.backend.entities.application;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.report.ReportService;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import com.GRS.backend.utilities.AuditLogGenerator;
import com.GRS.backend.utilities.OAuthUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
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

    @Autowired
    private UserService userService;

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
    public ResponseEntity<Object> addApplication(@Valid @RequestBody Application application,OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application createdApplication = applicationService.addApplication(application, username);
        System.out.println("In add application controller " + createdApplication.getAlias());
        AuditLogGenerator.getInstance().log(AuditLogAction.CREATED, AuditLogModule.APPLICATION, createdApplication.getAlias(), username);
        return Response.responseBuilder("Application added successfully", HttpStatus.CREATED, createdApplication);
    }

    @PatchMapping("")
    public ResponseEntity<Object> bulkUpdateApplications(@RequestBody List<Integer> applicationIds, @RequestParam boolean isActive, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        List<Application> updatedApps = applicationService.bulkUpdateIsActive(applicationIds, isActive, username);
        String[] updatedAliases = updatedApps.stream()
                .map(Application::getAlias)
                .toArray(String[]::new);
        if (updatedApps.size() == applicationIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.APPLICATION, updatedAliases, username);
            return Response.responseBuilder("All Source Connections updated successfully", HttpStatus.OK, updatedApps);
        } else if (updatedApps.size() != 0){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.APPLICATION, updatedAliases, username);
            return Response.responseBuilder("Some Source Connections could not be updated", HttpStatus.MULTI_STATUS, updatedApps);
        } else {
            return Response.responseBuilder("None of the Source Connections could not be updated", HttpStatus.BAD_REQUEST, updatedApps);
        }

    }

    @PatchMapping("/{appId}")
    public ResponseEntity<Object> updateApplication(@Valid @RequestBody Application application, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application updatedApplication = applicationService.updateApplication(appId, application, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.MODIFIED, AuditLogModule.APPLICATION, updatedApplication.getAlias(), username);
        return Response.responseBuilder("Application updated successfully", HttpStatus.OK, updatedApplication);
    }

    @DeleteMapping("/{appId}")
    public ResponseEntity<Object> deleteApplication(@PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application deletedApplication = applicationService.deleteApplication(appId, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.DELETED, AuditLogModule.APPLICATION, deletedApplication.getAlias(), username);
        return Response.responseBuilder("Application deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/pinnedReports")
    public ResponseEntity<Object> getAllPinnedReports() {
        List<Report> allSourceConnections = reportService.getAllPinnedReports();

        return Response.responseBuilder("Pinned Reports found successfully", HttpStatus.OK, allSourceConnections);
    }



    @DeleteMapping("")
    public ResponseEntity<Object> deleteApplication(@RequestBody List<Integer> applicationIds, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        List<String> deletedApps = applicationService.bulkDeleteApplications(applicationIds, username);

        if (deletedApps.size() == applicationIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.APPLICATION, deletedApps, username);
            return Response.responseBuilder("All Applications deleted successfully", HttpStatus.OK);
        } else if (!deletedApps.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.APPLICATION, deletedApps, username);
            return Response.responseBuilder("Some Applications could not be deleted", HttpStatus.MULTI_STATUS);
        } else {
            return Response.responseBuilder("None of the Applications could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }
}
