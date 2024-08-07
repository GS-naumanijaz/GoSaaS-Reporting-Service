package com.GRS.backend.entities.source_connection;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.report.Report;
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
    @OneToMany(mappedBy = "source_connection", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Report> reports = new HashSet<>();

    private String alias;
    private SourceConnectionType type;
    private String host;
    private int port;
    private Boolean is_active;
    private Boolean is_deleted;
    private String username;
    private String password;
    private String database_name;
    private String created_by;
    private String deleted_by;
    private LocalDate creation_date;
    private LocalDate deletion_date;
    private LocalDate updation_date;

    public void addReport(Report report) {
        this.reports.add(report);
        report.setSource_connection(this);
    }


}
