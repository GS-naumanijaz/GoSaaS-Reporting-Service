package com.GRS.backend.exceptionHandler.exceptions;

public class EntityIsInactiveException extends RuntimeException {
    public EntityIsInactiveException(String entityName, int id) {
        super(entityName + " is inactive with id: " + id);
    }

    public EntityIsInactiveException(String entityName, String alias) {
        super(entityName + " is inactive with alias: " + alias);
    }
}
