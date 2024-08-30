package com.GRS.backend.exceptionHandler.exceptions;

public class InvalidQueryParamException extends RuntimeException {

    // Constructor for exception with value and key
    public InvalidQueryParamException(String value, String key) {
        super("There is no field with value '" + value + "' for the key '" + key + "'.");
    }

    // Constructor for exception with only key
    public InvalidQueryParamException(String key) {
        super("Invalid query parameter key: '" + key + "'.");
    }
}
