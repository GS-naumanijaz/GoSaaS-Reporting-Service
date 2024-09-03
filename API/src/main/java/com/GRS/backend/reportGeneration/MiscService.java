package com.GRS.backend.reportGeneration;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityIsInactiveException;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.GenerateReportDTO;
import com.GRS.backend.utilities.DatabaseUtilities;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import javax.xml.transform.TransformerException;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.Optional;

@Service
public class MiscService {

    private final ApplicationService applicationService;
    private final S3ClientProvider s3ClientProvider;
    private final JsonToXmlConverter jsonToXmlConverter;
    private final XmlToHtmlTransformer xmlToHtmlTransformer;
    private final HtmlToPdfConverter htmlToPdfConverter;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @Value("${aws.xslFileKey}")
    private String xslFileKey;

    @Autowired
    public MiscService(ApplicationService applicationService,
                       S3Client s3Client, S3ClientProvider s3ClientProvider,
                       JsonToXmlConverter jsonToXmlConverter,
                       XmlToHtmlTransformer xmlToHtmlTransformer,
                       HtmlToPdfConverter htmlToPdfConverter) {
        this.applicationService = Objects.requireNonNull(applicationService, "ApplicationService must not be null");
        this.s3ClientProvider = s3ClientProvider;
        this.jsonToXmlConverter = Objects.requireNonNull(jsonToXmlConverter, "JsonToXmlConverter must not be null");
        this.xmlToHtmlTransformer = Objects.requireNonNull(xmlToHtmlTransformer, "XmlToHtmlTransformer must not be null");
        this.htmlToPdfConverter = Objects.requireNonNull(htmlToPdfConverter, "HtmlToPdfConverter must not be null");
    }

    public ResponseEntity<String> generateReport(GenerateReportDTO generateReportDTO) {
        Application app = applicationService.getApplicationByAlias(generateReportDTO.getData().getApplicationName());

        Optional<Report> optionalReport = app.getReports().stream()
                .filter(rep -> generateReportDTO.getData().getReportName().equals(rep.getAlias()))
                .findFirst();

        if (!optionalReport.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Report not found");
//            throw new EntityNotFoundException("Report", generateReportDTO.getData().getReportName());
        }

        Report report = optionalReport.get();

        if (Boolean.FALSE.equals(report.getIsActive())) {
            throw new EntityIsInactiveException("report", report.getId());
        }

        SourceConnection source = report.getSourceConnection();
        source.decryptPassword();
        DestinationConnection destination = report.getDestinationConnection();
        destination.decryptSecretKey();

        // Call the stored procedure on the source database
        Object jsonResponse = DatabaseUtilities.callStoredProcedureOnDatabase(source, report, generateReportDTO.getData().getParameterValues());

        // Convert the Java object (jsonResponse) to a JSON string
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString;
        try {
            jsonString = objectMapper.writeValueAsString(jsonResponse);
        } catch (Exception e) {
            throw new RuntimeException("Error converting object to JSON string", e);
        }

        // Convert JSON String to InputStream
        InputStream jsonInputStream = new ByteArrayInputStream(jsonString.getBytes(StandardCharsets.UTF_8));

        // Convert JSON InputStream to XML using jsonToXmlConverter
        String xmlInputStream = jsonToXmlConverter.convertJsonToXml(jsonInputStream);

        // Load the XSL file from S3
        InputStream s3XslInputStream;
        try {
            s3XslInputStream = loadXslFromS3(destination, report);
        } catch (Exception e) {
            // Fallback to a dummy XSL in case of an error
            String dummyXsl = """
                <?xml version="1.0" encoding="UTF-8"?>
                <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
                    <xsl:template match="/">
                        <html>
                            <body>
                                <h2>Dummy XSL Template</h2>
                                <p>This is a fallback XSL template used when the original one cannot be loaded from S3.</p>
                            </body>
                        </html>
                    </xsl:template>
                </xsl:stylesheet>
            """;
            s3XslInputStream = new ByteArrayInputStream(dummyXsl.getBytes(StandardCharsets.UTF_8));
        }

        // Transform the XML to HTML using the XSL file
        String html = null;
        try {
            html = xmlToHtmlTransformer.transformXmlToHtml(xmlInputStream, s3XslInputStream);
        } catch (TransformerException e) {
            throw new RuntimeException(e);
        }

        // Generate the report name
        String reportName = generateReportName(generateReportDTO.getName());

        // Convert the HTML to PDF and upload to S3
        htmlToPdfConverter.convertHtmlToPdfAndUpload(html, reportName, destination);

        return ResponseEntity.ok(reportName);
    }

    private InputStream loadXslFromS3(DestinationConnection destination, Report report) {
        S3Client s3Client = s3ClientProvider.createS3Client(destination);
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(destination.getBucketName())
                .key(report.getXslTemplate())
                .build();
        return s3Client.getObject(getObjectRequest);
    }

    private String generateReportName(String name) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        return name + "_" + LocalDateTime.now().format(formatter) + ".pdf";
    }
}
