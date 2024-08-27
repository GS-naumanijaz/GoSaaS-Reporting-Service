package com.GRS.backend.entities.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public String getUserNameByEmail(String email) {
        return userRepository.findByEmail(email).getUsername();
    }

    public void saveOrUpdateUser(User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            userRepository.save(user);
        } else {
            existingUser.setName(user.getName());
            existingUser.setLastLogin(LocalDateTime.now());
            userRepository.save(existingUser);
        }
    }
}
