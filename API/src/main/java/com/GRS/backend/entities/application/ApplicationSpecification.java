package com.GRS.backend.entities.application;

import com.GRS.backend.base_models.BaseSpecification;
import org.springframework.data.jpa.domain.Specification;


public class ApplicationSpecification extends BaseSpecification<Application> {

//    public static Specification<Application> containsTextIn(String searchBy, String search) {
//        return (root, query, criteriaBuilder) -> {
//            String searchTerm = "%" + search + "%";
//            return criteriaBuilder.like(root.get(searchBy), searchTerm);
//        };
//    }

    public static Specification<Application> hasStatus(String status) {
        return (root, query, criteriaBuilder) -> {
            if (status == null || "all".equalsIgnoreCase(status)) {
                return criteriaBuilder.conjunction(); // No filter for "all"
            }
            if ("active".equalsIgnoreCase(status)) {
                return criteriaBuilder.isTrue(root.get("isActive"));
            }
            if ("inactive".equalsIgnoreCase(status)) {
                return criteriaBuilder.isFalse(root.get("isActive"));
            }
            throw new IllegalArgumentException("Invalid status value");
        };
    }
}
