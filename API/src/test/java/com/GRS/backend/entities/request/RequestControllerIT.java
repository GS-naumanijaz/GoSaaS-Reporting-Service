package com.GRS.backend.entities.request;

import com.GRS.backend.TestUtils;
import com.GRS.backend.enums.RequestStatus;
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
class RequestControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RequestService requestService;

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

    // Test case for retrieving an empty page of requests
    @Test
    void testGetAllRequests_EmptyPage() throws Exception {
        when(requestService.getAllRequests(anyString(), anyString(), any(Pageable.class), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Page.empty());

        mockMvc.perform(get("/requests")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    // Test case for retrieving a non-empty page of requests
    @Test
    void testGetAllRequests_NonEmptyPage() throws Exception {
        Request request1 = new Request();
        request1.setReportName("Report 1");
        request1.setStatus(RequestStatus.successful);
        request1.setCreatedAt(LocalDateTime.now());

        Request request2 = new Request();
        request2.setReportName("Report 2");
        request2.setStatus(RequestStatus.inprogress);
        request2.setCreatedAt(LocalDateTime.now());

        List<Request> requests = List.of(request1, request2);
        Page<Request> requestPage = new PageImpl<>(requests);

        when(requestService.getAllRequests(anyString(), anyString(), any(Pageable.class), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(requestPage);

        mockMvc.perform(get("/requests")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].reportName").value("Report 1"))
                .andExpect(jsonPath("$.data.content[1].reportName").value("Report 2"));
    }

    // Test case for handling service exceptions
    @Test
    void testGetAllRequests_ServiceException() throws Exception {
        when(requestService.getAllRequests(anyString(), anyString(), any(Pageable.class), any(LocalDate.class), any(LocalDate.class)))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/requests", "GET", auth, null);
    }

    // Test case for unauthorized access
    @Test
    void testGetAllRequests_Unauthorized() throws Exception {
        mockMvc.perform(get("/requests"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

    // Test case for retrieving request status counts
    @Test
    void testGetStatusCounts_Success() throws Exception {
        Map<String, Integer> statusCounts = Map.of(
                "SUCCESS", 10,
                "PENDING", 5,
                "FAILED", 2
        );

        when(requestService.getStatusCounts()).thenReturn(statusCounts);

        mockMvc.perform(get("/requests/statusCounts")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.SUCCESS").value(10))
                .andExpect(jsonPath("$.data.PENDING").value(5))
                .andExpect(jsonPath("$.data.FAILED").value(2));
    }

    // Test case for handling service exceptions for status counts
    @Test
    void testGetStatusCounts_ServiceException() throws Exception {
        when(requestService.getStatusCounts()).thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/requests/statusCounts", "GET", auth, null);
    }

    // Test case for unauthorized access to status counts
    @Test
    void testGetStatusCounts_Unauthorized() throws Exception {
        mockMvc.perform(get("/requests/statusCounts"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }
}
