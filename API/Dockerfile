# Use an official OpenJDK runtime as a parent image
FROM openjdk:22-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built jar file into the container
COPY target/backend-0.0.1-SNAPSHOT.jar /app/backend-0.0.1-SNAPSHOT.jar  
#Change 'my-app.jar' to your actual jar file name

# Expose the port Spring Boot will listen on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/backend-0.0.1-SNAPSHOT.jar"]



# # Set the working directory inside the container
# WORKDIR /app

# # Copy the Maven build file to the container
# COPY pom.xml /app/

# # Install Maven and clean up apt cache in a single layer to reduce image size
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends maven && \
#     mvn -f /app/pom.xml clean package && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# # Copy the generated JAR file to the app directory
# COPY target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# # Expose port 8080 for the Spring Boot app
# EXPOSE 8080

# # Set the entry point to run the JAR file
# ENTRYPOINT ["java", "-jar", "/app/app.jar"]