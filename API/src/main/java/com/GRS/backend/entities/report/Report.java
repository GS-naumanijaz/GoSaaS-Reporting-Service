package com.GRS.backend.entities.report;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import java.time.LocalDate;

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
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application; //Assigned to when creating report

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "destination_id", referencedColumnName = "id")
    private DestinationConnection destination_connection;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "source_id", referencedColumnName = "id")
    private SourceConnection source_connection;

    private String alias;
    private String description;
    private String stored_procedure;
    private String[] params;
    private String xsl_template;
    private Boolean is_deleted;
    private Boolean is_pinned;
    private LocalDate creation_date;
    private LocalDate deletion_date;
    private LocalDate updation_date;

}
