package com.GRS.backend.base_models;

import org.springframework.data.jpa.domain.Specification;

public abstract class BaseSpecification<T> {

    public static <T> Specification<T> containsTextIn(String searchBy, String search) {
        return (root, query, criteriaBuilder) -> {
            String searchTerm = "%" + search + "%";
            return criteriaBuilder.like(root.get(searchBy), searchTerm);
        };
    }
}
