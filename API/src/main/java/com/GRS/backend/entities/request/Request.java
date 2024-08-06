package com.GRS.backend.entities.request;


import com.GRS.backend.enums.DestinationConnectionType;
import com.GRS.backend.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "audit_log")
@Setter
@Getter
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //fk
    //app id
    //destination id

    private LocalDate date;
    private int remore_user_id;
    private String storedProcedure;
    private String[] params;
    private RequestStatus status;
    private String report_link;
    private String created_by;
    private LocalDate creation_date;



}
