package com.GRS.backend.entities.source_connection;

import com.GRS.backend.TestUtils;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.user.User;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.SourceConnectionDTO;
import com.GRS.backend.models.StoredProcedure;
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
class SourceConnectionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SourceConnectionService sourceConnectionService;

    @MockBean
    private ApplicationService applicationService;

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
    // Tests for Get All Source Connections with Pagination
    @Test
    void testGetAllSourceConnections_EmptyPage() throws Exception {
        when(sourceConnectionService.getAllSourceConnections(anyInt(), any(), any(), any(Pageable.class)))
                .thenReturn(Page.empty());

        mockMvc.perform(get("/applications/1/sourceConnections")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    @Test
    void testGetAllSourceConnections_NonEmptyPage() throws Exception {
        SourceConnection connection1 = new SourceConnection();
        connection1.setAlias("Source 1");

        SourceConnection connection2 = new SourceConnection();
        connection2.setAlias("Source 2");

        List<SourceConnection> connections = List.of(connection1, connection2);
        Page<SourceConnection> connectionPage = new PageImpl<>(connections);

        when(sourceConnectionService.getAllSourceConnections(anyInt(), any(), any(), any(Pageable.class)))
                .thenReturn(connectionPage);

        mockMvc.perform(get("/applications/1/sourceConnections")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].alias").value("Source 1"))
                .andExpect(jsonPath("$.data.content[1].alias").value("Source 2"));
    }

    @Test
    void testGetAllSourceConnections_ServiceException() throws Exception {
        when(sourceConnectionService.getAllSourceConnections(anyInt(), any(), any(), any(Pageable.class)))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections", "GET", auth, null);
    }

    @Test
    void testGetAllSourceConnections_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/sourceConnections"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetAllSourceConnections_AppIdNotFound() throws Exception {
        when(sourceConnectionService.getAllSourceConnections(anyInt(), any(), any(), any(Pageable.class)))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Get All Source Connections (no pagination)
    @Test
    void testGetAllSourceConnectionsAll_Success() throws Exception {
        SourceConnectionDTO dto1 = new SourceConnectionDTO(1, "Source 1");
        SourceConnectionDTO dto2 = new SourceConnectionDTO(2, "Source 2");

        List<SourceConnectionDTO> dtos = List.of(dto1, dto2);

        when(sourceConnectionService.getAllSourceConnections(anyInt())).thenReturn(dtos);

        mockMvc.perform(get("/applications/1/sourceConnections/all")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].alias").value("Source 1"))
                .andExpect(jsonPath("$.data[1].alias").value("Source 2"));
    }

    @Test
    void testGetAllSourceConnectionsAll_EmptyList() throws Exception {
        when(sourceConnectionService.getAllSourceConnections(anyInt())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/applications/1/sourceConnections/all")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void testGetAllSourceConnectionsAll_ServiceException() throws Exception {
        when(sourceConnectionService.getAllSourceConnections(anyInt()))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections/all", "GET", auth, null);
    }

    @Test
    void testGetAllSourceConnectionsAll_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/sourceConnections/all"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetAllSourceConnectionsAll_AppIdNotFound() throws Exception {
        when(sourceConnectionService.getAllSourceConnections(anyInt()))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections/all")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Get Source Connection By ID
    @Test
    void testGetSourceConnectionById_Success() throws Exception {
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setId(1);
        sourceConnection.setAlias("Test Connection");

        when(sourceConnectionService.getSourceConnectionById(1)).thenReturn(sourceConnection);

        mockMvc.perform(get("/applications/1/sourceConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.alias").value("Test Connection"));
    }

    @Test
    void testGetSourceConnectionById_SourceIdNotFound() throws Exception {
        when(sourceConnectionService.getSourceConnectionById(1))
                .thenThrow(new EntityNotFoundException("Source Connection not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Source Connection not found with id: 1"));
    }

    @Test
    void testGetSourceConnectionById_AppIdNotFound() throws Exception {
        when(sourceConnectionService.getSourceConnectionById(anyInt()))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testGetSourceConnectionById_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/sourceConnections/1"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetSourceConnectionById_ServiceException() throws Exception {
        when(sourceConnectionService.getSourceConnectionById(1))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections/1", "GET", auth, null);
    }

    //---------------------------------------------------------------------
    // Tests for Test Source Connection
    @Test
    void testTestSourceConnection_Success() throws Exception {
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setId(1);
        sourceConnection.setAlias("Test Connection");

        when(sourceConnectionService.getSourceConnectionById(1)).thenReturn(sourceConnection);
        when(sourceConnectionService.testSourceConnection(sourceConnection, "testUser")).thenReturn(true);

        mockMvc.perform(get("/applications/1/sourceConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Source Connection was tested successfully"));
    }

    @Test
    void testTestSourceConnection_SourceIdNotFound() throws Exception {
        when(sourceConnectionService.getSourceConnectionById(1))
                .thenThrow(new EntityNotFoundException("Source Connection not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Source Connection not found with id: 1"));
    }

    @Test
    void testTestSourceConnection_TestFails() throws Exception {
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setId(1);
        sourceConnection.setAlias("Test Connection");

        when(sourceConnectionService.getSourceConnectionById(1)).thenReturn(sourceConnection);
        when(sourceConnectionService.testSourceConnection(sourceConnection, "testUser")).thenReturn(false);

        mockMvc.perform(get("/applications/1/sourceConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Source Connection failed test"));
    }

    @Test
    void testTestSourceConnection_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/sourceConnections/1/test"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testTestSourceConnection_ServiceException() throws Exception {
        when(sourceConnectionService.getSourceConnectionById(1))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections/1/test", "GET", auth, null);
    }

    @Test
    void testTestSourceConnection_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Add Source Connection
    @Test
    void testAddSourceConnection_Success() throws Exception {
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setAlias("New Source Connection");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.addSourceConnection(any(SourceConnection.class), eq("testUser")))
                .thenReturn(sourceConnection);

        mockMvc.perform(post("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Source Connection\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.alias").value("New Source Connection"));
    }

    @Test
    void testAddSourceConnection_ValidationError() throws Exception {
        mockMvc.perform(post("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"\"}"))  // Empty alias, assuming it's invalid
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testAddSourceConnection_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.addSourceConnection(any(SourceConnection.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections", "POST", auth, "{\"alias\":\"New Source Connection\"}");
    }

    @Test
    void testAddSourceConnection_Unauthorized() throws Exception {
        mockMvc.perform(post("/applications/1/sourceConnections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Source Connection\"}"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testAddSourceConnection_EmptyRequestBody() throws Exception {
        mockMvc.perform(post("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))  // Empty request body
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testAddSourceConnection_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(post("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Source Connection\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Update Source Connection
    @Test
    void testUpdateSourceConnection_Success() throws Exception {
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setAlias("Updated Source Connection");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.updateSourceConnection(eq(1), any(SourceConnection.class), eq("testUser")))
                .thenReturn(sourceConnection);

        mockMvc.perform(patch("/applications/1/sourceConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Source Connection\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.alias").value("Updated Source Connection"));
    }

    @Test
    void testUpdateSourceConnection_ValidationError() throws Exception {
        mockMvc.perform(patch("/applications/1/sourceConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"\"}"))  // Empty alias, assuming it's invalid
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateSourceConnection_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.updateSourceConnection(eq(1), any(SourceConnection.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections/1", "PATCH", auth, "{\"alias\":\"Updated Source Connection\"}");
    }

    @Test
    void testUpdateSourceConnection_Unauthorized() throws Exception {
        mockMvc.perform(patch("/applications/1/sourceConnections/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Source Connection\"}"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testUpdateSourceConnection_EmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/applications/1/sourceConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))  // Empty request body
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateSourceConnection_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(patch("/applications/1/sourceConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Source Connection\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testUpdateSourceConnection_SourceIdNotFound() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.updateSourceConnection(eq(1), any(SourceConnection.class), eq("testUser")))
                .thenThrow(new EntityNotFoundException("Source Connection not found with id: 1"));

        mockMvc.perform(patch("/applications/1/sourceConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Source Connection\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Source Connection not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Bulk Update Source Connections
    @Test
    void testBulkUpdateSourceConnections_AllUpdated() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        SourceConnection connection1 = new SourceConnection();
        connection1.setAlias("Connection 1");

        SourceConnection connection2 = new SourceConnection();
        connection2.setAlias("Connection 2");

        List<SourceConnection> updatedConnections = List.of(connection1, connection2);

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedConnections);

        mockMvc.perform(patch("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].alias").value("Connection 1"))
                .andExpect(jsonPath("$.data[1].alias").value("Connection 2"));
    }

    @Test
    void testBulkUpdateSourceConnections_SomeUpdated() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        SourceConnection connection1 = new SourceConnection();
        connection1.setAlias("Connection 1");

        List<SourceConnection> updatedConnections = List.of(connection1);  // Only one connection updated

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedConnections);

        mockMvc.perform(patch("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isMultiStatus())
                .andExpect(jsonPath("$.data[0].alias").value("Connection 1"));
    }

    @Test
    void testBulkUpdateSourceConnections_NoneUpdated() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        List<SourceConnection> updatedConnections = Collections.emptyList();  // No connections updated

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedConnections);

        mockMvc.perform(patch("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkUpdateSourceConnections_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkUpdateIsActive(anyList(), anyBoolean(), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        String requestBody = "[1, 2]";

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections?isActive=true", "PATCH", auth, requestBody);
    }

    @Test
    void testBulkUpdateSourceConnections_Unauthorized() throws Exception {
        mockMvc.perform(patch("/applications/1/sourceConnections")
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testBulkUpdateSourceConnections_EmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))  // Empty request body
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkUpdateSourceConnections_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(patch("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testBulkUpdateSourceConnections_InvalidDataType() throws Exception {
        mockMvc.perform(patch("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"invalid\", 2]"))  // Sending a string instead of an integer
                .andExpect(status().isBadRequest());
    }

    //---------------------------------------------------------------------
    // Tests for Delete Source Connection
    @Test
    void testDeleteSourceConnection_Success() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        SourceConnection connection = new SourceConnection();
        connection.setId(1);
        connection.setAlias("Test Connection");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.deleteSourceConnection(1, "testUser"))
                .thenReturn(connection);

        mockMvc.perform(delete("/applications/1/sourceConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Source Connection deleted successfully"));
    }

    @Test
    void testDeleteSourceConnection_SourceIdNotFound() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.deleteSourceConnection(1, "testUser"))
                .thenThrow(new EntityNotFoundException("Source Connection not found with id: 1"));

        mockMvc.perform(delete("/applications/1/sourceConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Source Connection not found with id: 1"));
    }

    @Test
    void testDeleteSourceConnection_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(delete("/applications/1/sourceConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testDeleteSourceConnection_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.deleteSourceConnection(1, "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections/1", "DELETE", auth, null);
    }

    @Test
    void testDeleteSourceConnection_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications/1/sourceConnections/1"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

    //---------------------------------------------------------------------
    // Tests for Bulk Delete Source Connections
    @Test
    void testBulkDeleteSourceConnections_AllDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkDeleteSourceConnections(List.of(1, 2), "testUser"))
                .thenReturn(List.of("Connection1", "Connection2"));

        mockMvc.perform(delete("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("All Source Connections deleted successfully"));
    }

    @Test
    void testBulkDeleteSourceConnections_SomeDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkDeleteSourceConnections(List.of(1, 2), "testUser"))
                .thenReturn(List.of("Connection1"));  // Only one connection deleted

        mockMvc.perform(delete("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isMultiStatus())
                .andExpect(jsonPath("$.message").value("Some Source Connections could not be deleted"));
    }

    @Test
    void testBulkDeleteSourceConnections_NoneDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkDeleteSourceConnections(List.of(1, 2), "testUser"))
                .thenReturn(Collections.emptyList());  // No connections deleted

        mockMvc.perform(delete("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("None of the Source Connections could not be deleted"));
    }

    @Test
    void testBulkDeleteSourceConnections_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(delete("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testBulkDeleteSourceConnections_InvalidDataType() throws Exception {
        mockMvc.perform(delete("/applications/1/sourceConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"invalid\", 2]"))  // Sending a string instead of an integer
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkDeleteSourceConnections_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications/1/sourceConnections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

    @Test
    void testBulkDeleteSourceConnections_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(sourceConnectionService.bulkDeleteSourceConnections(List.of(1, 2), "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections", "DELETE", auth, "[1, 2]");
    }

    //---------------------------------------------------------------------
    // Tests for Get Source Connection Stored Procedures
    @Test
    void testGetSourceConnectionStoredProcedures_Success() throws Exception {
        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.setId(1);
        sourceConnection.setAlias("Test Connection");

        StoredProcedure storedProcedure1 = new StoredProcedure("Procedure 1", "Parameters 1");
        StoredProcedure storedProcedure2 = new StoredProcedure("Procedure 2", "Parameters 2");

        when(sourceConnectionService.getSourceConnectionById(1)).thenReturn(sourceConnection);
        when(sourceConnectionService.getSourceConnectionStoredProcedures(sourceConnection))
                .thenReturn(List.of(storedProcedure1, storedProcedure2));

        mockMvc.perform(get("/applications/1/sourceConnections/1/storedProcedures")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("Procedure 1"))
                .andExpect(jsonPath("$.data[1].name").value("Procedure 2"));
    }

    @Test
    void testGetSourceConnectionStoredProcedures_SourceIdNotFound() throws Exception {
        when(sourceConnectionService.getSourceConnectionById(1))
                .thenThrow(new EntityNotFoundException("Source Connection not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections/1/storedProcedures")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Source Connection not found with id: 1"));
    }

    @Test
    void testGetSourceConnectionStoredProcedures_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/sourceConnections/1/storedProcedures"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetSourceConnectionStoredProcedures_ServiceException() throws Exception {
        when(sourceConnectionService.getSourceConnectionById(1))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/sourceConnections/1/storedProcedures", "GET", auth, null);
    }

    @Test
    void testGetSourceConnectionStoredProcedures_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/sourceConnections/1/storedProcedures")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //---------------------------------------------------------------------
    // Tests for Get Source Connection Types
    @Test
    void testGetSourceConnectionTypes_Success() throws Exception {
        mockMvc.perform(get("/applications/1/sourceConnections/types")
                        .with(authentication(auth)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Source Connection types returned successfully"));
    }

    @Test
    void testGetSourceConnectionTypes_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/sourceConnections/types"))
                .andExpect(status().isFound());  // 302 Found
    }
}
