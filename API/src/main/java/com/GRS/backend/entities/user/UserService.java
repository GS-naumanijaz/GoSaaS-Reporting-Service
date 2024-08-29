package com.GRS.backend.entities.user;

import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.utilities.AuditLogGenerator;
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
        AuditLogGenerator.getInstance().log(AuditLogAction.LOGIN, user.getUsername());
        if (existingUser == null) {
            userRepository.save(user);
        } else {
            existingUser.setName(user.getName());
            existingUser.setLastLogin(LocalDateTime.now());
            userRepository.save(existingUser);
        }
    }
}
