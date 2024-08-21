package com.GRS.backend.entities.report;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.source_connection.SourceConnection;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;


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
    @JoinColumn(name = "app_id", referencedColumnName = "id", nullable = false)
    private Application application;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "destination_id", referencedColumnName = "id")
    private DestinationConnection destinationConnection;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "source_id", referencedColumnName = "id")
    private SourceConnection sourceConnection;

    @NotNull(message = "Alias must not be null")
    private String alias;

    private String description = "";

    private String storedProcedure = "";

    private String[] params;

    private String xslTemplate = "";

    private Boolean isDeleted = false;

    private Boolean isPinned = false;

    private Boolean isActive = true;

    private LocalDateTime creationDate;

    private LocalDateTime deletionDate;

    private LocalDateTime updatedAt;

    private String createdBy = "";

    private String deletedBy = "";


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
