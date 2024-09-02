package com.GRS.backend.entities.destination_connection;

import com.GRS.backend.TestUtils;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.user.User;
import com.GRS.backend.entities.user.UserService;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.DestinationConnectionDTO;
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
class DestinationConnectionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DestinationConnectionService destinationConnectionService;

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

    // Add test cases below

    @Test
    void testGetAllDestinationConnections_EmptyPage() throws Exception {
        when(destinationConnectionService.getAllDestinationConnections(anyInt(), any(), any(), any(Pageable.class)))
                .thenReturn(Page.empty());

        mockMvc.perform(get("/applications/1/destinationConnections")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isEmpty());
    }

    @Test
    void testGetAllDestinationConnections_NonEmptyPage() throws Exception {
        DestinationConnection connection1 = new DestinationConnection();
        connection1.setAlias("Destination 1");

        DestinationConnection connection2 = new DestinationConnection();
        connection2.setAlias("Destination 2");

        List<DestinationConnection> connections = List.of(connection1, connection2);
        Page<DestinationConnection> connectionPage = new PageImpl<>(connections);

        when(destinationConnectionService.getAllDestinationConnections(anyInt(), any(), any(), any(Pageable.class)))
                .thenReturn(connectionPage);

        mockMvc.perform(get("/applications/1/destinationConnections")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].alias").value("Destination 1"))
                .andExpect(jsonPath("$.data.content[1].alias").value("Destination 2"));
    }

    @Test
    void testGetAllDestinationConnections_ServiceException() throws Exception {
        when(destinationConnectionService.getAllDestinationConnections(anyInt(), any(), any(), any(Pageable.class)))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections", "GET", auth, null);
    }

    @Test
    void testGetAllDestinationConnections_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/destinationConnections"))
                .andExpect(status().isFound());  // 302 Found
    }

    //----------------------------------------------------------------------------------

    @Test
    void testGetAllDestinationConnectionsAll_Success() throws Exception {
        DestinationConnectionDTO dto1 = new DestinationConnectionDTO(1, "Destination 1");
        DestinationConnectionDTO dto2 = new DestinationConnectionDTO(2, "Destination 2");

        List<DestinationConnectionDTO> dtos = List.of(dto1, dto2);

        when(destinationConnectionService.getAllDestinationConnections(anyInt())).thenReturn(dtos);

        mockMvc.perform(get("/applications/1/destinationConnections/all")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].alias").value("Destination 1"))
                .andExpect(jsonPath("$.data[1].alias").value("Destination 2"));
    }

    @Test
    void testGetAllDestinationConnectionsAll_EmptyList() throws Exception {
        when(destinationConnectionService.getAllDestinationConnections(anyInt())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/applications/1/destinationConnections/all")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void testGetAllDestinationConnectionsAll_ServiceException() throws Exception {
        when(destinationConnectionService.getAllDestinationConnections(anyInt()))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections/all", "GET", auth, null);
    }

    @Test
    void testGetAllDestinationConnectionsAll_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/destinationConnections/all"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetAllDestinationConnections_AppIdNotFound() throws Exception {
        when(destinationConnectionService.getAllDestinationConnections(anyInt()))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/destinationConnections/all")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    // Inside DestinationConnectionControllerIT class

    @Test
    void testGetDestinationConnectionById_Success() throws Exception {
        DestinationConnection destinationConnection = new DestinationConnection();
        destinationConnection.setId(1);
        destinationConnection.setAlias("Test Connection");

        when(destinationConnectionService.getDestinationConnectionById(1)).thenReturn(destinationConnection);

        mockMvc.perform(get("/applications/1/destinationConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.alias").value("Test Connection"));
    }

    @Test
    void testGetDestinationConnectionById_DestinationIdNotFound() throws Exception {
        when(destinationConnectionService.getDestinationConnectionById(1))
                .thenThrow(new EntityNotFoundException("Destination Connection not found with id: 1"));

        mockMvc.perform(get("/applications/1/destinationConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Destination Connection not found with id: 1"));
    }

    @Test
    void testGetDestinationConnectionById_AppIdNotFound() throws Exception {
        when(destinationConnectionService.getDestinationConnectionById(anyInt()))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(get("/applications/1/destinationConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testGetDestinationConnectionById_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/destinationConnections/1"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testGetDestinationConnectionById_ServiceException() throws Exception {
        when(destinationConnectionService.getDestinationConnectionById(1))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections/1", "GET", auth, null);
    }

    // Inside DestinationConnectionControllerIT class

    @Test
    void testTestDestinationConnection_Success() throws Exception {
        DestinationConnection destinationConnection = new DestinationConnection();
        destinationConnection.setId(1);
        destinationConnection.setAlias("Test Connection");

        when(destinationConnectionService.getDestinationConnectionById(1)).thenReturn(destinationConnection);
        when(destinationConnectionService.testDestinationConnection(destinationConnection, "testUser")).thenReturn(true);

        mockMvc.perform(get("/applications/1/destinationConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Destination Connection was tested successfully"));
    }

    @Test
    void testTestDestinationConnection_DestinationIdNotFound() throws Exception {
        when(destinationConnectionService.getDestinationConnectionById(1))
                .thenThrow(new EntityNotFoundException("Destination Connection not found with id: 1"));

        mockMvc.perform(get("/applications/1/destinationConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Destination Connection not found with id: 1"));
    }

    @Test
    void testTestDestinationConnection_TestFails() throws Exception {
        DestinationConnection destinationConnection = new DestinationConnection();
        destinationConnection.setId(1);
        destinationConnection.setAlias("Test Connection");

        when(destinationConnectionService.getDestinationConnectionById(1)).thenReturn(destinationConnection);
        when(destinationConnectionService.testDestinationConnection(destinationConnection, "testUser")).thenReturn(false);

        mockMvc.perform(get("/applications/1/destinationConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Destination Connection failed test"));
    }

    @Test
    void testTestDestinationConnection_Unauthorized() throws Exception {
        mockMvc.perform(get("/applications/1/destinationConnections/1/test"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testTestDestinationConnection_ServiceException() throws Exception {
        when(destinationConnectionService.getDestinationConnectionById(1))
                .thenThrow(new RuntimeException("Service exception"));

        // Use the utility method to test the service exception
        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections/1/test", "GET", auth, null);
    }

    @Test
    void testTestDestinationConnection_AppIdNotFound() throws Exception {
        // Simulate the applicationService throwing an EntityNotFoundException for the given appId
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        // Perform the request and expect a 404 Not Found status
        mockMvc.perform(get("/applications/1/destinationConnections/1/test")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //-------------------------------------------------------------------------------------

    @Test
    void testAddDestinationConnection_Success() throws Exception {
        DestinationConnection destinationConnection = new DestinationConnection();
        destinationConnection.setAlias("New Destination Connection");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.addDestinationConnection(any(DestinationConnection.class), eq("testUser")))
                .thenReturn(destinationConnection);

        mockMvc.perform(post("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Destination Connection\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.alias").value("New Destination Connection"));
    }

    @Test
    void testAddDestinationConnection_ValidationError() throws Exception {
        mockMvc.perform(post("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"\"}"))  // Empty alias, assuming it's invalid
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testAddDestinationConnection_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.addDestinationConnection(any(DestinationConnection.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections", "POST", auth, "{\"alias\":\"New Destination Connection\"}");
    }

    @Test
    void testAddDestinationConnection_Unauthorized() throws Exception {
        mockMvc.perform(post("/applications/1/destinationConnections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Destination Connection\"}"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testAddDestinationConnection_EmptyRequestBody() throws Exception {
        mockMvc.perform(post("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))  // Empty request body
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testAddDestinationConnection_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(post("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"New Destination Connection\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    //-------------------------------------------------
    @Test
    void testUpdateDestinationConnection_Success() throws Exception {
        DestinationConnection destinationConnection = new DestinationConnection();
        destinationConnection.setAlias("Updated Destination Connection");

        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.updateDestinationConnection(eq(1), any(DestinationConnection.class), eq("testUser")))
                .thenReturn(destinationConnection);

        mockMvc.perform(patch("/applications/1/destinationConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Destination Connection\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.alias").value("Updated Destination Connection"));
    }

    @Test
    void testUpdateDestinationConnection_ValidationError() throws Exception {
        mockMvc.perform(patch("/applications/1/destinationConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"\"}"))  // Empty alias, assuming it's invalid
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testUpdateDestinationConnection_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.updateDestinationConnection(eq(1), any(DestinationConnection.class), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections/1", "PATCH", auth, "{\"alias\":\"Updated Destination Connection\"}");
    }

    @Test
    void testUpdateDestinationConnection_Unauthorized() throws Exception {
        mockMvc.perform(patch("/applications/1/destinationConnections/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Destination Connection\"}"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testUpdateDestinationConnection_EmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/applications/1/destinationConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))  // Empty request body
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("ERROR: Invalid Method Arguments"));
    }

    @Test
    void testUpdateDestinationConnection_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(patch("/applications/1/destinationConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Destination Connection\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testUpdateDestinationConnection_DestinationIdNotFound() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.updateDestinationConnection(eq(1), any(DestinationConnection.class), eq("testUser")))
                .thenThrow(new EntityNotFoundException("Destination Connection not found with id: 1"));

        mockMvc.perform(patch("/applications/1/destinationConnections/1")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"alias\":\"Updated Destination Connection\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Destination Connection not found with id: 1"));
    }

    //-------------------------------------------------------------------

    @Test
    void testBulkUpdateDestinationConnections_AllUpdated() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        DestinationConnection connection1 = new DestinationConnection();
        connection1.setAlias("Connection 1");

        DestinationConnection connection2 = new DestinationConnection();
        connection2.setAlias("Connection 2");

        List<DestinationConnection> updatedConnections = List.of(connection1, connection2);

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedConnections);

        mockMvc.perform(patch("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].alias").value("Connection 1"))
                .andExpect(jsonPath("$.data[1].alias").value("Connection 2"));
    }

    @Test
    void testBulkUpdateDestinationConnections_SomeUpdated() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        DestinationConnection connection1 = new DestinationConnection();
        connection1.setAlias("Connection 1");

        List<DestinationConnection> updatedConnections = List.of(connection1);  // Only one connection updated

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedConnections);

        mockMvc.perform(patch("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isMultiStatus())
                .andExpect(jsonPath("$.data[0].alias").value("Connection 1"));
    }

    @Test
    void testBulkUpdateDestinationConnections_NoneUpdated() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        List<DestinationConnection> updatedConnections = Collections.emptyList();  // No connections updated

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkUpdateIsActive(List.of(1, 2), true, "testUser"))
                .thenReturn(updatedConnections);

        mockMvc.perform(patch("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkUpdateDestinationConnections_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkUpdateIsActive(anyList(), anyBoolean(), eq("testUser")))
                .thenThrow(new RuntimeException("Service exception"));

        String requestBody = "[1, 2]";

        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections?isActive=true", "PATCH", auth, requestBody);
    }

    @Test
    void testBulkUpdateDestinationConnections_Unauthorized() throws Exception {
        mockMvc.perform(patch("/applications/1/destinationConnections")
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isFound());  // 302 Found
    }

    @Test
    void testBulkUpdateDestinationConnections_EmptyRequestBody() throws Exception {
        mockMvc.perform(patch("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(""))  // Empty request body
                .andExpect(status().isBadRequest());
    }

    @Test
    void testBulkUpdateDestinationConnections_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(patch("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testBulkUpdateDestinationConnections_InvalidDataType() throws Exception {
        mockMvc.perform(patch("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .param("isActive", "true")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"invalid\", 2]"))  // Sending a string instead of an integer
                .andExpect(status().isBadRequest());
    }

    //----------------------------------------------------------------------------
    @Test
    void testDeleteDestinationConnection_Success() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        DestinationConnection connection = new DestinationConnection();
        connection.setId(1);
        connection.setAlias("Test Connection");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.deleteDestinationConnection(1, "testUser"))
                .thenReturn(connection);

        mockMvc.perform(delete("/applications/1/destinationConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Destination Connection deleted successfully"));
    }

    @Test
    void testDeleteDestinationConnection_DestinationIdNotFound() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.deleteDestinationConnection(1, "testUser"))
                .thenThrow(new EntityNotFoundException("Destination Connection not found with id: 1"));

        mockMvc.perform(delete("/applications/1/destinationConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Destination Connection not found with id: 1"));
    }

    @Test
    void testDeleteDestinationConnection_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(delete("/applications/1/destinationConnections/1")
                        .with(authentication(auth)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testDeleteDestinationConnection_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.deleteDestinationConnection(1, "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections/1", "DELETE", auth, null);
    }

    @Test
    void testDeleteDestinationConnection_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications/1/destinationConnections/1"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

    //----------------------------------------------------------------
    @Test
    void testDeleteDestinationConnections_AllDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkDeleteDestinationConnections(List.of(1, 2), "testUser"))
                .thenReturn(List.of("Connection1", "Connection2"));

        mockMvc.perform(delete("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("All Destination Connections deleted successfully"));
    }

    @Test
    void testDeleteDestinationConnections_SomeDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkDeleteDestinationConnections(List.of(1, 2), "testUser"))
                .thenReturn(List.of("Connection1"));  // Only one connection deleted

        mockMvc.perform(delete("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isMultiStatus())
                .andExpect(jsonPath("$.message").value("Some Destination Connections could not be deleted"));
    }

    @Test
    void testDeleteDestinationConnections_NoneDeleted() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkDeleteDestinationConnections(List.of(1, 2), "testUser"))
                .thenReturn(Collections.emptyList());  // No connections deleted

        mockMvc.perform(delete("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("None of the Destination Connections could not be deleted"));
    }

    @Test
    void testDeleteDestinationConnections_AppIdNotFound() throws Exception {
        when(applicationService.getApplicationById(1))
                .thenThrow(new EntityNotFoundException("Application not found with id: 1"));

        mockMvc.perform(delete("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Application not found with id: 1"));
    }

    @Test
    void testDeleteDestinationConnections_InvalidDataType() throws Exception {
        mockMvc.perform(delete("/applications/1/destinationConnections")
                        .with(authentication(auth))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[\"invalid\", 2]"))  // Sending a string instead of an integer
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteDestinationConnections_Unauthorized() throws Exception {
        mockMvc.perform(delete("/applications/1/destinationConnections")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[1, 2]"))
                .andExpect(status().isFound());  // 302 Found, indicating a redirect to login
    }

    @Test
    void testDeleteDestinationConnections_ServiceException() throws Exception {
        Application application = new Application();
        application.setId(1);
        application.setAlias("Test Application");

        when(applicationService.getApplicationById(1)).thenReturn(application);
        when(destinationConnectionService.bulkDeleteDestinationConnections(List.of(1, 2), "testUser"))
                .thenThrow(new RuntimeException("Service exception"));

        TestUtils.testServiceException(mockMvc, "/applications/1/destinationConnections", "DELETE", auth, "[1, 2]");
    }





}
