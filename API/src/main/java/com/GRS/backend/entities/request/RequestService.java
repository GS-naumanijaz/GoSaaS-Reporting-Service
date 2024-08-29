package com.GRS.backend.entities.request;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.application.ApplicationSpecification;
import com.GRS.backend.enums.RequestStatus;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Page<Request> getAllRequests(String search, String searchBy, Pageable pageable, LocalDate startDate, LocalDate endDate) {
        Specification<Request> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            if ("application".equals(searchBy)) {
                spec = spec.and(BaseSpecification.containsTextIn("application.alias", search));
            } else if ("destination_connection".equals(searchBy)) {
                spec = spec.and(BaseSpecification.containsTextIn("destination_connection.alias", search));
            } else {
            spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
        }}

        spec = spec.and(ApplicationSpecification.betweenDates("updatedAt", startDate, endDate));

        Page<Request> requestPage = requestRepository.findAll(spec, pageable);
        requestPage.forEach(request -> {
            request.getDestination_connection().decryptSecretKey();
        });

        return requestPage;
    }

    public Map<String, Integer> getStatusCounts() {
    List<Request> allRequests = requestRepository.findAll();
    int inprogress = 0;
    int completed = 0;
    int failed = 0;
        for (Request request : allRequests) {
            if (request.getStatus().equals(RequestStatus.valueOf("inprogress"))) {
                inprogress++;
            } else if (request.getStatus().equals(RequestStatus.valueOf("successful"))) {
                completed++;
            } else if (request.getStatus().equals(RequestStatus.valueOf("failed"))) {
                failed++;
            }
        }
        Map<String, Integer> statusCounts = new HashMap<String, Integer>();
        statusCounts.put("inprogress", inprogress);
        statusCounts.put("completed", completed);
        statusCounts.put("failed", failed);

        return statusCounts;
    }

    public Request getRequestById(int requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request", requestId));
    }

    public Request addRequest(Request request) {
        Application application = applicationRepository.findById(request.getApplication().getId())
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));
        request.setApplication(application);

        // Save the request
        return requestRepository.save(request);
    }

    public Request updateRequest(Request request) {
        Request existingRequest = requestRepository.findById(request.getId())
                .orElseThrow(() -> new EntityNotFoundException("Request", request.getId()));

        existingRequest.setReportLink(request.getReportLink());
        existingRequest.setReportName(request.getReportName());
        existingRequest.setStatus(request.getStatus());
        existingRequest.setParams(request.getParams());
        existingRequest.setApplication(request.getApplication());
        existingRequest.setDestination_connection(request.getDestination_connection());

        return requestRepository.save(request);
    }

    public Request saveOrUpdateRequest(Request request) {
        return requestRepository.save(request);  // Assuming you have a requestRepository
    }

    public Request updateRequest(int requestId, Request request) {
        Request existingRequest = requestRepository.findById(requestId)
                .orElseThrow(() -> new EntityNotFoundException("Request", requestId));

        // Manually update fields
        if (request.getParams() != null) {
            existingRequest.setParams(request.getParams());
        }
        if (request.getStatus() != null) {
            existingRequest.setStatus(request.getStatus());
        }
        if (request.getReportName() != null) {
            existingRequest.setReportName(request.getReportName());
        }
        if (request.getReportLink() != null) {
            existingRequest.setReportLink(request.getReportLink());
        }
        if (request.getApplication() != null) {
            existingRequest.setApplication(request.getApplication());
        }
        if (request.getDestination_connection() != null) {
            existingRequest.setDestination_connection(request.getDestination_connection());
        }

        return requestRepository.save(existingRequest);
    }
}
