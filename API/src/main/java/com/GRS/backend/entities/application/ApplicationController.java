package com.GRS.backend.entities.application;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    Logger logger = LoggerFactory.getLogger(ApplicationController.class);

    @GetMapping
    public ResponseEntity<Object> getAllApplications(
            @QueryParams(pageSize = 6, searchBy = "alias") QueryArgumentResolver.QueryParamsContainer queryParams,
            @RequestParam(defaultValue = "all") String status) {

        String search = queryParams.getSearch();
        String searchBy = queryParams.getSearchBy();
        Pageable pageable = queryParams.getPageable();

        Page<Application> allApplications = applicationService.getAllApplications(search, searchBy, pageable, status);

        return Response.responseBuilder("Applications retrieved successfully", HttpStatus.OK, allApplications);
    }

    @GetMapping("/{appId}")
    public ResponseEntity<Object> getApplicationById(@PathVariable int appId) {
        Optional<Application> applicationToAdd = applicationService.getApplicationById(appId);
        if (applicationToAdd.isPresent()) {
            logger.error("Application found successfully");
            return Response.responseBuilder("Application found successfully", HttpStatus.OK, applicationToAdd);
        } else {
            return Response.responseBuilder("Failed to find application", HttpStatus.OK, null);
        }
    }

    @PostMapping
    public ResponseEntity<Object> addApplication(@Valid @RequestBody Application application) {
        Application createdApplication = applicationService.addApplication(application);
        return Response.responseBuilder("Application added successfully", HttpStatus.OK, createdApplication);
    }

    @PatchMapping("/{appId}")
    public ResponseEntity<Object> updateApplication(@RequestBody Application application, @PathVariable int appId) {
        Application updatedApplication = applicationService.updateApplication(appId, application);
        return Response.responseBuilder("Application updated successfully", HttpStatus.OK, updatedApplication);
    }

    @DeleteMapping("/{appId}")
    public ResponseEntity<Object> deleteApplication(@PathVariable int appId) {
        applicationService.deleteApplication(appId);
        return Response.responseBuilder("Application deleted successfully", HttpStatus.OK, null);
    }
}
