package com.GRS.backend.entities.user;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "users") // Ensure this matches your database table name
public class    User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private Date createdAt;
    private Date lastLogin;

//    @OneToMany
//    @JoinColumn(name = "app_id")
//    private List<Application> applications;

    public User() {
    }

    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
        this.lastLogin = new Date();

    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public void setCreatedAt(Date created_at) {
        this.createdAt = created_at;
    }

    public void setLastLogin(Date last_login) {
        this.lastLogin = last_login;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


}
