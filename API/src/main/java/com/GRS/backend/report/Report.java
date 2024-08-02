package com.GRS.backend.report;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    private int reportId;

    //FK
    private int connectionId;
    private int destinationId;
    private int appId;

    private String alias;
    private String description;
    private String storedProcedure;
    private String[] params;
    private String XSLTemplate;
    private Boolean isDeleted;
    private LocalDate creationDate;
    private LocalDate deletionDate;
    private LocalDate updationDate;

}
