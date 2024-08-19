package com.GRS.backend.utilities;

import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class DatabaseInitializer {

    @PersistenceContext
    private EntityManager entityManager;

    @EventListener(ContextRefreshedEvent.class)
    @Transactional
    public void onApplicationEvent() {
//        createUniqueIndexes();
    }

    private void createUniqueIndexes() {
        try {
            // Applications
            String applicationsSql = "CREATE UNIQUE INDEX unique_application_alias " +
                    "ON applications (alias) " +
                    "WHERE is_deleted = false;";
            entityManager.createNativeQuery(applicationsSql).executeUpdate();

            // Destination Connections
            String destinationSql = "CREATE UNIQUE INDEX unique_destination_alias_per_application " +
                    "ON destination_connections (app_id, alias) " +
                    "WHERE is_deleted = false;";
            entityManager.createNativeQuery(destinationSql).executeUpdate();

            // Source Connections
            String sourceSql = "CREATE UNIQUE INDEX unique_source_alias_per_application " +
                    "ON source_connections (app_id, alias) " +
                    "WHERE is_deleted = false;";
            entityManager.createNativeQuery(sourceSql).executeUpdate();

            // Reports
            String reportsSql = "CREATE UNIQUE INDEX unique_report_alias_per_application " +
                    "ON reports (app_id, alias) " +
                    "WHERE is_deleted = false;";
            entityManager.createNativeQuery(reportsSql).executeUpdate();

        } catch (Exception e) {
            // Log the exception or handle it appropriately
            System.err.println("Error creating unique indexes: " + e.getMessage());
        }
    }
}
