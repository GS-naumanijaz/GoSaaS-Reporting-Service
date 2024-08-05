package com.GRS.backend.entities.user;

import com.GRS.backend.entities.application.Application;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users") // Ensure this matches your database table name
public class    User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private Date created_at;
    private Date last_login;

//    @OneToMany
//    @JoinColumn(name = "app_id")
//    private List<Application> applications;

    public User() {
    }

    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.created_at = new Date();
        this.last_login = new Date();

    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Date getCreatedAt() {
        return created_at;
    }

    public Date getLastLogin() {
        return last_login;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public void setCreatedAt(Date created_at) {
        this.created_at = created_at;
    }

    public void setLastLogin(Date last_login) {
        this.last_login = last_login;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


}
