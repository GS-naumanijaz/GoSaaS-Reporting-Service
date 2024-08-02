package com.GRS.backend.application;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.time.LocalDate;


@Entity
@Table(name = "applications")
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int appId;

    // FK
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
