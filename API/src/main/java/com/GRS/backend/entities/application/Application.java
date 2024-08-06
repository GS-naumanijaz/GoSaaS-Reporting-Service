package com.GRS.backend.entities.application;

import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.entities.user.User;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "applications")
@Setter
@Getter
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign Keys
    @JsonIgnore
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Report> reports = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<DestinationConnection> destination_connections = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SourceConnection> source_connections = new HashSet<>();


    private String name;
    private String description;
    private Boolean is_active;
    private Boolean is_deleted;
    private String created_by;
    private String deleted_by;
    private LocalDate creation_date;
    private LocalDate deletion_date;
    private LocalDate updation_date;



    public void addReport(Report report) {
        this.reports.add(report);
        report.setApplication(this);
    }

    @PrePersist
    public void prePersist() {
        this.creation_date = LocalDate.now();
        this.updation_date = LocalDate.now();
        if (this.is_active == null) {
            this.is_active = true;
        }
        if (this.is_deleted == null) {
            this.is_deleted = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updation_date = LocalDate.now();
    }

}
