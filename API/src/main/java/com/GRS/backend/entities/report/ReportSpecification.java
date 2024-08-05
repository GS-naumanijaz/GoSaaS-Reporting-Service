package com.GRS.backend.entities.report;

import org.springframework.data.jpa.domain.Specification;

public class ReportSpecification {

    public static Specification<Report> containsTextInAliasOrDescription(String text) {
        return (root, query, cb) -> {
            String likePattern = "%" + text.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("alias")), likePattern),
                    cb.like(cb.lower(root.get("description")), likePattern)
            );
        };
    }
}
