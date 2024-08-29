package com.GRS.backend.entities.request;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Arrays;

@Entity
@Table(name = "requests")
@Setter
@Getter
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign keys
    @ManyToOne
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application;

    @ManyToOne
    @JoinColumn(name = "destination_id", referencedColumnName = "id")
    private DestinationConnection destination_connection;

    private String reportName;

    private String[] params;

//    @NotNull(message = "Status must not be null")
    private RequestStatus status;

    private String reportLink;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Request{" +
                "id=" + id +
                ", application=" + application +
                ", destination_connection=" + destination_connection +
                ", storedProcedure='" + reportName + '\'' +
                ", params=" + Arrays.toString(params) +
                ", status=" + status +
                ", reportLink='" + reportLink + '\'' +
                ", creationDate=" + createdAt +
                '}';
    }
}
