package com.GRS.backend.entities.source_connection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SourceConnectionService {
    
    @Autowired
    private SourceConnectionRepository sourceConnectionRepository;

    public Page<SourceConnection> getAllSourceConnections(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            //implement search here
        }
        return sourceConnectionRepository.findAll(pageable);
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
