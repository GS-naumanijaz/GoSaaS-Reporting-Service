package com.GRS.backend.entities.audit_log;


import com.GRS.backend.enums.AuditLogAction;
import com.GRS.backend.enums.AuditLogModule;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Setter
@Getter
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    private AuditLogModule module;

    @NotNull
    private AuditLogAction action;

    private LocalDateTime createdAt;

    private String details;

    @NotNull
    private String username;

    public AuditLog() {
    }

    public AuditLog(AuditLogModule module, AuditLogAction action, String details, String username) {
        this.module = module;
        this.action = action;
        this.details = details;
        this.username = username;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
