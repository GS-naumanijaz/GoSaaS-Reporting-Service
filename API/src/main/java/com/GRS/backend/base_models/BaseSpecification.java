package com.GRS.backend.base_models;

import com.GRS.backend.exceptionHandler.exceptions.InvalidQueryParamException;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public abstract class BaseSpecification<T> {

    public static <T> Specification<T> containsTextIn(String searchBy, String search) {
        return (root, query, criteriaBuilder) -> {
            String searchTerm = "%" + search.toLowerCase() + "%";

            String[] searchByParts = searchBy.split("\\.");
            Path<?> path = root.get(searchByParts[0]);

            for (int i = 1; i < searchByParts.length; i++) {
                path = path.get(searchByParts[i]);
            }

            Class<?> fieldType = path.getJavaType();

            if (fieldType.equals(String.class)) {
                return criteriaBuilder.like(criteriaBuilder.lower((Expression<String>) path), searchTerm);
            } else if (Enum.class.isAssignableFrom(fieldType)) {
                String searchLower = search.toLowerCase();
                @SuppressWarnings("unchecked")
                Class<? extends Enum<?>> enumType = (Class<? extends Enum<?>>) fieldType;
                List<Enum<?>> matchingEnums = Arrays.stream(enumType.getEnumConstants())
                        .filter(enumConstant -> enumConstant.name().toLowerCase().contains(searchLower))
                        .collect(Collectors.toList());

                if (matchingEnums.isEmpty()) {
                    return criteriaBuilder.disjunction(); // No match, return empty
                } else {
                    return path.in(matchingEnums);
                }
            } else if (fieldType.equals(Boolean.class)) {
                boolean booleanValue;
                if ("active".equalsIgnoreCase(search)) {
                    booleanValue = true;
                } else if ("inactive".equalsIgnoreCase(search)) {
                    booleanValue = false;
                } else {
                    throw new InvalidQueryParamException(search, "boolean");
                }
                return criteriaBuilder.equal(path, booleanValue);
            } else {
                return criteriaBuilder.like(criteriaBuilder.lower(path.as(String.class)), searchTerm);
            }
        };
    }


    public static <T> Specification<T> belongsTo(String identifier, int id) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.equal(root.get(identifier).get("id"), id),
                criteriaBuilder.isFalse(root.get("isDeleted"))
        );
    }

    public static <T> Specification<T> isNotDeleted() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isFalse(root.get("isDeleted"))
        );
    }

    public static <T> Specification<T> isActive() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.isTrue(root.get("isActive"))
        );
    }

    public static <T> Specification<T> betweenDates(String dateField, LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> {
            // Convert LocalDate to LocalDateTime
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);

            System.out.println(startDateTime);
            System.out.println(endDateTime);

            Path<LocalDateTime> datePath = root.get(dateField);
            return criteriaBuilder.between(datePath, startDateTime, endDateTime);
        };
    }
}
