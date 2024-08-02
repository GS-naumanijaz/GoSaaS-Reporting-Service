package com.GRS.backend.application;

import jakarta.persistence.*;
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

    @PrePersist
    public void prePersist() {
        this.creationDate = LocalDate.now();
        this.updationDate = LocalDate.now();
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.isDeleted == null) {
            this.isDeleted = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updationDate = LocalDate.now();
    }

}
