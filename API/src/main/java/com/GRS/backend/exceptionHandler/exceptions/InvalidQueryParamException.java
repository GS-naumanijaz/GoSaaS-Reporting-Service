package com.GRS.backend.exceptionHandler.exceptions;

public class InvalidQueryParamException extends RuntimeException {
    public InvalidQueryParamException(String value, String key) {
        super("There is no field of value '" + value + "' for the key '" + key + "'.");
    }

    public InvalidQueryParamException(String key) {
        super(key);
    }
}
