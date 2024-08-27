package com.GRS.backend.entities.destination_connection;


import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.request.Request;
import com.GRS.backend.utilities.EncryptionUtility;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "destination_connections")
@Setter
@Getter
public class DestinationConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    //Foreign keys
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "app_id", referencedColumnName = "id")
    private Application application;

    @JsonIgnore
    @OneToMany(mappedBy = "destinationConnection", cascade = CascadeType.ALL)
    private Set<Report> reports = new HashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "destination_connection", cascade = CascadeType.ALL)
    private Set<Request> requests = new HashSet<>();

    @NotNull(message = "Alias must not be null")
    private String alias;

////    @NotNull(message = "Type must not be null")
//    private DestinationConnectionType type;
//
//    @NotNull(message = "Url must not be null")
//    private String url;
//
//    @NotNull(message = "Port must not be null")
//    private int port;

    private Boolean isActive;

    private Boolean isDeleted;

    private Boolean lastTestResult;

    private String secretKey;

    private String accessKey;

    private String bucketName;

    private String region;

    private String createdBy;

    private String deletedBy;

    private LocalDateTime creationDate;

    private LocalDateTime deletionDate;

    private LocalDateTime updatedAt;

    @JsonIgnore
    private String key;

    public void addReport(Report report) {
        this.reports.add(report);
        report.setDestinationConnection(this);
    }

    public void decryptSecretKey() {
        try {
            SecretKey key = EncryptionUtility.decodeKey(this.key);
            this.secretKey = EncryptionUtility.decrypt(this.secretKey, key);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt Secret Key", e);
        }
    }

    public String retrieveDecryptedSecretKey() {
        try {
            SecretKey key = EncryptionUtility.decodeKey(this.key);
            return EncryptionUtility.decrypt(this.secretKey, key);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt Secret Key", e);
        }
    }

    public void encryptSecretKey() {
        try {
            SecretKey key = EncryptionUtility.generateKey();
            String encryptedSecretKey = EncryptionUtility.encrypt(this.secretKey, key);
            this.secretKey = encryptedSecretKey;
            this.key = EncryptionUtility.encodeKey(key);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt Secret Key", e);
        }
    }

    @PrePersist
    public void prePersist() {
        this.creationDate = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.createdBy = "";
        this.deletedBy = "";
        this.isDeleted = false;
        this.deletionDate = null;
        this.isActive = true;
        this.lastTestResult = null;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Custom toString method for debugging
    @Override
    public String toString() {
        return "DestinationConnection{" +
                "id=" + id +
                ", alias='" + alias + '\'' +
                ", isActive=" + isActive +
                ", isDeleted=" + isDeleted +
                ", lastTestResult=" + lastTestResult +
                ", secretKey='" + secretKey + '\'' +
                ", accessKey='" + accessKey + '\'' +
                ", bucketName='" + bucketName + '\'' +
                ", region='" + region + '\'' +
                ", createdBy='" + createdBy + '\'' +
                ", deletedBy='" + deletedBy + '\'' +
                ", creationDate=" + creationDate +
                ", deletionDate=" + deletionDate +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
