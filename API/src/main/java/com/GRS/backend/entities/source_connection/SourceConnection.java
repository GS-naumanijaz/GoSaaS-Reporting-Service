    package com.GRS.backend.entities.source_connection;


    import com.GRS.backend.entities.application.Application;
    import com.GRS.backend.entities.report.Report;
    import com.GRS.backend.enums.SourceConnectionType;
    import com.GRS.backend.utilities.EncryptionUtility;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotNull;
    import lombok.Getter;
    import lombok.Setter;

    import javax.crypto.SecretKey;
    import java.time.LocalDateTime;
    import java.util.HashSet;
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

        @NotNull(message = "Alias must not be null")
        private String alias;

        @NotNull(message = "Type must not be null")
        private SourceConnectionType type;

        private String host;

        private Integer port;

        private Boolean isActive;

        private Boolean isDeleted = false;

        private Boolean lastTestResult;

        @NotNull
        private String username;

        @NotNull
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

        public void addReport(Report report) {
            this.reports.add(report);
            report.setSourceConnection(this);
        }

        public void decryptPassword() {
            if (this.key == null || this.password == null) {
//                throw new RuntimeException("Cannot decrypt password: key or password is null");
                this.password = "";
                return;
            }
            try {
                SecretKey key = EncryptionUtility.decodeKey(this.key);
                this.password = EncryptionUtility.decrypt(this.password, key);
            } catch (Exception e) {
                throw new RuntimeException("Failed to decrypt password", e);
            }
        }

//        public String retrieveDecryptedPassword() {
//            if (this.key == null || this.password == null) {
//                throw new RuntimeException("Cannot retrieve decrypted password: key or password is null");
//            }
//            try {
//                SecretKey key = EncryptionUtility.decodeKey(this.key);
//                return EncryptionUtility.decrypt(this.password, key);
//            } catch (Exception e) {
//                throw new RuntimeException("Failed to decrypt password", e);
//            }
//        }


        public void encryptPassword() {
            if (this.password == null) {
                this.key = "";
                return;
            }

            try {
                SecretKey key = EncryptionUtility.generateKey();
                String encryptedPassword = EncryptionUtility.encrypt(this.password, key);
                this.password = encryptedPassword;
                this.key = EncryptionUtility.encodeKey(key);
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
