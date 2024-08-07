package com.GRS.backend.entities.request;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.destination_connection.DestinationConnectionService;
import com.GRS.backend.entities.notification.Notification;
import com.GRS.backend.entities.notification.NotificationService;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private DestinationConnectionService destinationConnectionService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Object> getAllRequests(@QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        String searchBy = paginationParams.getSearchBy();
        Pageable pageable = paginationParams.getPageable();

        Page<Request> allRequests = requestService.getAllRequests(search, searchBy, pageable);

        return Response.responseBuilder("Requests retrieved successfully", HttpStatus.OK, allRequests);

    }

    @GetMapping("/{requestId}")
    public ResponseEntity<Object> getRequestById(@PathVariable int requestId) {
        Optional<Request> requestToAdd = requestService.getRequestById(requestId);
        if (requestToAdd.isPresent()) {
            return Response.responseBuilder("Request found successfully", HttpStatus.OK, requestToAdd);
        } else {
            return Response.responseBuilder("Failed to find request", HttpStatus.OK, null);
        }
    }

    @PostMapping("/{appId}/destination-connections/{destinationId}")
    public ResponseEntity<Object> addRequest(@Valid @RequestBody Request request, @PathVariable int appId, @PathVariable int destinationId) {
        Optional<Application> requestApp = applicationService.getApplicationById(appId);
        Optional<DestinationConnection> requestDestination = destinationConnectionService.getDestinationConnectionById(destinationId);

        if (requestApp.isPresent() && requestDestination.isPresent()) {
            request.setApplication(requestApp.get());
            request.setDestination_connection(requestDestination.get());

            // Save the Request first
            Request createdRequest = requestService.addRequest(request);

            // Create and set the Notification
            Notification createdNotification = new Notification();
            createdNotification.setMessage("Request created successfully");
            createdNotification.setCreated_by(createdRequest.getCreated_by());
            createdNotification.setCreation_date(LocalDate.now());
            createdNotification.setRequest(createdRequest);

            // Save the Notification
            notificationService.addNotification(createdNotification);

            // Update the Request with the Notification
//            requestService.updateRequest(createdRequest);


            return Response.responseBuilder("Request added successfully", HttpStatus.OK, createdRequest);
        } else {
            return Response.responseBuilder("Application or Destination Connection not found", HttpStatus.NOT_FOUND, null);
        }
    }

    @PatchMapping("/{requestId}")
    public ResponseEntity<Object> updateRequest(@RequestBody Request request, @PathVariable int requestId) {
        Request updatedRequest = requestService.updateRequest(requestId, request);
        return Response.responseBuilder("Request updated successfully", HttpStatus.OK, updatedRequest);
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<Object> deleteRequest(@PathVariable int requestId) {
        requestService.deleteRequest(requestId);
        return Response.responseBuilder("Request deleted successfully", HttpStatus.OK, null);
    }
    
}
