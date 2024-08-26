package com.GRS.backend.utilities;

import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.models.StoredProcedure;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import javax.swing.plaf.nimbus.State;
import java.lang.reflect.Parameter;
import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

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

    public static List<Map<String, String>> callStoredProcedureOnDatabase(SourceConnection source, Report report, Map<String, String> parameterValues) {
        String url = "jdbc:postgresql://" + source.getHost() + ":" + source.getPort() + "/" + source.getDatabaseName();
        List<Map<String, String>> result = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(url, source.getUsername(), source.getPassword())) {
            if (connection != null) {

                try (Statement statement = connection.createStatement()) {
                    String setSchemaSQL = "SET search_path TO '" + source.getSchema() + "'";
                    statement.execute(setSchemaSQL);
                } catch (SQLException e) {
                    System.err.println("SQL Exception during setting schema: " + e.getMessage());
                }

                StringBuilder query = new StringBuilder("SELECT * FROM " + report.getStoredProcedure() + "("); //user_name := '' :: text); ";

                String[] parameters = report.getParams();

                for (String parameter : parameters) {
                    String[] parameterParts = parameter.split(" ");
                    String parameterName = parameterParts[0];
                    String parameterType = parameterParts[1];

                    // Check if the parameter is provided in parameterValues
                    if (parameterValues.containsKey(parameterName)) {
                        String parameterValue = parameterValues.get(parameterName);
                        query.append(parameterName).append(" := '").append(parameterValue).append("' :: ").append(parameterType).append(", ");
                    }
                }

                query = new StringBuilder(query.substring(0, query.length() - 2));
                query.append(");");

//                System.out.println(query);


                try (Statement statement = connection.createStatement()) {
                    try (ResultSet resultSet = statement.executeQuery(query.toString())) {
                        ResultSetMetaData metadata = resultSet.getMetaData();
                        int columnCount = metadata.getColumnCount();

                        // Build the list of maps
                        while (resultSet.next()) {
                            Map<String, String> rowMap = new HashMap<>();
                            for (int i = 1; i <= columnCount; i++) {
                                String columnName = metadata.getColumnLabel(i);
                                String columnValue = resultSet.getString(i);
                                rowMap.put(columnName, columnValue);
                            }
                            result.add(rowMap);
                        }
                    } catch (SQLException e) {
                        System.err.println("SQL Exception during query execution: " + e.getMessage());
                    }
                } catch (SQLException e) {
                    System.err.println("SQL Exception during setting schema: " + e.getMessage());
                }

            } else {
                System.err.println("Failed to make connection to the database!");
            }
        } catch (SQLException e) {
            System.err.println("SQL Exception: " + e.getMessage());
        }
        return result;
    }
}
