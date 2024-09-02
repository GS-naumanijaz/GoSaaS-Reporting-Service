package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.base_models.ConnectionSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.report.ReportRepository;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.DestinationConnectionDTO;
import com.GRS.backend.models.DTO.SourceConnectionDTO;
import com.GRS.backend.utilities.FieldUpdater;
import com.GRS.backend.utilities.S3BucketTester;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DestinationConnectionService {
    
    @Autowired
    private DestinationConnectionRepository destinationConnectionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ReportRepository reportRepository;

    public Page<DestinationConnection> getAllDestinationConnections(int appId, String search, String searchBy, Pageable pageable) {
        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIsDeleted()) {
            Specification<DestinationConnection> spec = Specification.where(BaseSpecification.belongsTo("application", appId));

            if (search != null && !search.isEmpty()) {
                spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
            }
            Page<DestinationConnection> destinationPages = destinationConnectionRepository.findAll(spec, pageable);
            destinationPages.forEach(DestinationConnection::decryptSecretKey);
            return destinationPages;
        }

        throw new EntityNotFoundException("Application", appId);

    }

    public List<DestinationConnectionDTO> getAllDestinationConnections(int appId) {

        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIsDeleted()) {
            Specification<DestinationConnection> spec = Specification
                    .<DestinationConnection> where(BaseSpecification.belongsTo("application", appId))
                    .and(BaseSpecification.isActive())
                    .and(ConnectionSpecification.passedLastTestResult());

            return destinationConnectionRepository.findAll(spec).stream()
                    .map(destinationConnection -> new DestinationConnectionDTO(destinationConnection.getId(), destinationConnection.getAlias()))
                    .collect(Collectors.toList());
        }

        throw new EntityNotFoundException("Application", appId);

    }

    public DestinationConnection getDestinationConnectionById(int destinationConnectionId) {
        Optional<DestinationConnection> connection = destinationConnectionRepository.findById(destinationConnectionId);
        if (connection.isPresent()) {
            DestinationConnection destination = connection.get();
            destination.decryptSecretKey();
            return destination;
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }

    public boolean testDestinationConnection(DestinationConnection destinationConnection, String username) {
//
        String accessKey = destinationConnection.getAccessKey();
        String secretKey = destinationConnection.getSecretKey();

        String bucketName = destinationConnection.getBucketName();
        String region = destinationConnection.getRegion();


        boolean testResult;
        try {
            testResult = S3BucketTester.testS3Connection(accessKey, secretKey, bucketName, region);
        } catch (Exception e) {
            e.printStackTrace();
            testResult = false;
        }

        if (!testResult) {
            List<Report> reportsToUpdate = new ArrayList<>(destinationConnection.getReports());
            for (Report report: reportsToUpdate) {
                report.setIsActive(false);
                report.setLastUpdatedBy(username);
                reportRepository.save(report);
            }
        }


        destinationConnection.encryptSecretKey();
        DestinationConnection updatedDestination = new DestinationConnection();
        updatedDestination.setLastTestResult(testResult);
        updateDestinationConnection(destinationConnection.getId(), updatedDestination, username);

        return testResult;
    }

    public DestinationConnection addDestinationConnection(DestinationConnection destinationConnection, String username) {
        destinationConnection.encryptSecretKey();
        destinationConnection.setCreatedBy(username);
        return destinationConnectionRepository.save(destinationConnection);
    }

    public DestinationConnection updateDestinationConnection(int destinationConnectionId, DestinationConnection destinationConnection, String username) {
        DestinationConnection existingDestination = destinationConnectionRepository.findById(destinationConnectionId)
                .orElseThrow(() -> new EntityNotFoundException("Destination Connection", destinationConnectionId));


        existingDestination.decryptSecretKey();
        FieldUpdater.updateField(existingDestination, "alias", destinationConnection);
        FieldUpdater.updateField(existingDestination, "bucketName", destinationConnection);
        FieldUpdater.updateField(existingDestination, "region", destinationConnection);
        FieldUpdater.updateField(existingDestination, "isActive", destinationConnection);
        FieldUpdater.updateField(existingDestination, "secretKey", destinationConnection);
        FieldUpdater.updateField(existingDestination, "accessKey", destinationConnection);
        FieldUpdater.updateField(existingDestination, "lastTestResult", destinationConnection);


        if (!Boolean.TRUE.equals(existingDestination.getIsActive())) {
            for (Report report : existingDestination.getReports()) {
                report.setIsActive(false);
                reportRepository.save(report);
            }
        }

        if (destinationConnection.getLastTestResult() == null) {
            existingDestination.setLastTestResult(null);
        }

        existingDestination.setLastUpdatedBy(username);
        existingDestination.encryptSecretKey();

        return destinationConnectionRepository.save(existingDestination); // Save attached entity
    }


    public List<DestinationConnection> bulkUpdateIsActive(List<Integer> destinationConnectionIds, boolean isActive, String username) {
        List<DestinationConnection> updatedConnections = new ArrayList<>();

        for (Integer id : destinationConnectionIds) {
            Optional<DestinationConnection> optionalConnection = destinationConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                DestinationConnection connection = optionalConnection.get();
                connection.setIsActive(isActive);
                connection.setLastUpdatedBy(username);
                if (!isActive) {
                    List<Report> reportsToUpdate = new ArrayList<>(connection.getReports());
                    for (Report report: reportsToUpdate) {
                        report.setIsActive(false);
                        report.setLastUpdatedBy(username);
                        reportRepository.save(report);
                    }
                }

                updatedConnections.add(destinationConnectionRepository.save(connection));
            }
        }

        return updatedConnections;
    }


    public DestinationConnection deleteDestinationConnection(int destinationConnectionId, String username) {
        Optional<DestinationConnection> existingDestinationOpt = destinationConnectionRepository.findById(destinationConnectionId);

        if (existingDestinationOpt.isPresent() && !existingDestinationOpt.get().getIsDeleted()) {
            DestinationConnection existingDestination = existingDestinationOpt.get();

            existingDestination.setIsDeleted(true);
            existingDestination.setDeletionDate(LocalDateTime.now());
            existingDestination.setDeletedBy(username);

            List<Report> reportsToDelete = new ArrayList<>(existingDestination.getReports());
            for (Report report: reportsToDelete) {
                report.setIsDeleted(true);
                report.setDeletionDate(LocalDateTime.now());
                report.setDeletedBy(username);

                reportRepository.save(report);
            }

            destinationConnectionRepository.save(existingDestination);
            return existingDestination;
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }

    public List<String> bulkDeleteDestinationConnections(List<Integer> destinationIds, String username) {
        List<String> deletedIds = new ArrayList<>();

        for (Integer id : destinationIds) {
            Optional<DestinationConnection> optionalConnection = destinationConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                DestinationConnection existingDestination = optionalConnection.get();

                if (!existingDestination.getIsDeleted()) {
                    existingDestination.setIsDeleted(true);
                    existingDestination.setDeletionDate(LocalDateTime.now());
                    existingDestination.setDeletedBy(username);

                    List<Report> reportsToDelete = new ArrayList<>(existingDestination.getReports());
                    for (Report report: reportsToDelete) {
                        report.setIsDeleted(true);
                        report.setDeletionDate(LocalDateTime.now());
                        report.setDeletedBy(username);

                        reportRepository.save(report);
                    }

                    destinationConnectionRepository.save(existingDestination);
                    deletedIds.add(existingDestination.getAlias());
                }
            }
        }
        return deletedIds;
    }



}
