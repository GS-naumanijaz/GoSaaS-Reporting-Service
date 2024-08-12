package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.FieldUpdater;
import com.GRS.backend.utilities.S3BucketTester;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class DestinationConnectionService {
    
    @Autowired
    private DestinationConnectionRepository destinationConnectionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Page<DestinationConnection> getAllDestinationConnections(int appId, String search, String searchBy, Pageable pageable) {
        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIsDeleted()) {
            Specification<DestinationConnection> spec = Specification.where(BaseSpecification.belongsTo("application", appId));

            if (search != null && !search.isEmpty()) {
                spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
            }
            return destinationConnectionRepository.findAll(spec, pageable);
        }

        throw new EntityNotFoundException("Application", appId);

    }

    public Optional<DestinationConnection> getDestinationConnectionById(int destinationConnectionId) {
        return destinationConnectionRepository.findById(destinationConnectionId);
    }

    public boolean testDestinationConnection(DestinationConnection destinationConnection) {
//
        String accessKey = destinationConnection.getAccessKey();
        String secretKey = destinationConnection.getSecretKey();

        String bucketName = destinationConnection.getBucketName();
        String region = destinationConnection.getRegion();

        return S3BucketTester.testS3Connection(accessKey, secretKey, bucketName, region);
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
            FieldUpdater.updateField(existingDestination, "isActive", existingDestination);
            FieldUpdater.updateField(existingDestination, "secretKey", existingDestination);
            FieldUpdater.updateField(existingDestination, "accessKey", existingDestination);

            return destinationConnectionRepository.save(existingDestination);
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }

    public void deleteDestinationConnection(int destinationConnectionId) {
        Optional<DestinationConnection> existingDestinationOpt = destinationConnectionRepository.findById(destinationConnectionId);

        if (existingDestinationOpt.isPresent() && !existingDestinationOpt.get().getIsDeleted()) {
            DestinationConnection existingDestination = existingDestinationOpt.get();

            existingDestination.setIsDeleted(true);
            existingDestination.setDeletionDate(LocalDateTime.now());

            destinationConnectionRepository.save(existingDestination);
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }



}
