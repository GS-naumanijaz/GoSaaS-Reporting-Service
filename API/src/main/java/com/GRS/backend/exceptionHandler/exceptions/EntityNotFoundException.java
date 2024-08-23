package com.GRS.backend.exceptionHandler.exceptions;

public class EntityNotFoundException extends RuntimeException {
    public EntityNotFoundException(String entityName, int id) {
        super(entityName + " not found with id: " + id);
    }

    public EntityNotFoundException(String entityName, String alias) {
        super(entityName + " not found with alias: " + alias);
    }
}
