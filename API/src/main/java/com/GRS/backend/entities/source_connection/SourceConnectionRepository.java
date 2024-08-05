package com.GRS.backend.entities.source_connection;

import com.GRS.backend.entities.application.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SourceConnectionRepository extends JpaRepository<SourceConnection, Integer>, JpaSpecificationExecutor<SourceConnection> {
}
