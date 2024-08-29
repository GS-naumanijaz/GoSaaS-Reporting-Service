package com.GRS.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

public class OAuth2LoginFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        // Set response status
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        // Write response message
//        response.getWriter().write("Authentication failed: " + exception.getMessage());
        getRedirectStrategy().sendRedirect(request, response, "https://www.google.com");

        // Optionally, you can redirect to a specific URL or handle the failure in other ways
         super.onAuthenticationFailure(request, response, exception);
    }
}
