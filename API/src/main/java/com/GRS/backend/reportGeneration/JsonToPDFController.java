package com.GRS.backend.reportGeneration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

@RestController
@RequestMapping("/api")
public class JsonToPDFController {

    private final S3Client s3Client;
    private final JsonToXmlConverter jsonToXmlConverter;
    private final XmlToHtmlTransformer xmlToHtmlTransformer;
    private final HtmlToPdfConverter htmlToPdfConverter;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.xslFileKey}")
    private String xslFileKey;

    @Autowired
    public JsonToPDFController(S3Client s3Client,
                               JsonToXmlConverter jsonToXmlConverter,
                               XmlToHtmlTransformer xmlToHtmlTransformer,
                               HtmlToPdfConverter htmlToPdfConverter) {
        this.s3Client = Objects.requireNonNull(s3Client, "S3Client must not be null");
        this.jsonToXmlConverter = Objects.requireNonNull(jsonToXmlConverter, "JsonToXmlConverter must not be null");
        this.xmlToHtmlTransformer = Objects.requireNonNull(xmlToHtmlTransformer, "XmlToHtmlTransformer must not be null");
        this.htmlToPdfConverter = Objects.requireNonNull(htmlToPdfConverter, "HtmlToPdfConverter must not be null");
    }

    @GetMapping("/pdf")
    public ResponseEntity<String> generatePdf() {
        try (InputStream jsonInputStream = loadJsonInputStream();
             InputStream s3XslInputStream = loadXslFromS3()) {

            // Convert JSON to XML
            String xml = jsonToXmlConverter.convertJsonToXml(jsonInputStream);

            // Transform the XML to HTML using the XSL file
            String html = xmlToHtmlTransformer.transformXmlToHtml(xml, s3XslInputStream);

            String reportName = generateReportName();

            // Convert the HTML to PDF and upload to S3
            htmlToPdfConverter.convertHtmlToPdfAndUpload(html, reportName);

            return ResponseEntity.ok("PDF successfully generated and uploaded to S3.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File error occurred: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error occurred: " + e.getMessage());
        }
    }

    private InputStream loadJsonInputStream() throws IOException {
        ClassPathResource jsonResource = new ClassPathResource("input.json");
        return jsonResource.getInputStream();
    }

    private InputStream loadXslFromS3() {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(xslFileKey)
                .build();
        return s3Client.getObject(getObjectRequest);
    }

    private String generateReportName() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        return "report_" + LocalDateTime.now().format(formatter) + ".pdf";
    }
}
