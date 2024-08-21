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
import java.util.Map;
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

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIsDeleted()) {
            Specification<SourceConnection> spec = Specification.where(BaseSpecification.belongsTo("application", appId));

            if (search != null && !search.isEmpty()) {
                spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
            }

            return sourceConnectionRepository.findAll(spec, pageable);
        }

        throw new EntityNotFoundException("Application", appId);

    }

    public List<SourceConnectionDTO> getAllSourceConnections(int appId) {

        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIsDeleted()) {
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
            return connection.get();
        } else {
            throw new EntityNotFoundException("Source Connection", sourceConnectionId);
        }
    }

    public Boolean testSourceConnection(SourceConnection sourceConnection) {
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

        sourceConnection.setLastTestResult(testResult);
        updateSourceConnection(sourceConnection.getId(), sourceConnection);

        return testResult;
    }

    public SourceConnection addSourceConnection(SourceConnection sourceConnection) {
        return sourceConnectionRepository.save(sourceConnection);
    }

    public SourceConnection updateSourceConnection(int sourceConnectionId, SourceConnection sourceConnection) {
        Optional<SourceConnection> existingSourceConnectionOpt = sourceConnectionRepository.findById(sourceConnectionId);

        if (existingSourceConnectionOpt.isPresent()) {
            SourceConnection existingSourceConnection = existingSourceConnectionOpt.get();

            FieldUpdater.updateField(existingSourceConnection, "alias", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "type", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "host", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "port", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "isActive", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "username", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "password", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "databaseName", sourceConnection);

            if (Boolean.FALSE.equals(existingSourceConnection.getIsActive())) {
                List<Report> reportsToUpdate = new ArrayList<>(existingSourceConnection.getReports());
                for (Report report: reportsToUpdate) {
                    report.setIsActive(false);

                    reportRepository.save(report);
                }
            }

            return sourceConnectionRepository.save(existingSourceConnection);
        } else {
            throw new EntityNotFoundException("Source Connection", sourceConnectionId);
        }
    }

    public List<SourceConnection> bulkUpdateIsActive(List<Integer> sourceConnectionIds, boolean isActive) {
        List<SourceConnection> updatedConnections = new ArrayList<>();

        for (Integer id : sourceConnectionIds) {
            Optional<SourceConnection> optionalConnection = sourceConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                SourceConnection connection = optionalConnection.get();
                connection.setIsActive(isActive);

                if (!isActive) {
                    List<Report> reportsToUpdate = new ArrayList<>(connection.getReports());
                    for (Report report: reportsToUpdate) {
                        report.setIsActive(false);

                        reportRepository.save(report);
                    }
                }

                updatedConnections.add(sourceConnectionRepository.save(connection));
            }
        }

        return updatedConnections;
    }

    public void deleteSourceConnection(int sourceConnectionId) {
        Optional<SourceConnection> existingSourceConnectionOpt = sourceConnectionRepository.findById(sourceConnectionId);

        if (existingSourceConnectionOpt.isPresent() && !existingSourceConnectionOpt.get().getIsDeleted()) {
            SourceConnection existingSourceConnection = existingSourceConnectionOpt.get();

            existingSourceConnection.setIsDeleted(true);
            existingSourceConnection.setDeletionDate(LocalDateTime.now());

            List<Report> reportsToDelete = new ArrayList<>(existingSourceConnection.getReports());
            for (Report report: reportsToDelete) {
                report.setIsDeleted(true);
                report.setDeletionDate(LocalDateTime.now());

                reportRepository.save(report);
            }

            sourceConnectionRepository.save(existingSourceConnection);
        } else {
            throw new EntityNotFoundException("SourceConnection", sourceConnectionId);
        }
    }

    public Integer bulkDeleteSourceConnections(List<Integer> sourceConnectionIds) {
        Integer deletedCount = 0;

        for (Integer id : sourceConnectionIds) {
            Optional<SourceConnection> optionalConnection = sourceConnectionRepository.findById(id);
            if (optionalConnection.isPresent()) {
                SourceConnection existingSourceConnection = optionalConnection.get();

                if (!existingSourceConnection.getIsDeleted()) {
                    existingSourceConnection.setIsDeleted(true);
                    existingSourceConnection.setDeletionDate(LocalDateTime.now());

                    List<Report> reportsToDelete = new ArrayList<>(existingSourceConnection.getReports());
                    for (Report report: reportsToDelete) {
                        report.setIsDeleted(true);
                        report.setDeletionDate(LocalDateTime.now());

                        reportRepository.save(report);
                    }

                    sourceConnectionRepository.save(existingSourceConnection);
                    deletedCount++;
                }

            }
        }
        return deletedCount;
    }


    public List<StoredProcedure> getSourceConnectionStoredProcedures(SourceConnection sourceConnection) {
        return DatabaseUtilities.getDatabaseInfo(sourceConnection);
    }
}
