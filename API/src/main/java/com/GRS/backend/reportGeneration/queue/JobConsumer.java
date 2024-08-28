package com.GRS.backend.reportGeneration.queue;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.entities.destination_connection.DestinationConnectionRepository;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.request.Request;
import com.GRS.backend.entities.request.RequestService;
import com.GRS.backend.enums.RequestStatus;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.GenerateReportDTO;
import com.GRS.backend.reportGeneration.MiscService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

@Service
public class JobConsumer {

    private static final Logger logger = LoggerFactory.getLogger(JobConsumer.class);

    private final RequestService requestService;
    private final MiscService miscService;
    private final ObjectMapper objectMapper;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private DestinationConnectionRepository destinationConnectionRepository;

    @Autowired
    public JobConsumer(RequestService requestService, MiscService miscService, ObjectMapper objectMapper) {
        this.requestService = requestService;
        this.miscService = miscService;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "reportQueue")
    public void receiveJob(String jobJson) {
        logger.info("Received Job: {}", jobJson);

        try {
            // Convert JSON job to GenerateReportDTO
            GenerateReportDTO generateReportDTO = objectMapper.readValue(jobJson, GenerateReportDTO.class);

            // Fetch the Application and Report
            Application app = applicationService.getApplicationByAlias(generateReportDTO.getData().getApplicationName());
            if (app == null) {
                throw new EntityNotFoundException("Application", generateReportDTO.getData().getApplicationName());
            }

            Optional<Report> optionalReport = app.getReports().stream()
                    .filter(rep -> generateReportDTO.getData().getReportName().equals(rep.getAlias()))
                    .findFirst();

            if (optionalReport.isEmpty()) {
                throw new EntityNotFoundException("Report", generateReportDTO.getData().getReportName());
            }

            Report report = optionalReport.get();
            DestinationConnection destination = report.getDestinationConnection();
            if (destination == null) {
                throw new EntityNotFoundException("DestinationConnection", "Destination connection not found for report.");
            }

            // Ensure application and destination are managed
            Application managedApp = applicationRepository.findById(app.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Application", app.getId()));

            DestinationConnection managedDestination = destinationConnectionRepository.findById(destination.getId())
                    .orElseThrow(() -> new EntityNotFoundException("DestinationConnection", destination.getId()));

            // Create a new Request entity
            Request request = new Request();
            request.setReportName(generateReportDTO.getData().getReportName());
            request.setParams(generateReportDTO.getData().getParameterValues().values().toArray(new String[0]));
            request.setApplication(managedApp);
            request.setDestination_connection(managedDestination);
            request.setStatus(RequestStatus.valueOf("inprogress"));

            // Save or update the request
            requestService.saveOrUpdateRequest(request);

            // Generate the report
            ResponseEntity<String> response = miscService.generateReport(generateReportDTO);
            if (response.getStatusCode().is2xxSuccessful()) {
                request.setStatus(RequestStatus.valueOf("successful"));
                request.setReportLink(response.getBody());
            } else {
                request.setStatus(RequestStatus.valueOf("failed"));
            }

            // Update the request in the database
            requestService.saveOrUpdateRequest(request);

            logger.info("Report Generation Status: {}", request.getStatus());
        } catch (Exception e) {
            logger.error("Error Processing Job: {}", e.getMessage(), e);
        }
    }


//    private Request mapGenerateReportDTOToRequest(GenerateReportDTO generateReportDTO) {
//
//        return request;
//    }
}
