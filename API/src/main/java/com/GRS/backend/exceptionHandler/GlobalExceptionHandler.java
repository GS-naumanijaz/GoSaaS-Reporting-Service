package com.GRS.backend.exceptionHandler;

import com.GRS.backend.exceptionHandler.exceptions.EntityIsInactiveException;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.exceptionHandler.exceptions.InvalidQueryParamException;
import com.GRS.backend.response.Response;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.util.List;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Pattern UNIQUE_CONSTRAINT_PATTERN = Pattern.compile("constraint \\[(.*?)\\]");

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        // Log exception and return appropriate response
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<String> errors = ex.getBindingResult()
                        .getFieldErrors()
                                .stream()
                                        .map(x -> x.getDefaultMessage())
                                                .collect(Collectors.toList());

        return Response.responseBuilder("ERROR: Invalid Method Arguments", status, errors);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleEntityNotFoundException(EntityNotFoundException ex) {
        return Response.responseBuilder(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidQueryParamException.class)
    public ResponseEntity<Object> handleInvalidQueryParamException(InvalidQueryParamException ex) {
        return Response.responseBuilder(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityIsInactiveException.class)
    public ResponseEntity<Object> handleEntityIsInactiveException(EntityIsInactiveException ex) {
        return Response.responseBuilder(ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, WebRequest request) {

        String rootMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();

        String fieldName = extractFieldName(rootMessage);
        String keyValue = extractKeyValue(rootMessage);

        String message;
        if (fieldName != null && keyValue != null) {
            message = "The selected " + fieldName + " is currently in use. Please choose an alternative " + fieldName + " to proceed.";
        } else {
            message = "A data integrity violation occurred.";
        }

        return Response.responseBuilder(message, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SdkClientException.class)
    public ResponseEntity<Object> handleSdkClientException(SdkClientException ex) {
        // Log the exception details
        System.err.println("AWS SDK Client Exception: " + ex.getMessage());

        // Return a response with a custom error message and appropriate HTTP status
        return Response.responseBuilder("Sorry, there was an issue processing your request. Please check your input for accuracy, or try again later if the problem persists. AWS servers may be temporarily unavailable.", HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentExcepton(IllegalArgumentException e) {
        System.err.println("Illegal Argument Exception " + e.getMessage());

        return Response.responseBuilder(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PropertyReferenceException.class)
    public ResponseEntity<Object> handlePropertyReferenceException(PropertyReferenceException e) {
        return Response.responseBuilder(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    private String extractFieldName(String message) {
        // Pattern to match the field name after "Key (field_name1, field_name2, ...)="
        String patternString = "Key \\((.*?)\\)=";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            String fieldNames = matcher.group(1); // Get the full list of field names
            String[] fieldNamesArray = fieldNames.split(","); // Split by comma
            return fieldNamesArray[fieldNamesArray.length - 1].trim(); // Return the last field name, trimmed of any whitespace
        }

        return null;
    }

    private String extractKeyValue(String message) {
        // Pattern to match the key value after "Detail: Key (field_name)=(value1, value2, ...)"
        String patternString = "Detail: Key \\(.*?\\)=\\((.*?)\\)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            String keyValues = matcher.group(1); // Get the full list of key values
            String[] keyValuesArray = keyValues.split(","); // Split by comma
            return keyValuesArray[keyValuesArray.length - 1].trim(); // Return the last key value, trimmed of any whitespace
        }

        return null;
    }





}

