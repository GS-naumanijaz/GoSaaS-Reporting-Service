package com.GRS.backend.entities.destination_connection;


import com.GRS.backend.enums.DestinationConnectionType;
import com.GRS.backend.enums.SourceConnectionType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "destination_connections")
@Data
public class DestinationConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //fk
    //app id

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
