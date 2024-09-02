package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import com.GRS.backend.exceptionHandler.exceptions.InvalidRequestBodyException;
import com.GRS.backend.models.DTO.DestinationConnectionDTO;
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
import java.util.List;

@RestController
@RequestMapping("/applications/{appId}/destinationConnections")
public class DestinationConnectionController {

    @Autowired
    private DestinationConnectionService destinationConnectionService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

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

    @GetMapping("/getAllIds")
    public ResponseEntity<List<Number>> getAllDestinationIds() {
        List<Number> allDestinationIds = destinationConnectionService.getAllDestinationIds();
        return ResponseEntity.ok(allDestinationIds);
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<Object> getDestinationConnectionById(@PathVariable int destinationId, @PathVariable int appId) {
        Application application = applicationService.getApplicationById(appId);
        DestinationConnection connectionToAdd = destinationConnectionService.getDestinationConnectionById(destinationId);
        return Response.responseBuilder("Destination Connection found successfully", HttpStatus.OK, connectionToAdd);

    }

    @GetMapping("/{destinationId}/test")
    public ResponseEntity<Object> testDestinationConnection(@PathVariable int destinationId, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        applicationService.getApplicationById(appId);
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        DestinationConnection connectionToTest = destinationConnectionService.getDestinationConnectionById(destinationId);

        if (destinationConnectionService.testDestinationConnection(connectionToTest, username)) {
            return Response.responseBuilder("Destination Connection was tested successfully", HttpStatus.OK);
        } else {
            return Response.responseBuilder("Destination Connection failed test", HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("")
    public ResponseEntity<Object> addDestinationConnection(@Valid @RequestBody DestinationConnection destinationConnection, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application destinationApp = applicationService.getApplicationById(appId);

        destinationConnection.setApplication(destinationApp);

        DestinationConnection createdDestinationConnection = destinationConnectionService.addDestinationConnection(destinationConnection, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.CREATED, AuditLogModule.DESTINATION, createdDestinationConnection.getAlias(), username, destinationApp.getAlias());
        return Response.responseBuilder("Destination Connection added successfully", HttpStatus.CREATED, createdDestinationConnection);
    }

    @PatchMapping("/{destinationId}")
    public ResponseEntity<Object> updateDestinationConnection(@RequestBody DestinationConnection destinationConnection, @PathVariable int destinationId, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        if (destinationConnection == null || destinationConnection.isEmpty()) {
            throw new InvalidRequestBodyException("The update request body is invalid or empty.");
        }

        // Check if alias is provided and ensure it's not blank
        if (destinationConnection.getAlias() != null && "".equals(destinationConnection.getAlias())) {
            throw new InvalidRequestBodyException("Alias must not be blank.");
        }

        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application destinationApp = applicationService.getApplicationById(appId);
        DestinationConnection updatedDestinationConnection = destinationConnectionService.updateDestinationConnection(destinationId, destinationConnection, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, updatedDestinationConnection.getAlias(), username, destinationApp.getAlias());
        return Response.responseBuilder("Destination Connection updated successfully", HttpStatus.OK, updatedDestinationConnection);
    }

    @PatchMapping("")
    public ResponseEntity<Object> bulkUpdateDestinationConnections(@RequestBody List<Integer> destinationConnectionIds, @RequestParam boolean isActive, @   PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application destinationApp = applicationService.getApplicationById(appId);
        List<DestinationConnection> updatedConnections = destinationConnectionService.bulkUpdateIsActive(destinationConnectionIds, isActive, username);
        String[] updatedAliases = updatedConnections.stream()
                .map(DestinationConnection::getAlias)
                .toArray(String[]::new);
        if (updatedConnections.size() == destinationConnectionIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, updatedAliases, username, destinationApp.getAlias());
            return Response.responseBuilder("All Destination Connections updated successfully", HttpStatus.OK, updatedConnections);
        } else if (!updatedConnections.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, updatedAliases, username, destinationApp.getAlias());
            return Response.responseBuilder("Some Destination Connections could not be updated", HttpStatus.MULTI_STATUS, updatedConnections);
        } else {
            return Response.responseBuilder("Your Destination Connections could not be updated", HttpStatus.BAD_REQUEST, updatedConnections);
        }

    }

    @DeleteMapping("/{destinationId}")
    public ResponseEntity<Object> deleteDestinationConnection(@PathVariable int destinationId, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application destinationApp = applicationService.getApplicationById(appId);
        DestinationConnection deletedDestination = destinationConnectionService.deleteDestinationConnection(destinationId, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.DELETED, AuditLogModule.DESTINATION, deletedDestination.getAlias(), username, destinationApp.getAlias());
        return Response.responseBuilder("Destination Connection deleted successfully", HttpStatus.OK, null);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteDestinationConnections(@RequestBody List<Integer> destinationIds, @PathVariable int appId, OAuth2AuthenticationToken auth) {

        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application destinationApp = applicationService.getApplicationById(appId);
        List<String> deletedAliases = destinationConnectionService.bulkDeleteDestinationConnections(destinationIds, username);
        if (deletedAliases.size() == destinationIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, deletedAliases, username, destinationApp.getAlias());
            return Response.responseBuilder("All Destination Connections deleted successfully", HttpStatus.OK);
        } else if (!deletedAliases.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.DESTINATION, deletedAliases, username, destinationApp.getAlias());
            return Response.responseBuilder("Some Destination Connections could not be deleted", HttpStatus.MULTI_STATUS);
        } else {
            return Response.responseBuilder("None of the Destination Connections could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }



}
