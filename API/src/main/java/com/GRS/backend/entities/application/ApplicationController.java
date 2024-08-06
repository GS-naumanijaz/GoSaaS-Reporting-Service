package com.GRS.backend.entities.application;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
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

//    @GetMapping
//    public ResponseEntity<Object> getAllApplications(
//            @RequestParam(required = false) String search,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(name = "page_size", defaultValue = "10") int pageSize,
//            @RequestParam(defaultValue = "id") String sortBy,
//            @RequestParam(name = "sort_order", defaultValue = "asc") String sortOrder) {
//
//        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
//        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));
//
//        Page<Application> allApplications = applicationService.getAllApplications(search, pageable);
//
//        return Response.responseBuilder("Applications retrieved successfully", HttpStatus.OK, allApplications);
//    }
//
    @GetMapping
    public ResponseEntity<Object> getAllApplications(
            @QueryParams(pageSize = 6) QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        Pageable pageable = paginationParams.getPageable();

        Page<Application> allApplications = applicationService.getAllApplications(search, pageable);

        return Response.responseBuilder("Applications retrieved successfully", HttpStatus.OK, allApplications);
    }

    @GetMapping("/{appId}")
    public ResponseEntity<Object> getApplicationById(@PathVariable int appId) {
        Optional<Application> applicationToAdd = applicationService.getApplicationById(appId);
        if (applicationToAdd.isPresent()) {
            return Response.responseBuilder("Application found successfully", HttpStatus.OK, applicationToAdd);
        } else {
            return Response.responseBuilder("Failed to find application", HttpStatus.OK, null);
        }
    }

    @PostMapping
    public ResponseEntity<Object> addApplication(@RequestBody Application application) {
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
