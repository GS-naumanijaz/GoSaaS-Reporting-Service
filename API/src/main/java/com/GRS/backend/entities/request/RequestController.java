package com.GRS.backend.entities.request;

import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @GetMapping
    public ResponseEntity<Object> getAllRequests(@RequestParam(required = false) String search,
                                                 @RequestParam(required = false) String searchBy,
                                                 Pageable pageable) {
        Page<Request> allRequests = requestService.getAllRequests(search, searchBy, pageable);



        return Response.responseBuilder("Requests retrieved successfully", HttpStatus.OK, allRequests);
    }

    @GetMapping("/statusCounts")
    public ResponseEntity<Object> getStatusCounts() {
        Map<String, Integer> requests = requestService.getStatusCounts();
        return Response.responseBuilder("Requests retrieved successfully", HttpStatus.OK, requests);
    }

//    @GetMapping("/{requestId}")
//    public ResponseEntity<Object> getRequestById(@PathVariable int requestId) {
//        Request requestToAdd = requestService.getRequestById(requestId);
//        return Response.responseBuilder("Request found successfully", HttpStatus.OK, requestToAdd);
//    }
}
