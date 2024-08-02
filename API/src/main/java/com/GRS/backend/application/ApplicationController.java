package com.GRS.backend.application;

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
@RequestMapping("/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public Page<Application> getAllApplications(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(name = "page_size", defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "appId") String sortBy,
            @RequestParam(name = "sort_order", defaultValue = "asc") String sortOrder) {

        Sort.Direction direction = Sort.Direction.fromString(sortOrder);
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(direction, sortBy));

        return applicationService.getAllApplications(search, pageable);
    }

    @GetMapping("/{appId}")
    public Optional<Application> getApplicationById(@PathVariable int appId) {
        return applicationService.getApplicationById(appId);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> addApplication(@RequestBody Application application) {
        Application createdApplication = applicationService.addApplication(application);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Application added successfully");
        response.put("application", createdApplication);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{appId}")
    public ResponseEntity<Map<String, Object>> updateApplication(@RequestBody Application application, @PathVariable int appId) {
        Application updatedApplication = applicationService.updateApplication(appId, application);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Application updated successfully");
        response.put("application", updatedApplication);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{appId}")
    public ResponseEntity<Map<String, String>> deleteApplication(@PathVariable int appId) {
        applicationService.deleteApplication(appId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Application deleted successfully");
        return ResponseEntity.ok(response);
    }
}
