# Use an official Maven image to build the backend
FROM maven:3.6.3-openjdk-17-slim AS build

# Set the working directory inside the container for building
WORKDIR /app

# Copy the Maven build files (pom.xml)
COPY pom.xml /app/

# Download dependencies (cache layer)
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src /app/src

# Run the build
RUN mvn clean install -DskipTests

# Use a lightweight OpenJDK image to run the Spring Boot application
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built jar file from the Maven build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar /app/backend-0.0.1-SNAPSHOT.jar

# Expose the port Spring Boot will listen on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/backend-0.0.1-SNAPSHOT.jar"]



#working docker witha manual mvn clean install required
# # Use an official OpenJDK runtime as a parent image
# FROM openjdk:22-jdk-slim

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the built jar file into the container
# COPY target/backend-0.0.1-SNAPSHOT.jar /app/backend-0.0.1-SNAPSHOT.jar  
# #Change 'my-app.jar' to your actual jar file name

# # Expose the port Spring Boot will listen on
# EXPOSE 8080

# # Run the application
# ENTRYPOINT ["java", "-jar", "/app/backend-0.0.1-SNAPSHOT.jar"]
