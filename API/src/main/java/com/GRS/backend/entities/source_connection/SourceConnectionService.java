package com.GRS.backend.entities.source_connection;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.FieldUpdater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SourceConnectionService {

    @Autowired
    private SourceConnectionRepository sourceConnectionRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Page<SourceConnection> getAllSourceConnections(int appId, String search, String searchBy, Pageable pageable) {

        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIs_deleted()) {
            Specification<SourceConnection> spec = Specification.where(BaseSpecification.belongsTo("application", appId));

            if (search != null && !search.isEmpty()) {
                spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
            }

            return sourceConnectionRepository.findAll(spec, pageable);
        }

        throw new EntityNotFoundException("Application", appId);

    }

    public Optional<SourceConnection> getSourceConnectionById(int sourceConnectionId) {
        return sourceConnectionRepository.findById(sourceConnectionId);
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
            FieldUpdater.updateField(existingSourceConnection, "is_active", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "username", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "password", sourceConnection);
            FieldUpdater.updateField(existingSourceConnection, "database_name", sourceConnection);


            return sourceConnectionRepository.save(existingSourceConnection);
        } else {
            throw new EntityNotFoundException("Source Connection", sourceConnectionId);
        }
    }

    public void deleteSourceConnection(int sourceConnectionId) {
        Optional<SourceConnection> existingSourceConnectionOpt = sourceConnectionRepository.findById(sourceConnectionId);

        if (existingSourceConnectionOpt.isPresent() && !existingSourceConnectionOpt.get().getIs_deleted()) {
            SourceConnection existingSourceConnection = existingSourceConnectionOpt.get();

            existingSourceConnection.setIs_deleted(true);
            existingSourceConnection.setDeletion_date(LocalDateTime.now());

            sourceConnectionRepository.save(existingSourceConnection);
        } else {
            throw new EntityNotFoundException("SourceConnection", sourceConnectionId);
        }
    }
    
    
}
