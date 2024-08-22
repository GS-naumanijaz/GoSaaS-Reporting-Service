package com.GRS.backend.entities.report;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import org.springframework.data.jpa.domain.Specification;

public class ReportSpecification extends BaseSpecification<Report> {
    public static Specification<Report> isPinned() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.isTrue(root.get("isPinned"));
    }
}
