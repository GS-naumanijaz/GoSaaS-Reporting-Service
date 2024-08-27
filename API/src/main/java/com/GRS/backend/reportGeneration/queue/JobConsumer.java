package com.GRS.backend.reportGeneration.queue;

import com.GRS.backend.models.DTO.GenerateReportDTO;
import com.GRS.backend.reportGeneration.MiscService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobConsumer {

    @Autowired
    private MiscService miscService;

    Logger logger = LoggerFactory.getLogger(JobConsumer.class);

    @RabbitListener(queues = "reportQueue")
    public void receiveJob(String job) {
        logger.info("Received Job: {}", job);
        GenerateReportDTO generateReportDTO = convertJsonToGenerateReportDTO(job);
        ResponseEntity<String> response = miscService.generateReport(generateReportDTO);
        logger.info("Report Generated Successfully: {}", response.getBody());
    }

    @Transactional
    private GenerateReportDTO convertJsonToGenerateReportDTO(String json) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(json, GenerateReportDTO.class);
        } catch (JsonProcessingException e) {
            logger.error("Error converting JSON to GenerateReportDTO: {}", e.getMessage());
            return null;
        }
    }
}

