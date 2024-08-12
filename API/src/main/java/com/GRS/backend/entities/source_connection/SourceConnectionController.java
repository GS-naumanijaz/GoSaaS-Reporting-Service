package com.GRS.backend.entities.source_connection;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.enums.SourceConnectionType;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import jakarta.validation.Valid;
import org.apache.commons.logging.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        Optional<SourceConnection> connectionToAdd = sourceConnectionService.getSourceConnectionById(sourceId);
        if (connectionToAdd.isPresent()) {
            return Response.responseBuilder("Source Connection found successfully", HttpStatus.OK, connectionToAdd);
        } else {
            return Response.responseBuilder("Failed to find source connection", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{sourceId}/test")
    public ResponseEntity<Object> testSourceConnection(@PathVariable int sourceId) {
        Optional<SourceConnection> connectionToTest = sourceConnectionService.getSourceConnectionById(sourceId);
        if (connectionToTest.isPresent()) {
            if (sourceConnectionService.testSourceConnection(connectionToTest.get())) {
                return Response.responseBuilder("Source Connection was tested successfully", HttpStatus.OK);
            } else {
                return Response.responseBuilder("Source Connection failed test", HttpStatus.BAD_REQUEST);
            }
        } else {
            return Response.responseBuilder("Failed to find source connection", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/types")
    public ResponseEntity<Object> getSourceConnectionTypes() {
        return Response.responseBuilder("Source Connection types returned successfully", HttpStatus.OK, SourceConnectionType.getDbTypes());
    }


    @PostMapping("")
    public ResponseEntity<Object> addSourceConnection(@Valid @RequestBody SourceConnection sourceConnection, @PathVariable int appId) {

        Optional<Application> sourceApp = applicationService.getApplicationById(appId);

        sourceConnection.setApplication(sourceApp.get());

        SourceConnection createdSourceConnection = sourceConnectionService.addSourceConnection(sourceConnection);

        return Response.responseBuilder("Source Connection added successfully", HttpStatus.OK, createdSourceConnection);
    }

    @PatchMapping("/{sourceId}")
    public ResponseEntity<Object> updateSourceConnection(@RequestBody SourceConnection sourceConnection, @PathVariable int sourceId) {
        SourceConnection updatedSourceConnection = sourceConnectionService.updateSourceConnection(sourceId, sourceConnection);
        return Response.responseBuilder("Source Connection updated successfully", HttpStatus.OK, updatedSourceConnection);
    }

    @DeleteMapping("/{sourceId}")
    public ResponseEntity<Object> deleteSourceConnection(@PathVariable int sourceId) {
        sourceConnectionService.deleteSourceConnection(sourceId);
        return Response.responseBuilder("Source Connection deleted successfully", HttpStatus.OK, null);
    }

    
}
