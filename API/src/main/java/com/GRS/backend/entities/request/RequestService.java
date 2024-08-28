package com.GRS.backend.entities.request;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Page<Request> getAllRequests(String search, String searchBy, Pageable pageable) {
        Specification<Request> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
        }

        return requestRepository.findAll(spec, pageable);
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
