package com.GRS.backend.entities.destination_connection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface DestinationConnectionRepository extends JpaRepository<DestinationConnection, Integer>, JpaSpecificationExecutor<DestinationConnection> {
//    @Transactional
//    @Query(value = "CREATE UNIQUE INDEX unique_destination_alias_per_application " +
//            "ON destination_connections (app_id, alias) " +
//            "WHERE is_deleted = false;", nativeQuery = true)
//    void createUniqueIndex();
}
