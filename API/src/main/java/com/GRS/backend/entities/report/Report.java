package com.GRS.backend.entities.report;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Setter
@Getter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign Keys
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application; //Assigned to when creating report

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "destination_id", referencedColumnName = "id")
    private DestinationConnection destination_connection;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "source_id", referencedColumnName = "id")
    private SourceConnection source_connection;

    @NotNull(message = "Alias must not be null")
    private String alias;

    private String description = "";

    private String stored_procedure = "";

    private String[] params;

    private String xsl_template = "";

    private Boolean is_deleted = false;

    private Boolean is_pinned = false;

    private LocalDateTime creation_date;

    private LocalDateTime deletion_date;

    private LocalDateTime updation_date;

    private String created_by = "";

    private String deleted_by = "";


    @PrePersist
    public void prePersist() {
        this.creation_date = LocalDateTime.now();
        this.updation_date = LocalDateTime.now();
        this.created_by = "";
        this.deleted_by = "";
        this.is_deleted = false;
        this.deletion_date = null;
    }

    @PreUpdate
    public void preUpdate() {
        this.updation_date = LocalDateTime.now();
    }

}
