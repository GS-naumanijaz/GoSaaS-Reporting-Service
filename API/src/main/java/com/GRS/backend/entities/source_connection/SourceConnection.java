    package com.GRS.backend.entities.source_connection;


    import com.GRS.backend.entities.application.Application;
    import com.GRS.backend.entities.report.Report;
    import com.GRS.backend.enums.SourceConnectionType;
    import com.GRS.backend.utilities.EncryptionUtility;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotBlank;
    import jakarta.validation.constraints.NotNull;
    import lombok.Getter;
    import lombok.Setter;

    import javax.crypto.SecretKey;
    import java.time.LocalDateTime;
    import java.util.HashSet;
    import java.util.Objects;
    import java.util.Set;

    @Entity
    @Table(name = "source_connections")
    @Getter
    @Setter
    public class SourceConnection {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        //Foreign Key's
        @ManyToOne(cascade = CascadeType.ALL)
        @JoinColumn(name = "app_id", referencedColumnName = "id")
        private Application application;

        @JsonIgnore
        @OneToMany(mappedBy = "sourceConnection", cascade = CascadeType.ALL)
        private Set<Report> reports = new HashSet<>();

        @NotBlank(message = "Alias must not be blank")
        private String alias;

        private SourceConnectionType type;

        private String host;

        private Integer port;

        private Boolean isActive;

        private Boolean isDeleted;

        private Boolean lastTestResult;

        private String username;

        private String password;

        private String databaseName;

        private String schema;

        private String createdBy;

        private String lastUpdatedBy;

        private String deletedBy ;

        private LocalDateTime creationDate;

        private LocalDateTime deletionDate;

        private LocalDateTime updatedAt;

        @JsonIgnore
        private String key;

        public SourceConnection() {}

        public SourceConnection(int id) {
            this.id = id;
        }

        public void addReport(Report report) {
            this.reports.add(report);
            report.setSourceConnection(this);
        }

        public void decryptPassword() {
            try {
                SecretKey key = EncryptionUtility.decodeKey(this.key);
                this.password = EncryptionUtility.decrypt(this.password, key);
            } catch (Exception e) {
                throw new RuntimeException("Failed to decrypt password", e);
            }
        }

        public String retrieveDecryptedPassword() {
            try {
                SecretKey key = EncryptionUtility.decodeKey(this.key);
                return EncryptionUtility.decrypt(this.password, key);
            } catch (Exception e) {
                throw new RuntimeException("Failed to decrypt password", e);
            }
        }

        public void encryptPassword() {
            try {
                if (this.password != null) {
                    SecretKey key = EncryptionUtility.generateKey();
                    String encryptedPassword = EncryptionUtility.encrypt(this.password, key);
                    this.password = encryptedPassword;
                    this.key = EncryptionUtility.encodeKey(key);
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to encrypt password", e);
            }
        }

        @PrePersist
        public void prePersist() {
            this.creationDate = LocalDateTime.now();
            this.updatedAt = LocalDateTime.now();
            this.deletedBy = "";
            this.isDeleted = false;
            this.isActive = true;
            this.deletionDate = null;
            this.lastTestResult = null;
        }

        @PreUpdate
        public void preUpdate() {
            this.updatedAt = LocalDateTime.now();
        }


    }
