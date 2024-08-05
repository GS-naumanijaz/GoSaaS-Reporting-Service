package com.GRS.backend.entities.report;

import com.GRS.backend.entities.application.Application;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "reports")
@Data
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int report_id;

    //FK
//    @ManyToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "app_id")
//    private Application application;

    //source connection id
    //destination id

    private String alias;
    private String description;
    private String stored_procedure;
    private String[] params;
    private String xsl_template;
    private Boolean is_deleted;
    private Boolean is_pinned;
    private LocalDate creation_date;
    private LocalDate deletion_date;
    private LocalDate updation_date;

}
