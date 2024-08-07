package com.GRS.backend.oauth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User extends DefaultOAuth2User {

    public CustomOAuth2User(OAuth2User delegate, Collection<? extends GrantedAuthority> authorities) {
        super(authorities, delegate.getAttributes(), "name");
    }

    @Override
    public Map<String, Object> getAttributes() {
        return super.getAttributes();
    }
}
