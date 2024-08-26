package com.GRS.backend.reportGeneration;

import com.GRS.backend.models.DTO.GenerateReportDTO;
import com.GRS.backend.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class MiscController {

    @Autowired
    private MiscService miscService;

    @PostMapping("/generateReport")
    public ResponseEntity<Object> generateReport(@RequestBody GenerateReportDTO generateReportDTO) {

        Object response = miscService.generateReport(generateReportDTO);

        return Response.responseBuilder("Report Generated Successfully", HttpStatus.OK, response);
    }
}
