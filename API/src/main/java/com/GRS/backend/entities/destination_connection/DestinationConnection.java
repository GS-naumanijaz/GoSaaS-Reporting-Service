package com.GRS.backend.entities.destination_connection;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.enums.DestinationConnectionType;
import com.GRS.backend.enums.SourceConnectionType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
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

    //fk
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application;

    @JsonIgnore
    @OneToMany(mappedBy = "destination_connection", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Report> reports = new HashSet<>();

    private String alias;
    private DestinationConnectionType type;
    private String url;
    private int port;
    private boolean is_active;
    private boolean is_delete;
    private String secret_key;
    private String access_key;
    private String created_by;
    private String deleted_by;
    private LocalDate creation_date;
    private LocalDate deletion_date;
    private LocalDate updation_date;


}
