package com.GRS.backend.entities.application;

import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.user.User;
import jakarta.persistence.*;
import lombok.Data;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "applications")
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String description;
    private Boolean is_active;
    private Boolean is_deleted;
    private String created_by;
    private String deleted_by;
    private LocalDate creation_date;
    private LocalDate deletion_date;
    private LocalDate updation_date;

//    @JsonIgnore
//    @OneToMany(mappedBy = "report")
//    private Set<Report> reports = new HashSet<>();

    @PrePersist
    public void prePersist() {
        this.creation_date = LocalDate.now();
        this.updation_date = LocalDate.now();
        if (this.is_active == null) {
            this.is_active = true;
        }
        if (this.is_deleted == null) {
            this.is_deleted = false;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updation_date = LocalDate.now();
    }

}
