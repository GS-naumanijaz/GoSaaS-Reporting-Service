package com.GRS.backend.entities.source_connection;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.enums.SourceConnectionType;
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
@RequestMapping("/applications/{appId}/source-connections")
public class SourceConnectionController {

    @Autowired
    private SourceConnectionService sourceConnectionService;

    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<Object> getAllSourceConnections(@PathVariable int appId, @QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        String searchBy = paginationParams.getSearchBy();
        Pageable pageable = paginationParams.getPageable();

        Page<SourceConnection> allSourceConnections = sourceConnectionService.getAllSourceConnections(appId, search, searchBy, pageable);

        return Response.responseBuilder("Source Connections retrieved successfully", HttpStatus.OK, allSourceConnections);

    }

    @GetMapping("/{sourceId}")
    public ResponseEntity<Object> getSourceConnectionById(@PathVariable int sourceId) {
        SourceConnection connectionToAdd = sourceConnectionService.getSourceConnectionById(sourceId);

        return Response.responseBuilder("Source Connection found successfully", HttpStatus.OK, connectionToAdd);

    }

    @GetMapping("/{sourceId}/test")
    public ResponseEntity<Object> testSourceConnection(@PathVariable int sourceId) {
        SourceConnection connectionToTest = sourceConnectionService.getSourceConnectionById(sourceId);

        if (sourceConnectionService.testSourceConnection(connectionToTest)) {
            return Response.responseBuilder("Source Connection was tested successfully", HttpStatus.OK);
        } else {
            return Response.responseBuilder("Source Connection failed test", HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping("/types")
    public ResponseEntity<Object> getSourceConnectionTypes() {
        return Response.responseBuilder("Source Connection types returned successfully", HttpStatus.OK, SourceConnectionType.getDbTypes());
    }


    @PostMapping("")
    public ResponseEntity<Object> addSourceConnection(@Valid @RequestBody SourceConnection sourceConnection, @PathVariable int appId) {

        Application sourceApp = applicationService.getApplicationById(appId);

        sourceConnection.setApplication(sourceApp);

        SourceConnection createdSourceConnection = sourceConnectionService.addSourceConnection(sourceConnection);

        return Response.responseBuilder("Source Connection added successfully", HttpStatus.OK, createdSourceConnection);
    }

    @PatchMapping("/{sourceId}")
    public ResponseEntity<Object> updateSourceConnection(@RequestBody SourceConnection sourceConnection, @PathVariable int sourceId) {
        SourceConnection updatedSourceConnection = sourceConnectionService.updateSourceConnection(sourceId, sourceConnection);
        return Response.responseBuilder("Source Connection updated successfully", HttpStatus.OK, updatedSourceConnection);
    }

    @PatchMapping("")
    public ResponseEntity<Object> bulkUpdateSourceConnections(@RequestBody List<Integer> sourceIds, @RequestParam boolean isActive) {

        List<SourceConnection> updatedSources = sourceConnectionService.bulkUpdateIsActive(sourceIds, isActive);

        if (updatedSources.size() == sourceIds.size()) {
            return Response.responseBuilder("All Source Connections updated successfully", HttpStatus.OK, updatedSources);
        } else if (updatedSources.size() != 0){
            return Response.responseBuilder("Some Source Connections could not be updated", HttpStatus.PARTIAL_CONTENT, updatedSources);
        } else {
            return Response.responseBuilder("None of the Source Connections could not be updated", HttpStatus.BAD_REQUEST, updatedSources);
        }

    }

    @DeleteMapping("/{sourceId}")
    public ResponseEntity<Object> deleteSourceConnection(@PathVariable int sourceId) {
        sourceConnectionService.deleteSourceConnection(sourceId);
        return Response.responseBuilder("Source Connection deleted successfully", HttpStatus.OK);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteSourceConnection(@RequestBody List<Integer> sourceIds) {
        Integer deletedCount = sourceConnectionService.bulkDeleteSourceConnections(sourceIds);
        if (deletedCount == sourceIds.size()) {
            return Response.responseBuilder("All Source Connections deleted successfully", HttpStatus.OK);
        } else if (deletedCount != 0){
            return Response.responseBuilder("Some Source Connections could not be deleted", HttpStatus.PARTIAL_CONTENT);
        } else {
            return Response.responseBuilder("None of the Source Connections could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }

    
}
