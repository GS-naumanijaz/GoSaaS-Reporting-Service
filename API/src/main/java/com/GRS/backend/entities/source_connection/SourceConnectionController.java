package com.GRS.backend.entities.source_connection;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import com.GRS.backend.enums.SourceConnectionType;
import com.GRS.backend.exceptionHandler.exceptions.InvalidRequestBodyException;
import com.GRS.backend.models.DTO.SourceConnectionDTO;
import com.GRS.backend.models.StoredProcedure;
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
@RequestMapping("/applications/{appId}/sourceConnections")
public class SourceConnectionController {

    @Autowired
    private SourceConnectionService sourceConnectionService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<Object> getAllSourceConnections(@PathVariable int appId, @QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        String searchBy = paginationParams.getSearchBy();
        Pageable pageable = paginationParams.getPageable();

        Page<SourceConnection> allSourceConnections = sourceConnectionService.getAllSourceConnections(appId, search, searchBy, pageable);

        return Response.responseBuilder("Source Connections retrieved successfully", HttpStatus.OK, allSourceConnections);

    }

    @GetMapping("/getAllIds")
    public ResponseEntity<List<Number>> getAllSourceIds() {
        List<Number> allSourceIds = sourceConnectionService.getAllSourceIds();
        return ResponseEntity.ok(allSourceIds);
    }

    @GetMapping("/all")
    public ResponseEntity<Object> getAllSourceConnections(@PathVariable int appId) {
        List<SourceConnectionDTO> allSourceConnections = sourceConnectionService.getAllSourceConnections(appId);

        return Response.responseBuilder("Source Connection found successfully", HttpStatus.OK, allSourceConnections);
    }

    @GetMapping("/{sourceId}")
    public ResponseEntity<Object> getSourceConnectionById(@PathVariable int sourceId) {
        SourceConnection connectionToAdd = sourceConnectionService.getSourceConnectionById(sourceId);

        return Response.responseBuilder("Source Connection found successfully", HttpStatus.OK, connectionToAdd);

    }

    @GetMapping("/{sourceId}/test")
    public ResponseEntity<Object> testSourceConnection(@PathVariable int sourceId, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application application = applicationService.getApplicationById(appId);
        SourceConnection connectionToTest = sourceConnectionService.getSourceConnectionById(sourceId);

        if (sourceConnectionService.testSourceConnection(connectionToTest, username)) {

            return Response.responseBuilder("Source Connection was tested successfully", HttpStatus.OK);
        } else {
            return Response.responseBuilder("Source Connection failed test", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{sourceId}/storedProcedures")
    public ResponseEntity<Object> getSourceConnectionStoredProcedures(@PathVariable int sourceId, @PathVariable int appId) {
        SourceConnection sourceConnection = sourceConnectionService.getSourceConnectionById(sourceId);
        Application application = applicationService.getApplicationById(appId);

        List<StoredProcedure> storedProcedures = sourceConnectionService.getSourceConnectionStoredProcedures(sourceConnection);

        return Response.responseBuilder("Source Connection stored procedures were retrieved successfully", HttpStatus.OK, storedProcedures);
    }

    @GetMapping("/types")
    public ResponseEntity<Object> getSourceConnectionTypes() {
        return Response.responseBuilder("Source Connection types returned successfully", HttpStatus.CREATED, SourceConnectionType.getDbTypes());
    }

    @PostMapping("")
    public ResponseEntity<Object> addSourceConnection(@Valid @RequestBody SourceConnection sourceConnection, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application sourceApp = applicationService.getApplicationById(appId);

        sourceConnection.setApplication(sourceApp);

        SourceConnection createdSourceConnection = sourceConnectionService.addSourceConnection(sourceConnection, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.CREATED, AuditLogModule.SOURCE, createdSourceConnection.getAlias(), username, sourceApp.getAlias());
        return Response.responseBuilder("Source Connection added successfully", HttpStatus.CREATED, createdSourceConnection);
    }

    @PatchMapping("/{sourceId}")
    public ResponseEntity<Object> updateSourceConnection(@RequestBody SourceConnection sourceConnection, @PathVariable int sourceId, @PathVariable int appId, OAuth2AuthenticationToken auth) {

        if (sourceConnection == null || sourceConnection.isEmpty()) {
            throw new InvalidRequestBodyException("The update request body is invalid or empty.");
        }

        // Check if alias is provided and ensure it's not blank
        if (sourceConnection.getAlias() != null && "".equals(sourceConnection.getAlias())) {
            throw new InvalidRequestBodyException("Alias must not be blank.");
        }


        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application sourceApp = applicationService.getApplicationById(appId);
        SourceConnection updatedSourceConnection = sourceConnectionService.updateSourceConnection(sourceId, sourceConnection, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.MODIFIED, AuditLogModule.SOURCE, updatedSourceConnection.getAlias(), username, sourceApp.getAlias());
        return Response.responseBuilder("Source Connection updated successfully", HttpStatus.OK, updatedSourceConnection);
    }

    @PatchMapping("")
    public ResponseEntity<Object> bulkUpdateSourceConnections(@RequestBody List<Integer> sourceIds, @RequestParam boolean isActive, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application sourceApp = applicationService.getApplicationById(appId);
        List<SourceConnection> updatedSources = sourceConnectionService.bulkUpdateIsActive(sourceIds, isActive, username);

        String[] updatedAliases = updatedSources.stream()
                .map(SourceConnection::getAlias)
                .toArray(String[]::new);
        if (updatedSources.size() == sourceIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.SOURCE, updatedAliases, username, sourceApp.getAlias());
            return Response.responseBuilder("All Source Connections updated successfully", HttpStatus.OK, updatedSources);
        } else if (!updatedSources.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.MODIFIED, AuditLogModule.SOURCE, updatedAliases, username, sourceApp.getAlias());
            return Response.responseBuilder("Some Source Connections could not be updated", HttpStatus.MULTI_STATUS, updatedSources);
        } else {
            return Response.responseBuilder("None of the Source Connections could not be updated", HttpStatus.BAD_REQUEST, updatedSources);
        }

    }

    @DeleteMapping("/{sourceId}")
    public ResponseEntity<Object> deleteSourceConnection(@PathVariable int sourceId, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application sourceApp = applicationService.getApplicationById(appId);
        SourceConnection deleteSource = sourceConnectionService.deleteSourceConnection(sourceId, username);
        AuditLogGenerator.getInstance().log(AuditLogAction.DELETED, AuditLogModule.SOURCE, deleteSource.getAlias(), username, sourceApp.getAlias());
        return Response.responseBuilder("Source Connection deleted successfully", HttpStatus.OK);
    }

    @DeleteMapping("")
    public ResponseEntity<Object> deleteSourceConnection(@RequestBody List<Integer> sourceIds, @PathVariable int appId, OAuth2AuthenticationToken auth) {
        String username = userService.getUserNameByEmail(OAuthUtil.getEmail(auth));
        Application sourceApp = applicationService.getApplicationById(appId);
        List<String> deletedAliases = sourceConnectionService.bulkDeleteSourceConnections(sourceIds, username);
        if (deletedAliases.size() == sourceIds.size()) {
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.DELETED, AuditLogModule.SOURCE, deletedAliases, username, sourceApp.getAlias());
            return Response.responseBuilder("All Source Connections deleted successfully", HttpStatus.OK);
        } else if (!deletedAliases.isEmpty()){
            AuditLogGenerator.getInstance().logBulk(AuditLogAction.DELETED, AuditLogModule.SOURCE, deletedAliases, username, sourceApp.getAlias());
            return Response.responseBuilder("Some Source Connections could not be deleted", HttpStatus.MULTI_STATUS);
        } else {
            return Response.responseBuilder("None of the Source Connections could not be deleted", HttpStatus.BAD_REQUEST);
        }
    }

    
}
