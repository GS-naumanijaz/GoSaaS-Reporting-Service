package com.GRS.backend.utilities;

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

public class OAuthUtil {
    public static String getEmail(OAuth2AuthenticationToken authentication) {
        return authentication.getPrincipal().getAttribute("email");
    }
}
