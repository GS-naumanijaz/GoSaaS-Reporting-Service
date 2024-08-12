package com.GRS.backend.base_models;

import com.GRS.backend.exceptionHandler.exceptions.InvalidQueryParamException;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.Field;

public abstract class BaseSpecification<T> {

    public static <T> Specification<T> containsTextIn(String searchBy, String search) {
        return (root, query, criteriaBuilder) -> {
            if (!doesFieldExist(root.getJavaType(), searchBy)) {
                throw new InvalidQueryParamException(searchBy, "search_by");
            }
            String searchTerm = "%" + search.toLowerCase() + "%";
            return criteriaBuilder.like(criteriaBuilder.lower(root.get(searchBy)), searchTerm);
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

    private static boolean doesFieldExist(Class<?> entityClass, String fieldName) {
        for (Field field : entityClass.getDeclaredFields()) {
            if (field.getName().equals(fieldName)) {
                return true;
            }
        }
        return false;
    }
}
