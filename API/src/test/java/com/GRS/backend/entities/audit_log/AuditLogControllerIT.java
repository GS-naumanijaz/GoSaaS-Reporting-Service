package com.GRS.backend.entities.audit_log;

import com.GRS.backend.TestUtils;
import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import com.GRS.backend.resolver.QueryArgumentResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuditLogControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuditLogService auditLogService;

    private OAuth2AuthenticationToken auth;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        OAuth2User oAuth2User = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of("email", "testUser@example.com"),
                "email"
        );

        auth = new OAuth2AuthenticationToken(oAuth2User, oAuth2User.getAuthorities(), "registrationId");
    }

    // Test case for retrieving an empty page of audit logs
    @Test
    void testGetAllAuditLogs_EmptyPage() throws Exception {
        when(auditLogService.getAllAuditLogs(anyString(), anyString(), any(Pageable.class), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Page.empty());

        mockMvc.perform(get("/auditLog")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    // Test case for retrieving a non-empty page of audit logs
    @Test
    void testGetAllAuditLogs_NonEmptyPage() throws Exception {
        AuditLog log1 = new AuditLog(AuditLogModule.APPLICATION, AuditLogAction.CREATED, "Created Application", "testUser");
        log1.setCreatedAt(LocalDateTime.now());

        AuditLog log2 = new AuditLog(AuditLogModule.DESTINATION, AuditLogAction.MODIFIED, "Modified Destination", "testUser");
        log2.setCreatedAt(LocalDateTime.now());

        List<AuditLog> logs = List.of(log1, log2);
        Page<AuditLog> auditLogPage = new PageImpl<>(logs);

        when(auditLogService.getAllAuditLogs(anyString(), anyString(), any(Pageable.class), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(auditLogPage);

        mockMvc.perform(get("/auditLog")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].details").value("Created Application"))
                .andExpect(jsonPath("$.data.content[1].details").value("Modified Destination"));
    }

    // Test case for handling service exceptions
    @Test
    void testGetAllAuditLogs_ServiceException() throws Exception {
        when(auditLogService.getAllAuditLogs(anyString(), anyString(), any(Pageable.class), any(LocalDate.class), any(LocalDate.class)))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/auditLog", "GET", auth, null);
    }

    // Test case for unauthorized access
    @Test
    void testGetAllAuditLogs_Unauthorized() throws Exception {
        mockMvc.perform(get("/auditLog"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

}
