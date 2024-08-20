package com.GRS.backend.utilities;

import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.models.StoredProcedure;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DatabaseUtilities {
    public static boolean tryConnect(String url, String username, String password, String driverClassName) {
        Connection connection = null;
        try {
            // Load the database driver class using the enum
            if (driverClassName != null && !driverClassName.isEmpty()) {
                Class.forName(driverClassName);
            } else {
                throw new ClassNotFoundException("Driver class not found: " + driverClassName);
            }

            // Attempt to establish a connection
            connection = DriverManager.getConnection(url, username, password);

            // If we reach this point, connection was successful
            return true;
        } catch (SQLException | ClassNotFoundException e) {
            // Connection failed
            e.printStackTrace();
            return false;
        } finally {
            // Ensure the connection is closed if it was opened
            if (connection != null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static List<StoredProcedure> getDatabaseInfo(SourceConnection source) {
        String url = "jdbc:postgresql://" + source.getHost() + ":" + source.getPort() + "/" + source.getDatabaseName();
        List<StoredProcedure> storedProcedures = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(url, source.getUsername(), source.getPassword())) {
            if (connection != null) {



                String sql = """
                    SELECT
                        p.proname AS procedure_name,
                        pg_catalog.pg_get_function_identity_arguments(p.oid) AS parameter_list
                    FROM
                        pg_catalog.pg_proc p
                    JOIN
                        pg_catalog.pg_namespace n ON n.oid = p.pronamespace
                    WHERE
                        n.nspname NOT IN ('pg_catalog', 'information_schema')
                    ORDER BY
                        p.proname;
                """;

                try (Statement statement = connection.createStatement()) {
                    ResultSet resultSet = statement.executeQuery(sql);
                    while (resultSet.next()) {
                        storedProcedures.add(new StoredProcedure(resultSet.getString("procedure_name"), resultSet.getString("parameter_list")));
                    }
                } catch (SQLException e) {
                    System.err.println("SQL Exception: " + e.getMessage());
                }
            } else {
                System.err.println("Failed to make connection to the database!");
            }
        } catch (SQLException e) {
            System.err.println("SQL Exception: " + e.getMessage());
        }

        return storedProcedures;
    }

    private static List<StoredProcedure> getStoredProcedures(Connection connection) {
        List<StoredProcedure> procedures = new ArrayList<>();
        String sql = """
            SELECT
                p.proname AS procedure_name,
                pg_catalog.pg_get_function_identity_arguments(p.oid) AS parameter_list
            FROM
                pg_catalog.pg_proc p
            JOIN
                pg_catalog.pg_namespace n ON n.oid = p.pronamespace
            WHERE
                n.nspname NOT IN ('pg_catalog', 'information_schema')
            ORDER BY
                p.proname;
        """;


        try (Statement statement = connection.createStatement()) {
            ResultSet resultSet = statement.executeQuery(sql);
            while (resultSet.next()) {
                procedures.add(new StoredProcedure(resultSet.getString("procedure_name"), resultSet.getString("parameter_list")));
            }
        } catch (SQLException e) {
            System.err.println("SQL Exception: " + e.getMessage());
        }

        return procedures;
    }
}
