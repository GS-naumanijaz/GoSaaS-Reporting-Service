package com.GRS.backend.entities.source_connection;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.report.ReportRepository;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.SourceConnectionDTO;
import com.GRS.backend.models.StoredProcedure;
import com.GRS.backend.utilities.DatabaseUtilities;
import com.GRS.backend.utilities.FieldUpdater;
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
public class SourceConnectionService {

    @Autowired
    private SourceConnectionRepository sourceConnectionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ReportRepository reportRepository;

    public Page<SourceConnection> getAllSourceConnections(int appId, String search, String searchBy, Pageable pageable) {

        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && Boolean.TRUE.equals(!existingApplicationOpt.get().getIsDeleted())) {
            Specification<SourceConnection> spec = Specification.where(BaseSpecification.belongsTo("application", appId));

            if (search != null && !search.isEmpty()) {
                spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
            }

            Page<SourceConnection> sourcePages = sourceConnectionRepository.findAll(spec, pageable);

            sourcePages.forEach(SourceConnection::decryptPassword);

            return sourcePages;
        }

        throw new EntityNotFoundException("Application", appId);
    }

    public List<SourceConnectionDTO> getAllSourceConnections(int appId) {

        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && Boolean.TRUE.equals(!existingApplicationOpt.get().getIsDeleted())) {
            Specification<SourceConnection> spec = Specification
                    .<SourceConnection>where(BaseSpecification.belongsTo("application", appId))
                    .and(BaseSpecification.isActive());

            return sourceConnectionRepository.findAll(spec).stream()
                    .map(sourceConnection -> new SourceConnectionDTO(sourceConnection.getId(), sourceConnection.getAlias()))
                    .collect(Collectors.toList());
        }

        throw new EntityNotFoundException("Application", appId);

    }

    public SourceConnection getSourceConnectionById(int sourceConnectionId) {
        Optional<SourceConnection> connection = sourceConnectionRepository.findById(sourceConnectionId);
        if (connection.isPresent()) {
            SourceConnection source = connection.get();
            source.decryptPassword();
            return source;
        } else {
            throw new EntityNotFoundException("Source Connection", sourceConnectionId);
        }
    }

    public Boolean testSourceConnection(SourceConnection sourceConnection, String user) {
//        "jdbc:postgresql://localhost:5432/gosaas_reporting_service";

        String type = sourceConnection.getType().getDbType();
        String host = sourceConnection.getHost();
        int port = sourceConnection.getPort();
        String dbName = sourceConnection.getDatabaseName();

        String url = "jdbc:" + type + "://" + host + ":" + port + "/" + dbName;
        String username = sourceConnection.getUsername();
        String password = sourceConnection.getPassword();
        String driverClassName  = sourceConnection.getType().getDriverClassName();

        boolean testResult = DatabaseUtilities.tryConnect(url, username, password, driverClassName);

        sourceConnection.encryptPassword();
        SourceConnection updatedSource = new SourceConnection();
        updatedSource.setLastTestResult(testResult);
        updateSourceConnection(sourceConnection.getId(), updatedSource, user);

        return testResult;
    }

    public SourceConnection addSourceConnection(SourceConnection sourceConnection, String username) {
            sourceConnection.encryptPassword();
            sourceConnection.setCreatedBy(username);
            return sourceConnectionRepository.save(sourceConnection);
    }

    public SourceConnection updateSourceConnection(int sourceConnectionId, SourceConnection sourceConnection, String username) {
        Optional<SourceConnection> existingSourceConnectionOpt = sourceConnectionRepository.findById(sourceConnectionId);

        if (existingSourceConnectionOpt.isPresent()) {
            SourceConnection existingSourceConnection = existingSourceConnectionOpt.get();

            existingSourceConnection.decryptPassword();

            FieldUpdater.updateField(existingSourceConnection, "alias", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "type", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "host", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "port", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "isActive", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "username", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "password", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "databaseName", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "schema", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "lastTestResult", sourceConnection);

            if (Boolean.FALSE.equals(existingSourceConnection.getIsActive())) {
                List<Report> reportsToUpdate = new ArrayList<>(existingSourceConnection.getReports());
                for (Report report: reportsToUpdate) {
                    report.setIsActive(false);

                    reportRepository.save(report);
                }
            }
            existingSourceConnection.setLastUpdatedBy(username);
            existingSourceConnection.encryptPassword();
            return sourceConnectionRepository.save(existingSourceConnection);
        } else {
            throw new EntityNotFoundException("Source Connection", sourceConnectionId);
        }
    }

    public List<SourceConnection> bulkUpdateIsActive(List<Integer> sourceConnectionIds, boolean isActive, String username) {
        List<SourceConnection> updatedConnections = new ArrayList<>();

        for (Integer id : sourceConnectionIds) {
            Optional<SourceConnection> optionalConnection = sourceConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                SourceConnection connection = optionalConnection.get();
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

                updatedConnections.add(sourceConnectionRepository.save(connection));
            }
        }

        return updatedConnections;
    }

    public SourceConnection deleteSourceConnection(int sourceConnectionId, String username) {
        Optional<SourceConnection> existingSourceConnectionOpt = sourceConnectionRepository.findById(sourceConnectionId);

        if (existingSourceConnectionOpt.isPresent() && !existingSourceConnectionOpt.get().getIsDeleted()) {
            SourceConnection existingSourceConnection = existingSourceConnectionOpt.get();

            existingSourceConnection.setIsDeleted(true);
            existingSourceConnection.setDeletionDate(LocalDateTime.now());

            List<Report> reportsToDelete = new ArrayList<>(existingSourceConnection.getReports());
            for (Report report: reportsToDelete) {
                report.setIsDeleted(true);
                report.setDeletionDate(LocalDateTime.now());
                report.setDeletedBy(username);

                reportRepository.save(report);
            }

            sourceConnectionRepository.save(existingSourceConnection);
            return existingSourceConnection;
        } else {
            throw new EntityNotFoundException("SourceConnection", sourceConnectionId);
        }
    }

    public List<String> bulkDeleteSourceConnections(List<Integer> sourceConnectionIds, String username) {
        List<String> deletedIds = new ArrayList<>();

        for (Integer id : sourceConnectionIds) {
            Optional<SourceConnection> optionalConnection = sourceConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                SourceConnection existingSourceConnection = optionalConnection.get();

                if (!existingSourceConnection.getIsDeleted()) {
                    existingSourceConnection.setIsDeleted(true);
                    existingSourceConnection.setDeletionDate(LocalDateTime.now());
                    existingSourceConnection.setDeletedBy(username);

                    List<Report> reportsToDelete = new ArrayList<>(existingSourceConnection.getReports());
                    for (Report report: reportsToDelete) {
                        report.setIsDeleted(true);
                        report.setDeletionDate(LocalDateTime.now());
                        report.setDeletedBy(username);

                        reportRepository.save(report);
                    }

                    sourceConnectionRepository.save(existingSourceConnection);
                    deletedIds.add(existingSourceConnection.getAlias());
                }

            }
        }
        return deletedIds;
    }


    public List<StoredProcedure> getSourceConnectionStoredProcedures(SourceConnection sourceConnection) {
        return DatabaseUtilities.getDatabaseInfo(sourceConnection);
    }
}
