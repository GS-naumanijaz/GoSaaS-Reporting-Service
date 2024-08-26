package com.GRS.backend.reportGeneration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xhtmlrenderer.pdf.ITextRenderer;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Component
public class HtmlToPdfConverter {

    @Value("${aws.bucket.name}")
    private String bucketName;

    private final S3Client s3Client;

    private static final Logger logger = LoggerFactory.getLogger(HtmlToPdfConverter.class);

    public HtmlToPdfConverter(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public void convertHtmlToPdfAndUpload(String htmlContent, String fileName) {
        try {
            byte[] pdfBytes = convertHtmlToPdf(htmlContent);

            // Upload the PDF to S3
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            PutObjectResponse putObjectResponse = s3Client.putObject(putObjectRequest,
                    RequestBody.fromBytes(pdfBytes));

            logger.info("PDF uploaded successfully to S3. ETag: {}", putObjectResponse.eTag());
        } catch (Exception e) {
            logger.error("Error while uploading PDF to S3", e);
            throw new RuntimeException("Error while uploading PDF to S3", e);
        }
    }

    public byte[] convertHtmlToPdf(String htmlContent) {
        try {
            String styledHtmlContent = addPageStyling(htmlContent);

            try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
                ITextRenderer renderer = new ITextRenderer();
                renderer.setDocumentFromString(styledHtmlContent);
                renderer.layout();
                renderer.createPDF(os);

                return os.toByteArray();
            }
        } catch (Exception e) {
            logger.error("Error while converting HTML to PDF", e);
            throw new RuntimeException("Error while converting HTML to PDF", e);
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
