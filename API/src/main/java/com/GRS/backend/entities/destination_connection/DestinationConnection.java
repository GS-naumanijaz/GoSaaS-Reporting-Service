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






}
