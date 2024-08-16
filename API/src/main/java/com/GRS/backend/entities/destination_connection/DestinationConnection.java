package com.GRS.backend.entities.destination_connection;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.request.Request;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "destination_connections", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"app_id", "alias"}, name = "unique_destination_alias_per_application")
})
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
    @OneToMany(mappedBy = "destinationConnection", cascade = CascadeType.ALL)
    private Set<Report> reports = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "destination_connection", cascade = CascadeType.ALL)
    private Set<Request> requests = new HashSet<>();

    @NotNull(message = "Alias must not be null")
    private String alias;

////    @NotNull(message = "Type must not be null")
//    private DestinationConnectionType type;
//
//    @NotNull(message = "Url must not be null")
//    private String url;
//
//    @NotNull(message = "Port must not be null")
//    private int port;

    private Boolean isActive = false;

    private Boolean isDeleted = false;

    private String secretKey = "";

    private String accessKey = "";

    private String bucketName = "";

    private String region = "";

    private String createdBy = "";

    private String deletedBy = "";

    private LocalDateTime creationDate;

    private LocalDateTime deletionDate;

    private LocalDateTime updatedAt;

    public void addReport(Report report) {
        this.reports.add(report);
        report.setDestinationConnection(this);
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
