package com.GRS.backend.exceptionHandler;

import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.exceptionHandler.exceptions.InvalidQueryParamException;
import com.GRS.backend.response.Response;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

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

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, WebRequest request) {

        String rootMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        System.out.println("DataIntegrityViolationException message: " + rootMessage);

        String fieldName = extractFieldName(rootMessage);
        String keyValue = extractKeyValue(rootMessage);

        String message;
        if (fieldName != null && keyValue != null) {
            message = "Field '" + fieldName + "' with value '" + keyValue + "' must be unique. An entity with this value already exists.";
        } else {
            message = "A data integrity violation occurred.";
        }


        return Response.responseBuilder(message, HttpStatus.BAD_REQUEST);
    }

    private String extractFieldName(String message) {
        // Pattern to match the field name after "Key (field_name)="
        String patternString = "Key \\((.*?)\\)=";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group(1); // Return the field name part
        }

        return null;
    }

    private String extractKeyValue(String message) {
        // Pattern to match the key value after "Detail: Key (field_name)=(value)"
        String patternString = "Detail: Key \\((.*?)\\)=\\((.*?)\\)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(message);

        if (matcher.find()) {
            return matcher.group(2); // Return the value part
        }

        return null;
    }




}

