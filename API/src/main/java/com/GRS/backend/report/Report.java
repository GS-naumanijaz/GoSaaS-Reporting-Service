package com.GRS.backend.report;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "reports")
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    private Boolean isPinned;
    private LocalDate creationDate;
    private LocalDate deletionDate;
    private LocalDate updationDate;

}
