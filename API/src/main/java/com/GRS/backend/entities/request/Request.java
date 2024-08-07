package com.GRS.backend.entities.request;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.notification.Notification;
import com.GRS.backend.enums.DestinationConnectionType;
import com.GRS.backend.enums.RequestStatus;
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

//    @JsonIgnore
//    @OneToOne(mappedBy = "request")
//    private Notification notification;

    private LocalDate date;
    private int remore_user_id;
    private String storedProcedure;
    private String[] params;
    private RequestStatus status;
    private String report_link;
    private String created_by;
    private LocalDate creation_date;



}
