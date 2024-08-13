package com.GRS.backend.utilities;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnectionTester {
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
            System.out.println("hello darkness my old friend");
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
}
