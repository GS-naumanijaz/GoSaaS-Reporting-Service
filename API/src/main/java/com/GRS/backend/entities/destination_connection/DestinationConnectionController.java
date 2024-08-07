package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.report.Report;
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

import java.util.Optional;

@RestController
@RequestMapping("/destination-connections")
public class DestinationConnectionController {

    @Autowired
    private DestinationConnectionService destinationConnectionService;

    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<Object> getAllDestinationConnections(@QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        String searchBy = paginationParams.getSearchBy();
        Pageable pageable = paginationParams.getPageable();

        Page<DestinationConnection> allDestinationConnections = destinationConnectionService.getAllDestinationConnections(search, searchBy, pageable);

        return Response.responseBuilder("Destination Connections retrieved successfully", HttpStatus.OK, allDestinationConnections);

    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<Object> getDestinationConnectionById(@PathVariable int destinationId) {
        Optional<DestinationConnection> connectionToAdd = destinationConnectionService.getDestinationConnectionById(destinationId);
        if (connectionToAdd.isPresent()) {
            return Response.responseBuilder("Destination Connection found successfully", HttpStatus.OK, connectionToAdd);
        } else {
            return Response.responseBuilder("Failed to find destination connection", HttpStatus.OK, null);
        }
    }

    @PostMapping("/{appId}")
    public ResponseEntity<Object> addDestinationConnection(@RequestBody DestinationConnection destinationConnection, @PathVariable int appId) {
        Optional<Application> destinationApp = applicationService.getApplicationById(appId);

        destinationConnection.setApplication(destinationApp.get());

        DestinationConnection createdDestinationConnection = destinationConnectionService.addDestinationConnection(destinationConnection);

        return Response.responseBuilder("Destination Connection added successfully", HttpStatus.OK, createdDestinationConnection);
    }

    @PatchMapping("/{destinationId}")
    public ResponseEntity<Object> updateDestinationConnection(@RequestBody DestinationConnection destinationConnection, @PathVariable int destinationId) {
        DestinationConnection updatedDestinationConnection = destinationConnectionService.updateDestinationConnection(destinationId, destinationConnection);
        return Response.responseBuilder("Destination Connection updated successfully", HttpStatus.OK, updatedDestinationConnection);
    }

    @DeleteMapping("/{destinationId}")
    public ResponseEntity<Object> deleteDestinationConnection(@PathVariable int destinationId) {
        destinationConnectionService.deleteDestinationConnection(destinationId);
        return Response.responseBuilder("Destination Connection deleted successfully", HttpStatus.OK, null);
    }
    
}
