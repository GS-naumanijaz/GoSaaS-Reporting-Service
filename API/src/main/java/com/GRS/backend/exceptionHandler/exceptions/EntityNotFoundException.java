package com.GRS.backend.exceptionHandler.exceptions;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String entityName, int id) {
        super(entityName +  " not found with id: " + id);
    }
}
