package com.GRS.backend.oauth;

import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.utilities.AuditLogGenerator;
import com.GRS.backend.utilities.OAuthUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class oauthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

    }

    @Test
    void testCheckAuth_Authenticated() throws Exception {
        OAuth2User oauth2User = new DefaultOAuth2User(
                List.of(() -> "ROLE_USER"),
                Map.of("email", "user@example.com"),
                "email"
        );
        Authentication auth = new OAuth2AuthenticationToken(oauth2User, oauth2User.getAuthorities(), "registrationId");

        mockMvc.perform(get("/checkAuth")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authenticated").value(true));
    }

    @Test
    void testCheckAuth_NotAuthenticated() throws Exception {
        mockMvc.perform(get("/checkAuth")
                        .with(anonymous()))
                .andExpect(status().is3xxRedirection());
    }

    @Test
    void testLogout_Success() throws Exception {
        OAuth2User oauth2User = new DefaultOAuth2User(
                List.of(() -> "ROLE_USER"),
                Map.of("email", "user@example.com"),
                "email"
        );
        OAuth2AuthenticationToken auth = new OAuth2AuthenticationToken(oauth2User, oauth2User.getAuthorities(), "registrationId");

        when(userService.getUserNameByEmail(anyString())).thenReturn("testUser");

        mockMvc.perform(post("/logout")
                        .with(authentication(auth)))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/"));
    }

    @Test
    void testLogout_Unauthenticated() throws Exception {
        mockMvc.perform(post("/logout")
                        .with(anonymous()))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/"));
    }

    @Test
    void testGetCurrentUser_Success() throws Exception {
        OAuth2User oauth2User = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of("email", "user@example.com"),
                "email"
        );

        OAuth2AuthenticationToken auth = new OAuth2AuthenticationToken(
                oauth2User,
                oauth2User.getAuthorities(),
                "registrationId"
        );

        mockMvc.perform(get("/currentUser")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.attributes.email").value("user@example.com"));
    }

    @Test
    void testGetCurrentUser_NotAuthenticated() throws Exception {
        mockMvc.perform(get("/currentUser")
                        .with(anonymous()))
                .andExpect(status().is3xxRedirection())
                .andExpect(content().string("")); // Expecting an empty response as there is no authenticated user
    }
}
