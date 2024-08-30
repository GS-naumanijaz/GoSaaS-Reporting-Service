package com.GRS.backend.security;

import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.utilities.AuditLogGenerator;
import com.GRS.backend.utilities.OAuthUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {



    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        if (authentication != null) {
            String email = null;

            // Check if authentication principal is an instance of OAuth2User
            if (authentication.getPrincipal() instanceof OAuth2User) {
                OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                email = oAuth2User.getAttribute("email"); // Assuming "email" is the attribute name for the email
            }

            if (email != null) {
                // Extract the part of the email before the @ symbol
                String usernamePart = email.split("@")[0];

                // Log the username part
                AuditLogGenerator.getInstance().log(AuditLogAction.LOGOUT, usernamePart);
            } else {
                // Handle the case where the email is not available
                System.err.println("Email not found in OAuth2User attributes.");
            }
        }

        // Redirect to the root URL after logout
        response.sendRedirect("/");
    }
}