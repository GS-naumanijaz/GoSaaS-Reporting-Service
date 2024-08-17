package com.GRS.backend.base_models;

import com.GRS.backend.exceptionHandler.exceptions.InvalidQueryParamException;
import org.springframework.data.jpa.domain.Specification;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public abstract class BaseSpecification<T> {

    public static <T> Specification<T> containsTextIn(String searchBy, String search) {
        return (root, query, criteriaBuilder) -> {
            if (!doesFieldExist(root.getJavaType(), searchBy)) {
                throw new InvalidQueryParamException(searchBy, "search_by");
            }
            String searchTerm = "%" + search.toLowerCase() + "%";

            try {
                Field field = root.getJavaType().getDeclaredField(searchBy);
                if (field.getType().isEnum()) {
                    String searchLower = search.toLowerCase();
                    List<Enum> matchingEnums = Arrays.stream((Enum[]) field.getType().getEnumConstants())
                            .filter(enumConstant -> enumConstant.name().toLowerCase().contains(searchLower))
                            .collect(Collectors.toList());

                    if (matchingEnums.isEmpty()) {
                        return criteriaBuilder.disjunction(); // No match, return empty
                    } else {
                        return root.get(searchBy).in(matchingEnums);
                    }

                } else if (field.getType().equals(String.class)) {
                    return criteriaBuilder.like(criteriaBuilder.lower(root.get(searchBy)), searchTerm);
                } else if (field.getType().equals(Boolean.class)) {
                    System.out.println("Handling as Boolean Type");
                    boolean booleanValue;
                    if ("active".equalsIgnoreCase(search)) {
                        booleanValue = true;
                    } else if ("inactive".equalsIgnoreCase(search)) {
                        booleanValue = false;
                    } else {
                        throw new InvalidQueryParamException(search, "boolean");
                    }
                    return criteriaBuilder.equal(root.get(searchBy), booleanValue);
                } else {
                    return criteriaBuilder.like(criteriaBuilder.lower(root.get(searchBy).as(String.class)), searchTerm);
                }

            } catch (NoSuchFieldException e) {
                System.out.println("No such field found: " + searchBy);
                throw new InvalidQueryParamException(searchBy, "search_by");
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

    private static boolean doesFieldExist(Class<?> entityClass, String fieldName) {
        for (Field field : entityClass.getDeclaredFields()) {
            if (field.getName().equals(fieldName)) {
                return true;
            }
        }
        return false;
    }
}
