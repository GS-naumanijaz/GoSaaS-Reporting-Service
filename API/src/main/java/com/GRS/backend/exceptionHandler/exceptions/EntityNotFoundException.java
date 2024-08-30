package com.GRS.backend.exceptionHandler.exceptions;

public class EntityNotFoundException extends RuntimeException {

    // Constructor for exception with integer ID
    public EntityNotFoundException(String entityName, int id) {
        super(entityName + " with ID " + id + " not found");
    }

    // Constructor for exception with alias
    public EntityNotFoundException(String entityName, String alias) {
        super(entityName + " with alias " + alias + " not found");
    }

    // Constructor for generic not found message
    public EntityNotFoundException(String message) {
        super(message);
    }
}
