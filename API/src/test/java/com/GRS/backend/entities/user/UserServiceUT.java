package com.GRS.backend.entities.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class UserServiceUT{

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindUserByEmail() {
        String email = "test@example.com";
        User mockUser = new User();
        mockUser.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(mockUser);

        User result = userService.findUserByEmail(email);

        assertEquals(mockUser, result);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    public void testGetUserNameByEmail() {
        String email = "test@example.com";
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setUsername("testUser");
        when(userRepository.findByEmail(email)).thenReturn(mockUser);

        String username = userService.getUserNameByEmail(email);

        assertEquals("testUser", username);
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    public void testSaveOrUpdateUser_whenUserDoesNotExist() {
        User newUser = new User();
        newUser.setEmail("newuser@example.com");
        when(userRepository.findByEmail(newUser.getEmail())).thenReturn(null);
        userService.saveOrUpdateUser(newUser);

        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    public void testSaveOrUpdateUser_whenUserExists() {
        User existingUser = new User();
        existingUser.setEmail("existinguser@example.com");
        existingUser.setName("Old Name");
        existingUser.setLastLogin(LocalDateTime.now().minusDays(1));

        User updatedUser = new User();
        updatedUser.setEmail(existingUser.getEmail());
        updatedUser.setName("New Name");

        when(userRepository.findByEmail(existingUser.getEmail())).thenReturn(existingUser);

        userService.saveOrUpdateUser(updatedUser);

        verify(userRepository, times(1)).save(existingUser);
        assertEquals("New Name", existingUser.getName());
        assertEquals(LocalDateTime.now().getDayOfYear(), existingUser.getLastLogin().getDayOfYear());
    }
}
