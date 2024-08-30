package com.GRS.backend.reportGeneration;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityIsInactiveException;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.GenerateReportDTO;
import com.GRS.backend.models.DTO.ReportDataDTO;
import com.GRS.backend.utilities.DatabaseUtilities;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import javax.xml.transform.TransformerException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MiscServiceUT {

    @Value("${aws.bucket.name}")
    private String bucketName = "test-bucket";

    @Value("${aws.xslFileKey}")
    private String xslFileKey = "test-xsl-file.xsl";

    @Test
    public void testGenerateReport() throws TransformerException, IOException {
        // Create mocks
        ApplicationService applicationService = mock(ApplicationService.class);
        S3ClientProvider s3ClientProvider = mock(S3ClientProvider.class);
        JsonToXmlConverter jsonToXmlConverter = mock(JsonToXmlConverter.class);
        XmlToHtmlTransformer xmlToHtmlTransformer = mock(XmlToHtmlTransformer.class);
        HtmlToPdfConverter htmlToPdfConverter = mock(HtmlToPdfConverter.class);
        S3Client s3Client = mock(S3Client.class);

        // Create the service with mocks
        MiscService miscService = new MiscService(
                applicationService, s3Client, s3ClientProvider,
                jsonToXmlConverter, xmlToHtmlTransformer, htmlToPdfConverter);

        // Set up mock application and report
        Application application = new Application();
        application.setAlias("testApplication");
        application.setIsDeleted(false);

        SourceConnection sourceConnection = new SourceConnection();
        sourceConnection.decryptPassword();
        sourceConnection.setPort(1234);
        sourceConnection.setHost("testHost");
        sourceConnection.setDatabaseName("testDatabase");

        DestinationConnection destinationConnection = new DestinationConnection();
        destinationConnection.decryptSecretKey();

        Report report = new Report();
        report.setAlias("testReport");
        report.setIsActive(true);
        report.setSourceConnection(sourceConnection);
        report.setDestinationConnection(destinationConnection);
        report.setXslTemplate("test-xsl-file.xsl");

        application.setReports(Set.of(report));

        when(applicationService.getApplicationByAlias(anyString())).thenReturn(application);

        // Initialize GenerateReportDTO with non-null data
        ReportDataDTO reportDataDTO = new ReportDataDTO();
        reportDataDTO.setApplicationName("testApplication");
        reportDataDTO.setReportName("testReport");

        GenerateReportDTO generateReportDTO = new GenerateReportDTO();
        generateReportDTO.setData(reportDataDTO);

        // Mock behavior for converters and S3 client
        when(jsonToXmlConverter.convertJsonToXml(any(InputStream.class))).thenReturn("<xml></xml>");
        when(xmlToHtmlTransformer.transformXmlToHtml(anyString(), any(InputStream.class))).thenReturn("<html></html>");

        // Create a mock ResponseInputStream
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream("<xsl></xsl>".getBytes(StandardCharsets.UTF_8));
        ResponseInputStream<GetObjectResponse> mockResponseInputStream = Mockito.mock(ResponseInputStream.class);
        when(mockResponseInputStream.readAllBytes()).thenReturn(byteArrayInputStream.readAllBytes());

        // Mock the S3 client's getObject method to return the mock ResponseInputStream
        when(s3Client.getObject(any(GetObjectRequest.class))).thenReturn(mockResponseInputStream);

        // Call method under test
        ResponseEntity<String> response = miscService.generateReport(generateReportDTO);

        // Verify results
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());

        // Verify interactions
        verify(applicationService).getApplicationByAlias(anyString());
        verify(jsonToXmlConverter).convertJsonToXml(any(InputStream.class));
        verify(xmlToHtmlTransformer).transformXmlToHtml(anyString(), any(InputStream.class));
        verify(htmlToPdfConverter).convertHtmlToPdfAndUpload(anyString(), anyString(), any(DestinationConnection.class));
    }

    @Test
    public void testGenerateReport_EntityNotFound() {
        ApplicationService applicationService = mock(ApplicationService.class);
        MiscService miscService = new MiscService(
                applicationService, mock(S3Client.class), mock(S3ClientProvider.class),
                mock(JsonToXmlConverter.class), mock(XmlToHtmlTransformer.class), mock(HtmlToPdfConverter.class));

        GenerateReportDTO generateReportDTO = new GenerateReportDTO();
        ReportDataDTO reportDataDTO = new ReportDataDTO();
        reportDataDTO.setApplicationName("testApplication");
        reportDataDTO.setReportName("nonExistentReport");
        generateReportDTO.setData(reportDataDTO);

        Application application = new Application();
        application.setAlias("testApplication");
        when(applicationService.getApplicationByAlias(anyString())).thenReturn(application);

        // Call method under test and expect exception
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> miscService.generateReport(generateReportDTO));
        assertEquals("Report with alias nonExistentReport not found", exception.getMessage());
    }

    @Test
    public void testGenerateReport_EntityIsInactive() {
        ApplicationService applicationService = mock(ApplicationService.class);
        MiscService miscService = new MiscService(
                applicationService, mock(S3Client.class), mock(S3ClientProvider.class),
                mock(JsonToXmlConverter.class), mock(XmlToHtmlTransformer.class), mock(HtmlToPdfConverter.class));

        GenerateReportDTO generateReportDTO = new GenerateReportDTO();
        ReportDataDTO reportDataDTO = new ReportDataDTO();
        reportDataDTO.setApplicationName("testApplication");
        reportDataDTO.setReportName("testReport");
        generateReportDTO.setData(reportDataDTO);

        SourceConnection sourceConnection = new SourceConnection();
        DestinationConnection destinationConnection = new DestinationConnection();

        Report inactiveReport = new Report();
        inactiveReport.setAlias("testReport");
        inactiveReport.setIsActive(false); // Report is inactive
        inactiveReport.setSourceConnection(sourceConnection);
        inactiveReport.setDestinationConnection(destinationConnection);

        Application application = new Application();
        application.setAlias("testApplication");
        application.setReports(Set.of(inactiveReport));
        when(applicationService.getApplicationByAlias(anyString())).thenReturn(application);

        // Call method under test and expect exception
        EntityIsInactiveException exception = assertThrows(EntityIsInactiveException.class, () -> miscService.generateReport(generateReportDTO));
        assertEquals("report with ID " + inactiveReport.getId() + " is inactive", exception.getMessage());
    }
}
