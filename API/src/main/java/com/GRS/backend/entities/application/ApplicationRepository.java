package com.GRS.backend.entities.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Integer>,  JpaSpecificationExecutor<Application> {

    Optional<Application> findByAlias(String alias);

}
