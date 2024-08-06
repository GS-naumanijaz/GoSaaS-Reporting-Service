package com.GRS.backend.entities.request;

import com.GRS.backend.annotations.QueryParams;
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
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @GetMapping
    public ResponseEntity<Object> getAllRequests(@QueryParams QueryArgumentResolver.QueryParamsContainer paginationParams) {

        String search = paginationParams.getSearch();
        Pageable pageable = paginationParams.getPageable();

        Page<Request> allRequests = requestService.getAllRequests(search, pageable);

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

    @PostMapping
    public ResponseEntity<Object> addRequest(@RequestBody Request request) {
        Request createdRequest = requestService.addRequest(request);
        return Response.responseBuilder("Request added successfully", HttpStatus.OK, createdRequest);
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
