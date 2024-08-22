package com.GRS.backend.entities.source_connection;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.enums.SourceConnectionType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "source_connections")
@Getter
@Setter
public class SourceConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign Key's
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application;

    @JsonIgnore
    @OneToMany(mappedBy = "sourceConnection", cascade = CascadeType.ALL)
    private Set<Report> reports = new HashSet<>();

    @NotNull(message = "Alias must not be null")
    private String alias;

    @NotNull(message = "Type must not be null")
    private SourceConnectionType type;

    private String host;

    private Integer port;

    private Boolean isActive;

    private Boolean isDeleted;

    private Boolean lastTestResult;

    @NotNull
    private String username;

    @NotNull
    private String password;

    private String databaseName;

    private String createdBy;

    private String deletedBy ;

    private LocalDateTime creationDate;

    private LocalDateTime deletionDate;

    private LocalDateTime updatedAt;

    public void addReport(Report report) {
        this.reports.add(report);
        report.setSourceConnection(this);
    }

    @PrePersist
    public void prePersist() {
        this.creationDate = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.createdBy = "";
        this.deletedBy = "";
        this.isDeleted = false;
        this.deletionDate = null;
        this.lastTestResult = null;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


}
