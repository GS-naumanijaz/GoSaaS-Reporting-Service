package com.GRS.backend.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

public interface ApplicationRepository extends JpaRepository<Application, Integer>,  JpaSpecificationExecutor<Application> {
}
