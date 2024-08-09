package com.GRS.backend.entities.destination_connection;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.request.Request;
import com.GRS.backend.enums.DestinationConnectionType;
import com.GRS.backend.enums.SourceConnectionType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "destination_connections")
@Setter
@Getter
public class DestinationConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign keys
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application;

    @JsonIgnore
    @OneToMany(mappedBy = "destination_connection", cascade = CascadeType.ALL)
    private Set<Report> reports = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "destination_connection", cascade = CascadeType.ALL)
    private Set<Request> requests = new HashSet<>();

    @NotNull(message = "Alias must not be null")
    private String alias;

//    @NotNull(message = "Type must not be null")
    private DestinationConnectionType type;

    @NotNull(message = "Url must not be null")
    private String url;

    @NotNull(message = "Port must not be null")
    private int port;

    private Boolean is_active = false;

    private Boolean is_deleted = false;

    private String secret_key = "";

    private String access_key = "";

    private String created_by = "";

    private String deleted_by = "";

    private LocalDate creation_date;

    private LocalDate deletion_date;

    private LocalDate updation_date;

    public void addReport(Report report) {
        this.reports.add(report);
        report.setDestination_connection(this);
    }

    @PrePersist
    public void prePersist() {
        this.creation_date = LocalDate.now();
        this.updation_date = LocalDate.now();
        this.created_by = "";
        this.deleted_by = "";
        this.is_deleted = false;
        this.deletion_date = null;
    }

    @PreUpdate
    public void preUpdate() {
        this.updation_date = LocalDate.now();
    }


}
