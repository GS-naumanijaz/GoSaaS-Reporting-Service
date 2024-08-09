package com.GRS.backend.entities.notification;

import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.request.Request;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "notifications")
@Setter
@Getter
@ToString
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "request_id", referencedColumnName = "id")
    private Request request;

    private String message;

    private String created_by = "";

    private LocalDateTime creation_date;

    @PrePersist
    public void prePersist() {
        this.creation_date = LocalDateTime.now();
        this.created_by = "";
    }


}
