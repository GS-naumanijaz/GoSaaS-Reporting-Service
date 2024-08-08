package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.FieldUpdater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DestinationConnectionService {
    
    @Autowired
    private DestinationConnectionRepository destinationConnectionRepository;

    public Page<DestinationConnection> getAllDestinationConnections(String search, String searchBy, Pageable pageable) {
        Specification<DestinationConnection> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
        }
        return destinationConnectionRepository.findAll(spec, pageable);
    }

    public Optional<DestinationConnection> getDestinationConnectionById(int destinationConnectionId) {
        return destinationConnectionRepository.findById(destinationConnectionId);
    }

    public DestinationConnection addDestinationConnection(DestinationConnection destinationConnection) {
        return destinationConnectionRepository.save(destinationConnection);
    }

    public DestinationConnection updateDestinationConnection(int destinationConnectionId, DestinationConnection destinationConnection) {
        Optional<DestinationConnection> existingDestinationOpt = destinationConnectionRepository.findById(destinationConnectionId);

        if (existingDestinationOpt.isPresent()) {
            DestinationConnection existingDestination = existingDestinationOpt.get();

            FieldUpdater.updateField(existingDestination, "alias", existingDestination);
            FieldUpdater.updateField(existingDestination, "type", existingDestination);
            FieldUpdater.updateField(existingDestination, "url", existingDestination);
            FieldUpdater.updateField(existingDestination, "port", existingDestination);
            FieldUpdater.updateField(existingDestination, "is_active", existingDestination);
            FieldUpdater.updateField(existingDestination, "secret_key", existingDestination);
            FieldUpdater.updateField(existingDestination, "access_key", existingDestination);

            return destinationConnectionRepository.save(existingDestination);
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }

    public void deleteDestinationConnection(int destinationConnectionId) {
        destinationConnectionRepository.deleteById(destinationConnectionId);
    }
    
    
}
