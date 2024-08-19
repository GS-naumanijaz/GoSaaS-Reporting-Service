package com.GRS.backend.entities.application;

import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.request.Request;
import com.GRS.backend.entities.source_connection.SourceConnection;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "applications")
@Setter
@Getter
@ToString
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign Keys
    @JsonIgnore
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private Set<Report> reports = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private Set<DestinationConnection> destination_connections = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private Set<SourceConnection> source_connections = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    private Set<Request> requests = new HashSet<>();

    @NotNull(message = "Alias must not be null")
    private String alias;

    private String description = "";

    private Boolean isActive = true;

    private Boolean isDeleted = false;

    private String createdBy = "";

    private String deletedBy = "";

    private LocalDateTime creationDate;

    private LocalDateTime deletionDate;

    private LocalDateTime updatedAt;

    public void addReport(Report report) {
        this.reports.add(report);
        report.setApplication(this);
    }

    @PrePersist
    public void prePersist() {
        this.creationDate = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.createdBy = "";
        this.deletedBy = "";
        this.isDeleted = false;
        this.deletionDate = null;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
