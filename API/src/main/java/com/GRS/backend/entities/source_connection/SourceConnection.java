package com.GRS.backend.entities.source_connection;


import com.GRS.backend.enums.SourceConnectionType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "source_connections")
@Data
public class SourceConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //FK's
    //application id

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




}
