package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.base_models.BaseSpecification;
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
                    .and(BaseSpecification.isActive());

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
            System.out.println("before" + destination.getSecretKey());
            destination.decryptSecretKey();
            System.out.println("after" + destination.getSecretKey());
            return destination;
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }

    public boolean testDestinationConnection(DestinationConnection destinationConnection) {
//
        System.out.println(destinationConnection.getSecretKey());
        String accessKey = destinationConnection.getAccessKey();
        String secretKey = destinationConnection.getSecretKey();

        String bucketName = destinationConnection.getBucketName();
        String region = destinationConnection.getRegion();




        boolean testResult = S3BucketTester.testS3Connection(accessKey, secretKey, bucketName, region);

        destinationConnection.encryptSecretKey();
        DestinationConnection updatedDestination = new DestinationConnection();
        updatedDestination.setLastTestResult(testResult);
        updateDestinationConnection(destinationConnection.getId(), updatedDestination);

        return testResult;
    }

    public DestinationConnection addDestinationConnection(DestinationConnection destinationConnection) {
        destinationConnection.encryptSecretKey();
        return destinationConnectionRepository.save(destinationConnection);
    }

    public DestinationConnection updateDestinationConnection(int destinationConnectionId, DestinationConnection destinationConnection) {
        Optional<DestinationConnection> existingDestinationOpt = destinationConnectionRepository.findById(destinationConnectionId);

        if (existingDestinationOpt.isPresent()) {
            DestinationConnection existingDestination = existingDestinationOpt.get();

            existingDestination.decryptSecretKey();

            FieldUpdater.updateField(existingDestination, "alias", destinationConnection);
            FieldUpdater.updateField(existingDestination, "bucketName", destinationConnection);
            FieldUpdater.updateField(existingDestination, "region", destinationConnection);
            FieldUpdater.updateField(existingDestination, "isActive", destinationConnection);
            FieldUpdater.updateField(existingDestination, "secretKey", destinationConnection);
            FieldUpdater.updateField(existingDestination, "accessKey", destinationConnection);

            if (Boolean.FALSE.equals(existingDestination.getIsActive())) {
                List<Report> reportsToUpdate = new ArrayList<>(existingDestination.getReports());
                for (Report report: reportsToUpdate) {
                    report.setIsActive(false);

                    reportRepository.save(report);
                }
            }
            existingDestination.encryptSecretKey();
            return destinationConnectionRepository.save(existingDestination);
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }

    public List<DestinationConnection> bulkUpdateIsActive(List<Integer> destinationConnectionIds, boolean isActive) {
        List<DestinationConnection> updatedConnections = new ArrayList<>();

        for (Integer id : destinationConnectionIds) {
            Optional<DestinationConnection> optionalConnection = destinationConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                DestinationConnection connection = optionalConnection.get();
                connection.setIsActive(isActive);

                if (!isActive) {
                    List<Report> reportsToUpdate = new ArrayList<>(connection.getReports());
                    for (Report report: reportsToUpdate) {
                        report.setIsActive(false);

                        reportRepository.save(report);
                    }
                }

                updatedConnections.add(destinationConnectionRepository.save(connection));
            }
        }

        return updatedConnections;
    }


    public DestinationConnection deleteDestinationConnection(int destinationConnectionId) {
        Optional<DestinationConnection> existingDestinationOpt = destinationConnectionRepository.findById(destinationConnectionId);

        if (existingDestinationOpt.isPresent() && !existingDestinationOpt.get().getIsDeleted()) {
            DestinationConnection existingDestination = existingDestinationOpt.get();

            existingDestination.setIsDeleted(true);
            existingDestination.setDeletionDate(LocalDateTime.now());

            List<Report> reportsToDelete = new ArrayList<>(existingDestination.getReports());
            for (Report report: reportsToDelete) {
                report.setIsDeleted(true);
                report.setDeletionDate(LocalDateTime.now());

                reportRepository.save(report);
            }

            destinationConnectionRepository.save(existingDestination);
            return existingDestination;
        } else {
            throw new EntityNotFoundException("Destination Connection", destinationConnectionId);
        }
    }

    public List<String> bulkDeleteDestinationConnections(List<Integer> destinationIds) {
        List<String> deletedIds = new ArrayList<>();

        for (Integer id : destinationIds) {
            Optional<DestinationConnection> optionalConnection = destinationConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                DestinationConnection existingDestination = optionalConnection.get();

                if (!existingDestination.getIsDeleted()) {
                    existingDestination.setIsDeleted(true);
                    existingDestination.setDeletionDate(LocalDateTime.now());

                    List<Report> reportsToDelete = new ArrayList<>(existingDestination.getReports());
                    for (Report report: reportsToDelete) {
                        report.setIsDeleted(true);
                        report.setDeletionDate(LocalDateTime.now());

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
