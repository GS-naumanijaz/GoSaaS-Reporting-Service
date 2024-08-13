package com.GRS.backend.response;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class Response {
    public static ResponseEntity<Object> responseBuilder(
            String message, HttpStatus httpStatus, Object responseObject
    )
    {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("httpStatus", httpStatus);
        response.put("timestamp", LocalDateTime.now());
        response.put("data", responseObject);

        return new ResponseEntity<>(response, httpStatus);
    }

    public static ResponseEntity<Object> responseBuilder(
            String message, HttpStatusCode httpStatus, Object responseObject
    )
    {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("httpStatus", httpStatus);
        response.put("timestamp", LocalDateTime.now());
        response.put("data", responseObject);

        return new ResponseEntity<>(response, httpStatus);
    }

    public static ResponseEntity<Object> responseBuilder(
            String message, HttpStatus httpStatus
    )
    {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("httpStatus", httpStatus);
        response.put("timestamp", LocalDateTime.now());

        return new ResponseEntity<>(response, httpStatus);
    }


}
