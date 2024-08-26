package com.GRS.backend.reportGeneration;

import com.GRS.backend.entities.destination_connection.DestinationConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3ClientProvider {

    private static final Logger logger = LoggerFactory.getLogger(S3ClientProvider.class);

    @Value("${aws.region}")
    private String region;

    @Value("${aws.access.key:}")
    private String accessKeyId;

    @Value("${aws.secret.key:}")
    private String secretAccessKey;

    @Bean
    public S3Client s3Client() {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKeyId, secretAccessKey);
//        logger.info("Creating S3Client with default credentials: AccessKeyId={}, SecretAccessKey={} region={}", accessKeyId, secretAccessKey, region);
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }

    public S3Client createS3Client(DestinationConnection destinationConnection) {
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(
                destinationConnection.getAccessKey(),
                destinationConnection.getSecretKey()
        );

//        logger.info("Creating S3Client with dynamic credentials: AccessKeyId={}, SecretAccessKey={} Region={}", destinationConnection.getAccessKey(), destinationConnection.getSecretKey(), destinationConnection.getRegion());

        return S3Client.builder()
                .region(Region.of(destinationConnection.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}
