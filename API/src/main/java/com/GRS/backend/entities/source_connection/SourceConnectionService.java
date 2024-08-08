package com.GRS.backend.entities.source_connection;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.request.Request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SourceConnectionService {
    
    @Autowired
    private SourceConnectionRepository sourceConnectionRepository;

    public Page<SourceConnection> getAllSourceConnections(String search, String searchBy, Pageable pageable) {
        Specification<SourceConnection> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
        }

        return sourceConnectionRepository.findAll(spec, pageable);
    }

    public Optional<SourceConnection> getSourceConnectionById(int sourceConnectionId) {
        return sourceConnectionRepository.findById(sourceConnectionId);
    }

    public SourceConnection addSourceConnection(SourceConnection sourceConnection) {
        return sourceConnectionRepository.save(sourceConnection);
    }

    public SourceConnection updateSourceConnection(int sourceConnectionId, SourceConnection sourceConnection) {
        Optional<SourceConnection> existingSourceConnection = sourceConnectionRepository.findById(sourceConnectionId);

        if (existingSourceConnection.isPresent()) {
            SourceConnection appToUpdate = existingSourceConnection.get();

            //validation & updating here


            return sourceConnectionRepository.save(appToUpdate);
        }
        return null;
    }

    public void deleteSourceConnection(int sourceConnectionId) {
        sourceConnectionRepository.deleteById(sourceConnectionId);
    }
    
    
}
