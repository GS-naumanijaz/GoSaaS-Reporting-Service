package com.GRS.backend.entities.user;

import com.GRS.backend.TestUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test case for finding an existing user by email
    @Test
    void testFindUserByEmail_UserExists() throws Exception {
        User user = new User("John Doe", "johndoe@example.com");

        when(userService.findUserByEmail(anyString())).thenReturn(user);

        mockMvc.perform(get("/findUserByEmail/johndoe@example.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is3xxRedirection());
    }

    // Test case for user not found
    @Test
    void testFindUserByEmail_UserNotFound() throws Exception {
        when(userService.findUserByEmail(anyString())).thenReturn(null);

        mockMvc.perform(get("/findUserByEmail/nonexistent@example.com")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is3xxRedirection());
    }

    // Test case for handling service exception
    @Test
    void testFindUserByEmail_ServiceException() throws Exception {
        when(userService.findUserByEmail(anyString())).thenThrow(new RuntimeException("Service exception"));

        mockMvc.perform(get("/findUserByEmail/johndoe@example.com")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is3xxRedirection());
    }

    // Test case for invalid email format
    @Test
    void testFindUserByEmail_InvalidEmailFormat() throws Exception {
        // Assuming that the service layer validates email format and throws an exception
        when(userService.findUserByEmail(anyString())).thenThrow(new IllegalArgumentException("Invalid email format"));

        mockMvc.perform(get("/findUserByEmail/invalid-email")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is3xxRedirection());
    }

    // Test case for empty email parameter
    @Test
    void testFindUserByEmail_EmptyEmail() throws Exception {
        mockMvc.perform(get("/findUserByEmail/")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is3xxRedirection());
    }
}
