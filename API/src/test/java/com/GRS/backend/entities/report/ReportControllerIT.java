package com.GRS.backend.entities.report;

import com.GRS.backend.TestUtils;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.destination_connection.DestinationConnectionService;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.entities.source_connection.SourceConnectionService;
import com.GRS.backend.entities.user.User;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.ReportRequestBody;
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
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

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
class ReportControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportService reportService;

    @MockBean
    private ApplicationService applicationService;

    @MockBean
    private SourceConnectionService sourceConnectionService;

    @MockBean
    private DestinationConnectionService destinationConnectionService;

    @MockBean
    private UserService userService;

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
    // Tests for Get All Reports
    @Test
    void testGetAllReports_EmptyPage() throws Exception {
        when(reportService.getAllReports(anyInt(), any(), any(), any(Pageable.class)))
                .thenReturn(Page.empty());

        mockMvc.perform(get("/applications/1/reports")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    @Test
    void testGetAllReports_NonEmptyPage() throws Exception {
        Report report1 = new Report();
        report1.setAlias("Report 1");

        Report report2 = new Report();
        report2.setAlias("Report 2");

        List<Report> reports = List.of(report1, report2);
        Page<Report> reportPage = new PageImpl<>(reports);

        when(reportService.getAllReports(anyInt(), any(), any(), any(Pageable.class)))
                .thenReturn(reportPage);

        mockMvc.perform(get("/applications/1/reports")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].alias").value("Report 1"))
                .andExpect(jsonPath("$.data.content[1].alias").value("Report 2"));
    }

    @Test
    void testGetAllReports_ServiceException() throws Exception {
        when(reportService.getAllReports(anyInt(), any(), any(), any(Pageable.class)))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/reports", "GET", auth, null);
    }

    @Test
    void testGetAllReports_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/reports"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetAllReports_AppIdNotFound() throws Exception {
        when(reportService.getAllReports(anyInt(), any(), any(), any(Pageable.class)))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/reports")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Get Report by ID
    @Test
    void testGetReportById_Success() throws Exception {
        Report report = new Report();
        report.setId(1);
        report.setAlias("Test Report");

        when(reportService.getReportById(1)).thenReturn(report);

        mockMvc.perform(get("/applications/1/reports/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.alias").value("Test Report"));
    }

    @Test
    void testGetReportById_ReportIdNotFound() throws Exception {
        when(reportService.getReportById(1))
                .thenThrow(new EntityNotFoundException("Report not found with id: 1"));

        mockMvc.perform(get("/applications/1/reports/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Report not found with id: 1"));
    }

    @Test
    void testGetReportById_AppIdNotFound() throws Exception {
        when(reportService.getReportById(anyInt()))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/reports/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testGetReportById_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/reports/1"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetReportById_ServiceException() throws Exception {
        when(reportService.getReportById(1))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/reports/1", "GET", auth, null);
    }

    //---------------------------------------------------------------------
    // Tests for Add Report
    @Test
    void testAddReport_Success() throws Exception {
        Report report = new Report();
        report.setAlias("New Report");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.getSourceConnectionById(1)).thenReturn(new SourceConnection());
        when(destinationConnectionService.getDestinationConnectionById(1)).thenReturn(new DestinationConnection());
        when(reportService.addReport(any(Report.class), eq("testUser"))).thenReturn(report);

        mockMvc.perform(post("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.alias").value("New Report"));
    }

    @Test
    void testAddReport_ValidationError() throws Exception {
        ReportRequestBody requestBody = new ReportRequestBody(new Report(), 1, 1);  // Empty report object, should trigger validation error

        when(sourceConnectionService.getSourceConnectionById(1)).thenReturn(new SourceConnection());
        when(destinationConnectionService.getDestinationConnectionById(1)).thenReturn(new DestinationConnection());


        mockMvc.perform(post("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid Request Body"));
    }

    @Test
    void testAddReport_ServiceException() throws Exception {
        Report report = new Report();
        report.setAlias("New Report");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.addReport(any(Report.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/reports", "POST", auth, TestUtils.asJsonString(requestBody));
    }

    @Test
    void testAddReport_Unauthorized() throws Exception {
        Report report = new Report();
        report.setAlias("New Report");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        mockMvc.perform(post("/applications/1/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testAddReport_EmptyRequestBody() throws Exception {
        mockMvc.perform(post("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))  // Empty request body
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid Request Body"));
    }

    @Test
    void testAddReport_AppIdNotFound() throws Exception {
        Report report = new Report();
        report.setAlias("New Report");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(post("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Update Report
    @Test
    void testUpdateReport_Success() throws Exception {
        Report report = new Report();
        report.setAlias("Updated Report");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        report.setDestinationConnection(new DestinationConnection(1));
        report.setSourceConnection(new SourceConnection(1));

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.updateReport(eq(1), any(Report.class), eq("testUser")))
                .thenReturn(report);


        mockMvc.perform(patch("/applications/1/reports/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.alias").value("Updated Report"));
    }

    @Test
    void testUpdateReport_ValidationError() throws Exception {
        ReportRequestBody requestBody = new ReportRequestBody(new Report(), 1, 1);  // Empty report object, should trigger validation error

        mockMvc.perform(patch("/applications/1/reports/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid Request Body"));
    }

    @Test
    void testUpdateReport_ServiceException() throws Exception {
        Report report = new Report();
        report.setAlias("Updated Report");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.updateReport(eq(1), any(Report.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/reports/1", "PATCH", auth, TestUtils.asJsonString(requestBody));
    }

    @Test
    void testUpdateReport_Unauthorized() throws Exception {
        Report report = new Report();
        report.setAlias("Updated Report");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        mockMvc.perform(patch("/applications/1/reports/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testUpdateReport_EmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/applications/1/reports/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))  // Empty request body
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid Request Body"));
    }

    @Test
    void testUpdateReport_AppIdNotFound() throws Exception {
        Report report = new Report();
        report.setAlias("Updated Report");

        ReportRequestBody requestBody = new ReportRequestBody(report, 1, 1);

        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(patch("/applications/1/reports/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(TestUtils.asJsonString(requestBody)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Delete Report
    @Test
    void testDeleteReport_Success() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        Report report = new Report();
        report.setId(1);
        report.setAlias("Test Report");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.deleteReport(1, "testUser")).thenReturn(report);

        mockMvc.perform(delete("/applications/1/reports/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Report deleted successfully"));
    }

    @Test
    void testDeleteReport_ReportIdNotFound() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.deleteReport(1, "testUser"))
                .thenThrow(new EntityNotFoundException("Report not found with id: 1"));

        mockMvc.perform(delete("/applications/1/reports/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Report not found with id: 1"));
    }

    @Test
    void testDeleteReport_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(delete("/applications/1/reports/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testDeleteReport_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.deleteReport(1, "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/reports/1", "DELETE", auth, null);
    }

    @Test
    void testDeleteReport_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications/1/reports/1"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

    //---------------------------------------------------------------------
    // Tests for Bulk Delete Reports
    @Test
    void testBulkDeleteReports_AllDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.bulkDeleteReports(List.of(1, 2), "testUser"))
                .thenReturn(List.of("Report1", "Report2"));

        mockMvc.perform(delete("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("All Reports deleted successfully"));
    }

    @Test
    void testBulkDeleteReports_SomeDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.bulkDeleteReports(List.of(1, 2), "testUser"))
                .thenReturn(List.of("Report1"));  // Only one report deleted

        mockMvc.perform(delete("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isMultiStatus())
                .andExpect(jsonPath("$.message").value("Some Reports could not be deleted"));
    }

    @Test
    void testBulkDeleteReports_NoneDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.bulkDeleteReports(List.of(1, 2), "testUser"))
                .thenReturn(Collections.emptyList());  // No reports deleted

        mockMvc.perform(delete("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("None of the Reports could not be deleted"));
    }

    @Test
    void testBulkDeleteReports_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(delete("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testBulkDeleteReports_InvalidDataType() throws Exception {
        mockMvc.perform(delete("/applications/1/reports")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"invalid\", 2]"))  // Sending a string instead of an integer
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkDeleteReports_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications/1/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

    @Test
    void testBulkDeleteReports_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(reportService.bulkDeleteReports(List.of(1, 2), "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/reports", "DELETE", auth, "[1, 2]");
    }

    //---------------------------------------------------------------------

}
