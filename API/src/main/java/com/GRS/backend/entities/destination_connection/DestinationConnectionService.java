package com.GRS.backend.entities.destination_connection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DestinationConnectionService {
    
    @Autowired
    private DestinationConnectionRepository destinationConnectionRepository;

    public Page<DestinationConnection> getAllDestinationConnections(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            //implement search here
        }
        return destinationConnectionRepository.findAll(pageable);
    }

    public Optional<DestinationConnection> getDestinationConnectionById(int destinationConnectionId) {
        return destinationConnectionRepository.findById(destinationConnectionId);
    }

    public DestinationConnection addDestinationConnection(DestinationConnection destinationConnection) {
        return destinationConnectionRepository.save(destinationConnection);
    }

    public DestinationConnection updateDestinationConnection(int destinationConnectionId, DestinationConnection destinationConnection) {
        Optional<DestinationConnection> existingDestinationConnection = destinationConnectionRepository.findById(destinationConnectionId);

        if (existingDestinationConnection.isPresent()) {
            DestinationConnection connectionToUpdate = existingDestinationConnection.get();

            //validation & updating here


            return destinationConnectionRepository.save(connectionToUpdate);
        }
        return null;
    }

    public void deleteDestinationConnection(int destinationConnectionId) {
        destinationConnectionRepository.deleteById(destinationConnectionId);
    }
    
    
}
