package com.GRS.backend.base_models;

import com.GRS.backend.exceptionHandler.exceptions.InvalidQueryParamException;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

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
            System.out.println(1);
            if (fieldType.equals(String.class)) {
                System.out.println(2);
                return criteriaBuilder.like(criteriaBuilder.lower((Expression<String>) path), searchTerm);
            } else if (Enum.class.isAssignableFrom(fieldType)) {
                System.out.println(3);
                String searchLower = search.toLowerCase();
                @SuppressWarnings("unchecked")
                Class<? extends Enum<?>> enumType = (Class<? extends Enum<?>>) fieldType;
                List<Enum<?>> matchingEnums = Arrays.stream(enumType.getEnumConstants())
                        .filter(enumConstant -> enumConstant.name().toLowerCase().contains(searchLower))
                        .collect(Collectors.toList());

                if (matchingEnums.isEmpty()) {
                    System.out.println(4);
                    return criteriaBuilder.disjunction(); // No match, return empty
                } else {
                    System.out.println(5);
                    return path.in(matchingEnums);
                }
            } else if (fieldType.equals(Boolean.class)) {
                System.out.println(6);
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
                System.out.println(7);
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

            Path<LocalDateTime> datePath = root.get(dateField);
            return criteriaBuilder.between(datePath, startDateTime, endDateTime);
        };
    }
}
