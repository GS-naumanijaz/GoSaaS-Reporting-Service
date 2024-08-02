package com.GRS.backend.application;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "applications")
public class Application {
    @Id
    private int appId;

    //FK
    private int userId;

    private String name;
    private String description;
    private Boolean isActive;
    private Boolean isDeleted;
    private String createdBy;
    private String deletedBy;
    private LocalDate creationDate;
    private LocalDate deletionDate;
    private LocalDate updationDate;
}
