package com.GRS.backend.entities.request;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
@Setter
@Getter
@ToString
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign keys
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "destination_id", referencedColumnName = "id")
    private DestinationConnection destination_connection;

    private LocalDate date;

    private Integer remoteUserId;

    private String storedProcedure;

    private String[] params;

//    @NotNull(message = "Status must not be null")
    private RequestStatus status;

    private String reportLink;

    private String createdBy;

    private String lastUpdatedBy;

    private String deletedBy;

    private LocalDateTime creationDate;

    private Boolean isDeleted = false;

    private LocalDateTime deletionDate;

    @PrePersist
    public void prePersist() {
        this.creationDate = LocalDateTime.now();
        this.deletedBy = "";
        this.isDeleted = false;
        this.deletionDate = null;
    }

}
