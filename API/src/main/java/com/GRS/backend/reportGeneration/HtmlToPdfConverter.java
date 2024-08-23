package com.GRS.backend.reportGeneration;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class HtmlToPdfConverter {

    @Value("${aws.access.key}")
    private String awsAccessKey;

    @Value("${aws.secret.key}")
    private String awsSecretKey;

    @Value("${aws.region}")
    private String awsRegion;

    @Value("${aws.bucket.name}")
    private String bucketName;

    private AmazonS3 s3Client;

    private static final Logger logger = LoggerFactory.getLogger(HtmlToPdfConverter.class);

    @PostConstruct
    public void init() {
        // Initialize AWS credentials using Spring properties
        AWSCredentials credentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);

        this.s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(awsRegion)
                .build();
    }

    public byte[] convertHtmlToPdf(String htmlContent) {
        try {
            // Apply the page styling to the HTML content
            String styledHtmlContent = addPageStyling(htmlContent);

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                ITextRenderer renderer = new ITextRenderer();
                renderer.setDocumentFromString(styledHtmlContent);
                renderer.layout();
                renderer.createPDF(os);

                return os.toByteArray();
            }
        } catch (Exception e) {
            System.err.println("Error while converting HTML to PDF: " + e.getMessage());
            logger.error("Error while converting HTML to PDF", e);
            throw new RuntimeException("Error while converting HTML to PDF", e);
        }
    }

    public void convertHtmlToPdfAndUpload(String htmlContent, String fileName) {
        try {
            // Convert the HTML content to PDF
            byte[] pdfBytes = convertHtmlToPdf(htmlContent);

            // Upload the PDF to S3
            try (InputStream pdfInputStream = new ByteArrayInputStream(pdfBytes)) {
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(pdfBytes.length);

                PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, pdfInputStream, metadata)
                        .withCannedAcl(CannedAccessControlList.Private);
                s3Client.putObject(putObjectRequest);
                System.out.println("PDF uploaded successfully to S3. ETag: " + s3Client.getObjectMetadata(bucketName, fileName).getETag());
            }
        } catch (Exception e) {
            System.err.println("Error while uploading PDF to S3: " + e.getMessage());
            logger.error("Error while uploading PDF to S3", e);
            throw new RuntimeException("Error while uploading PDF to S3", e);
        }
    }

    private String addPageStyling(String htmlContent) {
        return "<html><head><style>" +
                "@page { size: A4 landscape; margin: 10mm; }" +
                "body { width: 100%; margin: 0; padding: 0; overflow-x: hidden; }" +
                "table { width: 100%; table-layout: fixed; border-collapse: collapse; }" +
                "th, td { border: 1px solid black; padding: 8px; text-align: left; " +
                "white-space: normal; word-wrap: break-word; overflow-wrap: break-word; }" +
                "th { background-color: #f2f2f2; }" +
                "</style></head><body>" + htmlContent + "</body></html>";
    }
}
