package com.GRS.backend.entities.user;

import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.AuditLogGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findUserByEmail(String email) {
        System.out.println("findUserByEmail" + email);
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new EntityNotFoundException("User", email);
        }

    }

    public String getUserNameByEmail(String email) {
        System.out.println("getUserNameByEmail" + email);
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            return user.get().getUsername();
        } else {
            throw new EntityNotFoundException("User", email);
        }
    }

    public void saveOrUpdateUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        AuditLogGenerator.getInstance().log(AuditLogAction.LOGIN, user.getUsername());
        if (!existingUser.isPresent()) {
            userRepository.save(user);
        } else {
            existingUser.get().setName(user.getName());
            existingUser.get().setLastLogin(LocalDateTime.now());
            userRepository.save(existingUser.get());
        }
    }
}
