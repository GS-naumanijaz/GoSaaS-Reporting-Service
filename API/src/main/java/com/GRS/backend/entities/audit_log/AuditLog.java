package com.GRS.backend.entities.audit_log;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "request")
@Data
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;





}
