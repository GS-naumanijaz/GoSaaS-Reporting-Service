package com.GRS.backend;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.SerializationFeature;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class TestUtils {

    public static String serviceExceptionMessage = "We're sorry, but something went wrong on our server. Our team has been notified, and we're working to resolve the issue. Please try again in a few minutes.";

    private static final ObjectMapper objectMapper = new ObjectMapper();

    static {
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }

    public static String asJsonString(final Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert object to JSON string", e);
        }
    }

    // Utility method to test service exceptions
    public static void testServiceException(MockMvc mockMvc, String url, String httpMethod, OAuth2AuthenticationToken auth, String requestBody) throws Exception {
        MockHttpServletRequestBuilder requestBuilder;

        // Choose the appropriate request builder based on the HTTP method
        switch (httpMethod) {
            case "GET":
                requestBuilder = MockMvcRequestBuilders.get(url);
                break;
            case "POST":
                requestBuilder = MockMvcRequestBuilders.post(url);
                break;
            case "PATCH":
                requestBuilder = MockMvcRequestBuilders.patch(url);
                break;
            case "DELETE":
                requestBuilder = MockMvcRequestBuilders.delete(url);
                break;
            default:
                throw new IllegalArgumentException("Unsupported HTTP method: " + httpMethod);
        }

        // Add request body if it's not null
        if (requestBody != null) {
            requestBuilder.content(requestBody).contentType(MediaType.APPLICATION_JSON);
        }

        // Perform the request with authentication and check for internal server error
        ResultActions resultActions = mockMvc.perform(requestBuilder.with(authentication(auth)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value(serviceExceptionMessage));
    }
}

