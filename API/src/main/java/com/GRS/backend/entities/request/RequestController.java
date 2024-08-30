package com.GRS.backend.entities.request;

import com.GRS.backend.annotations.QueryParams;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.resolver.QueryArgumentResolver;
import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @GetMapping
    public ResponseEntity<Object> getAllRequests(
            @QueryParams(sortBy = "createdAt") QueryArgumentResolver.QueryParamsContainer queryParams) {
        String search = queryParams.getSearch();
        String searchBy = queryParams.getSearchBy();
        Pageable pageable = queryParams.getPageable();
        LocalDate startDate = queryParams.getStartDate();
        LocalDate endDate = queryParams.getEndDate();

        Page<Request> allRequests = requestService.getAllRequests(search, searchBy, pageable, startDate, endDate);
        return Response.responseBuilder("Requests retrieved successfully", HttpStatus.OK, allRequests);
    }

    @GetMapping("/statusCounts")
    public ResponseEntity<Object> getStatusCounts() {
        Map<String, Integer> requests = requestService.getStatusCounts();
        return Response.responseBuilder("Requests retrieved successfully", HttpStatus.OK, requests);
    }
}
