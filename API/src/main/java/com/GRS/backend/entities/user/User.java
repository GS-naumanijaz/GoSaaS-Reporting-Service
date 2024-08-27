package com.GRS.backend.entities.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "users") // Ensure this matches your database table name
@Getter
@Setter
public class    User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    public User() {
    }

    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.username = email != null ? email.split("@")[0] : "Unknown";
        this.createdAt = LocalDateTime.now();
        this.lastLogin = LocalDateTime.now();
    }
}
