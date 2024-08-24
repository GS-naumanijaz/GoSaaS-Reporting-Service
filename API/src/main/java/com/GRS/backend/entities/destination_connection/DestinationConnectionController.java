package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import com.GRS.backend.models.DTO.DestinationConnectionDTO;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import com.GRS.backend.utilities.AuditLogGenerator;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/applications/{appId}/destinationConnections")
public class DestinationConnectionController {

    @Autowired
    private DestinationConnectionService destinationConnectionService;

    @Autowired
    private ApplicationService applicationService;

    @GetMapping
    public ResponseEntity<Object> getAllDestinationConnections(@PathVariable int appId, @QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        String searchBy = paginationParams.getSearchBy();
        Pageable pageable = paginationParams.getPageable();

        Page<DestinationConnection> allDestinationConnections = destinationConnectionService.getAllDestinationConnections(appId, search, searchBy, pageable);

        return Response.responseBuilder("Destination Connections retrieved successfully", HttpStatus.OK, allDestinationConnections);

    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllDestinationConnections(@PathVariable int appId) {
        List<DestinationConnectionDTO> allSourceConnections = destinationConnectionService.getAllDestinationConnections(appId);

        return Response.responseBuilder("Destination Connections found successfully", HttpStatus.OK, allSourceConnections);
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<Object> getDestinationConnectionById(@PathVariable int destinationId) {
        DestinationConnection connectionToAdd = destinationConnectionService.getDestinationConnectionById(destinationId);
        return Response.responseBuilder("Destination Connection found successfully", HttpStatus.OK, connectionToAdd);

    }

    @GetMapping("/{destinationId}/test")
    public ResponseEntity<Object> testDestinationConnection(@PathVariable int destinationId) {
        DestinationConnection connectionToTest = destinationConnectionService.getDestinationConnectionById(destinationId);

        if (destinationConnectionService.testDestinationConnection(connectionToTest)) {
            return Response.responseBuilder("Destination Connection was tested successfully", HttpStatus.OK);
        } else {
            return Response.responseBuilder("Destination Connection failed test", HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("")
    public ResponseEntity<Object> addDestinationConnection(@Valid @RequestBody DestinationConnection destinationConnection, @PathVariable int appId) {
        Application destinationApp = applicationService.getApplicationById(appId);

        destinationConnection.setApplication(destinationApp);

        DestinationConnection createdDestinationConnection = destinationConnectionService.addDestinationConnection(destinationConnection);

        AuditLogGenerator.getInstance().log(AuditLogAction.CREATED, AuditLogModule.DESTINATION, createdDestinationConnection.getId(), 1, appId);
        return Response.responseBuilder("Destination Connection added successfully", HttpStatus.OK, createdDestinationConnection);
    }

    @PatchMapping("/{destinationId}")
    public ResponseEntity<Object> updateDestinationConnection(@RequestBody DestinationConnection destinationConnection, @PathVariable int destinationId, @PathVariable int appId) {

        DestinationConnection updatedDestinationConnection = destinationConnectionService.updateDestinationConnection(destinationId, destinationConnection);
        AuditLogGenerator.getInstance().log(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, destinationId, 1, appId);
        return Response.responseBuilder("Destination Connection updated successfully", HttpStatus.OK, updatedDestinationConnection);
    }

    @PatchMapping("")
    public ResponseEntity<Object> bulkUpdateDestinationConnections(@RequestBody List<Integer> destinationConnectionIds, @RequestParam boolean isActive, @   PathVariable int appId) {

        List<DestinationConnection> updatedConnections = destinationConnectionService.bulkUpdateIsActive(destinationConnectionIds, isActive);
        int[] updatedIds = updatedConnections.stream()
                .mapToInt(DestinationConnection::getId)
                .toArray();
        if (updatedConnections.size() == destinationConnectionIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, updatedIds, 1, appId);
            return Response.responseBuilder("All Destination Connections updated successfully", HttpStatus.OK, updatedConnections);
        } else if (!updatedConnections.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, updatedIds, 1, appId);
            return Response.responseBuilder("Some Destination Connections could not be updated", HttpStatus.PARTIAL_CONTENT, updatedConnections);
        } else {
            return Response.responseBuilder("Your Destination Connections could not be updated", HttpStatus.BAD_REQUEST, updatedConnections);
        }

    }

    @DeleteMapping("/{destinationId}")
    public ResponseEntity<Object> deleteDestinationConnection(@PathVariable int destinationId, @PathVariable int appId) {
        destinationConnectionService.deleteDestinationConnection(destinationId);
        AuditLogGenerator.getInstance().log(AuditLogAction.DELETED, AuditLogModule.DESTINATION, destinationId, 1, appId);
        return Response.responseBuilder("Destination Connection deleted successfully", HttpStatus.OK, null);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteDestinationConnections(@RequestBody List<Integer> destinationIds, @PathVariable int appId) {
        List<Integer> deletedIds = destinationConnectionService.bulkDeleteDestinationConnections(destinationIds);
        if (deletedIds.size() == destinationIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, deletedIds, 1, appId);
            return Response.responseBuilder("All Destination Connections deleted successfully", HttpStatus.OK);
        } else if (!deletedIds.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, deletedIds, 1, appId);
            return Response.responseBuilder("Some Destination Connections could not be deleted", HttpStatus.PARTIAL_CONTENT);
        } else {
            return Response.responseBuilder("None of the Destination Connections could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }
    
}
