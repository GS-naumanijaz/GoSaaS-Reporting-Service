package com.GRS.backend.entities.request;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.report.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RequestService {
    
    @Autowired
    private RequestRepository requestRepository;

    public Page<Request> getAllRequests(String search, String searchBy, Pageable pageable) {
        Specification<Request> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
        }

        return requestRepository.findAll(spec, pageable);
    }

    public Optional<Request> getRequestById(int requestId) {
        return requestRepository.findById(requestId);
    }

    public Request addRequest(Request request) {
        return requestRepository.save(request);
    }

    public Request updateRequest(Request request) {
        return requestRepository.save(request);
    }

    public Request updateRequest(int requestId, Request request) {
        Optional<Request> existingRequest = requestRepository.findById(requestId);

        if (existingRequest.isPresent()) {
            Request requestToUpdate = existingRequest.get();

            //validation & updating here


            return requestRepository.save(requestToUpdate);
        }
        return null;
    }

    public void deleteRequest(int requestId) {
        requestRepository.deleteById(requestId);
    }


    
    
}
