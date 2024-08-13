package com.GRS.backend.utilities;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;

public class S3BucketTester {

    public static boolean testS3Connection(String accessKey, String secretKey, String bucketName, String region) {
        try {
            // Create S3 client
            S3Client s3Client = S3Client.builder()
                    .region(Region.of(region)) // Ensure this region matches your bucket's region
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)))
                    .build();

            // Attempt to list objects in the specified bucket to test the connection
            ListObjectsV2Request listObjectsRequest = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .maxKeys(1)
                    .build();
            s3Client.listObjectsV2(listObjectsRequest);

            return true; // Connection was successful
        } catch (S3Exception e) {
            e.printStackTrace();
            return false; // Connection failed
        }
    }

}
