package com.GRS.backend.exceptionHandler.exceptions;

public class EntityIsInactiveException extends RuntimeException {

    // Constructor for exception with integer ID
    public EntityIsInactiveException(String entityName, int id) {
        super(entityName + " with ID " + id + " is inactive");
    }

    // Constructor for exception with alias
    public EntityIsInactiveException(String entityName, String alias) {
        super(entityName + " with alias " + alias + " is inactive");
    }
}
