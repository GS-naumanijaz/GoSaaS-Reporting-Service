package com.GRS.backend.entities.request;


import com.GRS.backend.enums.DestinationConnectionType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "audit_log")
@Data
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int log_id;





}
