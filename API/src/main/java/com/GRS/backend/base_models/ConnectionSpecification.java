package com.GRS.backend.base_models;

import com.GRS.backend.entities.application.Application;
import org.springframework.data.jpa.domain.Specification;

public class ConnectionSpecification<T> extends BaseSpecification<T>{
    public static <T> Specification<T> passedLastTestResult() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("lastTestResult"))
        );
    }
}
