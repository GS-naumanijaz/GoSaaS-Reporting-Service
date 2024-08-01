package com.GRS.backend.security;

import com.GRS.backend.user.User;
import com.GRS.backend.user.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

     @Value("${frontend.url}")
     private String frontendUrl;

    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // Get user from authentication and save to database
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        OidcUser oidcUser = (OidcUser) oauth2User;
        User user = new User(oidcUser.getFullName(), oidcUser.getEmail());
        userService.saveOrUpdateUser(user);

        // redirect after user is saved
        this.setAlwaysUseDefaultTargetUrl(true);
        this.setDefaultTargetUrl(frontendUrl+"/homepage");
        super.onAuthenticationSuccess(request, response, authentication);
    }
}
