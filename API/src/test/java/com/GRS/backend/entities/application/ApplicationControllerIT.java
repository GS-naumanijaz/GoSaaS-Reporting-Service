package com.GRS.backend.entities.application;

import com.GRS.backend.TestUtils;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.report.ReportService;
import com.GRS.backend.entities.user.User;
import com.GRS.backend.entities.user.UserRepository;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApplicationControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private ReportService reportService;

    private OAuth2AuthenticationToken auth;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        User mockUser = new User("testUser", "testUser@example.com");

        when(userService.findUserByEmail("testUser@example.com")).thenReturn(mockUser);
        when(userService.getUserNameByEmail("testUser@example.com")).thenReturn("testUser");

        OAuth2User oAuth2User = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_USER")),
                Map.of("email", "testUser@example.com"),
                "email"
        );

        auth = new OAuth2AuthenticationToken(oAuth2User, oAuth2User.getAuthorities(), "registrationId");
    }

    //---------------------------------------------------------------------
    @Test
    void testGetAllApplications_EmptyPage() throws Exception {
        when(applicationService.getAllApplications("", "alias", Pageable.unpaged(), "all", null, null))
                .thenReturn(Page.empty());

        mockMvc.perform(get("/applications")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void testGetAllApplications_NonEmptyPage() throws Exception {
        Application application1 = new Application();
        application1.setAlias("Application 1");

        Application application2 = new Application();
        application2.setAlias("Application 2");

        List<Application> applications = List.of(application1, application2);
        Page<Application> applicationPage = new PageImpl<>(applications);

        when(applicationService.getAllApplications(any(String.class), any(String.class), any(Pageable.class), any(String.class), any(), any()))
                .thenReturn(applicationPage);

        mockMvc.perform(get("/applications")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].alias").value("Application 1"))
                .andExpect(jsonPath("$.data.content[1].alias").value("Application 2"));
    }

    @Test
    void testGetAllApplications_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(applicationService.getAllApplications(any(), any(), any(), any(), any(), any()))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications", "GET", auth, null);  // GET request, no body
    }

    @Test
    void testGetAllApplications_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications"))
                .andExpect(status().isFound());
    }



    //---------------------------------------------------------------------
    @Test
    void testGetApplicationById_Success() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test App");

        when(applicationService.getApplicationById(1)).thenReturn(application);

        mockMvc.perform(get("/applications/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.alias").value("Test App"));
    }

    @Test
    void testGetApplicationById_NotFound() throws Exception {
        when(applicationService.getApplicationById(1)).thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testGetApplicationById_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(applicationService.getApplicationById(1))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications/1", "GET", auth, null);  // GET request, no body
    }

    @Test
    void testGetApplicationById_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1"))
                .andExpect(status().isFound());
    }



    //---------------------------------------------------------------------
    @Test
    void testAddApplication_Success() throws Exception {
        Application application = new Application();
        application.setAlias("New Application");

        when(applicationService.addApplication(any(Application.class), eq("testUser")))
                .thenReturn(application);

        mockMvc.perform(post("/applications")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Application\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.alias").value("New Application"));
    }

    @Test
    void testAddApplication_ValidationError() throws Exception {
        mockMvc.perform(post("/applications")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"\"}"))  // Empty alias, assuming it's invalid
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testAddApplication_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(applicationService.addApplication(any(Application.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications", "POST", auth, "{\"alias\":\"New Application\"}");
    }

    @Test
    void testAddApplication_Unauthorized() throws Exception {
        mockMvc.perform(post("/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Application\"}"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testAddApplication_EmptyRequestBody() throws Exception {
        mockMvc.perform(post("/applications")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))  // Empty request body
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }


    //---------------------------------------------------------------------
    @Test
    void testBulkUpdateApplications_AllUpdated() throws Exception {
        Application application1 = new Application();
        application1.setAlias("Updated Application 1");

        Application application2 = new Application();
        application2.setAlias("Updated Application 2");

        List<Application> updatedApplications = List.of(application1, application2);

        when(applicationService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedApplications);

        mockMvc.perform(patch("/applications")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].alias").value("Updated Application 1"))
                .andExpect(jsonPath("$.data[1].alias").value("Updated Application 2"));
    }

    @Test
    void testBulkUpdateApplications_SomeUpdated() throws Exception {
        Application application1 = new Application();
        application1.setAlias("Updated Application 1");

        List<Application> updatedApplications = List.of(application1);  // Only one application updated

        when(applicationService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedApplications);

        mockMvc.perform(patch("/applications")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isMultiStatus())
                .andExpect(jsonPath("$.data[0].alias").value("Updated Application 1"));
    }

    @Test
    void testBulkUpdateApplications_NoneUpdated() throws Exception {
        List<Application> updatedApplications = Collections.emptyList();  // No applications updated

        when(applicationService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedApplications);

        mockMvc.perform(patch("/applications")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkUpdateApplications_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(applicationService.bulkUpdateIsActive(anyList(), anyBoolean(), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        // Correctly structured request body
        String requestBody = "[1, 2]";

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications?isActive=true", "PATCH", auth, requestBody);
    }

    @Test
    void testBulkUpdateApplications_Unauthorized() throws Exception {
        mockMvc.perform(patch("/applications")
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testBulkUpdateApplications_EmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/applications")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))  // Empty request body
                .andExpect(status().isBadRequest());
    }



    //---------------------------------------------------------------------

    @Test
    void testUpdateApplication_Success() throws Exception {
        Application application = new Application();
        application.setAlias("Updated Application");

        when(applicationService.updateApplication(eq(1), any(Application.class), eq("testUser")))
                .thenReturn(application);

        mockMvc.perform(patch("/applications/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Application\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.alias").value("Updated Application"));
    }

    @Test
    void testUpdateApplication_NotFound() throws Exception {
        when(applicationService.updateApplication(eq(1), any(Application.class), eq("testUser")))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(patch("/applications/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Application\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testUpdateApplication_ValidationError() throws Exception {
        mockMvc.perform(patch("/applications/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"\"}"))  // Empty alias, assuming it's invalid
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testUpdateApplication_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(applicationService.updateApplication(eq(1), any(Application.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications/1", "PATCH", auth, "{\"alias\":\"Updated Application\"}");
    }

    @Test
    void testUpdateApplication_Unauthorized() throws Exception {
        mockMvc.perform(patch("/applications/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Application\"}"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testUpdateApplication_EmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/applications/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))  // Empty request body
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }


    //---------------------------------------------------------------------
    @Test
    void testDeleteApplication_Success() throws Exception {
        Application application = new Application();
        application.setAlias("Deleted Application");

        when(applicationService.deleteApplication(1, "testUser"))
                .thenReturn(application);

        mockMvc.perform(delete("/applications/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteApplication_NotFound() throws Exception {
        when(applicationService.deleteApplication(1, "testUser"))
                .thenThrow(new EntityNotFoundException("Application not found"));

        mockMvc.perform(delete("/applications/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found"));
    }

    @Test
    void testDeleteApplication_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(applicationService.deleteApplication(1, "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications/1", "DELETE", auth, null);
    }

    @Test
    void testDeleteApplication_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications/1"))
                .andExpect(status().isFound());  // 302 Found
    }


    //---------------------------------------------------------------------
    @Test
    void testGetAllPinnedReports_Success() throws Exception {
        Report report1 = new Report();
        report1.setAlias("Pinned Report 1");

        Report report2 = new Report();
        report2.setAlias("Pinned Report 2");

        List<Report> reports = List.of(report1, report2);

        when(reportService.getAllPinnedReports()).thenReturn(reports);

        mockMvc.perform(get("/applications/pinnedReports")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].alias").value("Pinned Report 1"))
                .andExpect(jsonPath("$.data[1].alias").value("Pinned Report 2"));
    }

    @Test
    void testGetAllPinnedReports_NoReports() throws Exception {
        when(reportService.getAllPinnedReports()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/applications/pinnedReports")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void testGetAllPinnedReports_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(reportService.getAllPinnedReports())
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications/pinnedReports", "GET", auth, null);
    }

    @Test
    void testGetAllPinnedReports_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/pinnedReports"))
                .andExpect(status().isFound());  // 302 Found
    }


    //---------------------------------------------------------------------
    @Test
    void testBulkDeleteApplications_Success() throws Exception {
        List<String> deletedApps = List.of("App1", "App2");

        when(applicationService.bulkDeleteApplications(List.of(1, 2), "testUser"))
                .thenReturn(deletedApps);

        mockMvc.perform(delete("/applications")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isOk());
    }


    @Test
    void testBulkDeleteApplications_SomeNotFound() throws Exception {
        when(applicationService.bulkDeleteApplications(List.of(1, 2), "testUser"))
                .thenReturn(List.of("App1"));  // Only one application was deleted

        mockMvc.perform(delete("/applications")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isMultiStatus());
    }

    @Test
    void testBulkDeleteApplications_NoneDeleted() throws Exception {
        // Simulate the service returning an empty list, indicating no applications were deleted
        when(applicationService.bulkDeleteApplications(List.of(1, 2), "testUser"))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(delete("/applications")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkDeleteApplications_ServiceException() throws Exception {
        // Setup the mock to throw an exception
        when(applicationService.bulkDeleteApplications(List.of(1, 2), "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications", "DELETE", auth, "[1, 2]");
    }

    @Test
    void testBulkDeleteApplications_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testBulkDeleteApplications_InvalidDataType() throws Exception {
        mockMvc.perform(delete("/applications")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"invalid\", 2]"))  // Sending a string instead of an integer
                .andExpect(status().isBadRequest());
    }


}
