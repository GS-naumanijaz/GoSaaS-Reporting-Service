package com.GRS.backend.entities.request;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.FieldUpdater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    public Request getRequestById(int requestId) {
        Optional<Request> request = requestRepository.findById(requestId);
        if (request.isPresent()) {
            return request.get();
        } else {
            throw new EntityNotFoundException("Application", requestId);
        }
    }

    public Request addRequest(Request request) {
        return requestRepository.save(request);
    }

    public Request updateRequest(Request request) {
        return requestRepository.save(request);
    }

    public Request updateRequest(int requestId, Request request) {
        Optional<Request> existingRequestOpt = requestRepository.findById(requestId);

        if (existingRequestOpt.isPresent()) {
            Request existingRequest = existingRequestOpt.get();

            FieldUpdater.updateField(existingRequest, "date", request);
            FieldUpdater.updateField(existingRequest, "remote_user_id", request);
            FieldUpdater.updateField(existingRequest, "stored_procedure", request);
            FieldUpdater.updateField(existingRequest, "params", request);
            FieldUpdater.updateField(existingRequest, "status", request);
            FieldUpdater.updateField(existingRequest, "report_link", request);

            return requestRepository.save(existingRequest);
        } else {
            throw new EntityNotFoundException("Request", requestId);
        }
    }

    public void deleteRequest(int requestId) {
        Optional<Request> existingRequestOpt = requestRepository.findById(requestId);

        if (existingRequestOpt.isPresent() && !existingRequestOpt.get().getIsDeleted()) {
            Request existingRequest = existingRequestOpt.get();

            existingRequest.setIsDeleted(true);
            existingRequest.setDeletionDate(LocalDateTime.now());

            requestRepository.save(existingRequest);
        } else {
            throw new EntityNotFoundException("Request", requestId);
        }
    }

    public Integer bulkDeleteRequests(List<Integer> requestIds) {
        Integer deletedCount = 0;

        for (Integer id : requestIds) {
            Optional<Request> optionalConnection = requestRepository.findById(id);
            if (optionalConnection.isPresent()) {
                Request existingSourceConnection = optionalConnection.get();

                if (!existingSourceConnection.getIsDeleted()) {
                    existingSourceConnection.setIsDeleted(true);
                    existingSourceConnection.setDeletionDate(LocalDateTime.now());

                    requestRepository.save(existingSourceConnection);
                    deletedCount++;
                }
            }
        }
        return deletedCount;
    }


    
    
}
