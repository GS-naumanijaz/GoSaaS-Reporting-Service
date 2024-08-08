package com.GRS.backend.base_models;

import org.springframework.data.jpa.domain.Specification;

public abstract class BaseSpecification<T> {

    public static <T> Specification<T> containsTextIn(String searchBy, String search) {
        return (root, query, criteriaBuilder) -> {
            String searchTerm = "%" + search + "%";
            return criteriaBuilder.like(root.get(searchBy), searchTerm);
        };
    }

    public static <T> Specification<T> belongsTo(String identifier, int id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.equal(root.get(identifier).get("id"), id),
                criteriaBuilder.isFalse(root.get("is_deleted"))
        );
    }

    public static <T> Specification<T> isNotDeleted() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isFalse(root.get("is_deleted"))
        );
    }
}
