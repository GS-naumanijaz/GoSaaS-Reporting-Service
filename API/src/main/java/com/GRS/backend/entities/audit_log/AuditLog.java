package com.GRS.backend.entities.audit_log;


import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Entity
@Table(name = "request")
@Setter
@Getter
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //fk
    //user id
    //connection id
    //destination id
    //report id

    private AuditLogModule module;
    private AuditLogAction action;
    private LocalDate timestamp;
    private String details;

}
