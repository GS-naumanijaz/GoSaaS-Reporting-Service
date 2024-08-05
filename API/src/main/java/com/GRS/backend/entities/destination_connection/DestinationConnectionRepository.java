package com.GRS.backend.entities.destination_connection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DestinationConnectionRepository extends JpaRepository<DestinationConnection, Integer>, JpaSpecificationExecutor<DestinationConnection> {
}
