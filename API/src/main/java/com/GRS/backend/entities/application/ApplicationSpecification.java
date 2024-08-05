package com.GRS.backend.entities.application;

import org.springframework.data.jpa.domain.Specification;

public class ApplicationSpecification {

    public static Specification<Application> containsTextInNameOrDescription(String text) {
        return (root, query, cb) -> {
            String likePattern = "%" + text.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), likePattern),
                    cb.like(cb.lower(root.get("description")), likePattern)
            );
        };
    }
}
