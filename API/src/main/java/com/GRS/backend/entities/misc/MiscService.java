package com.GRS.backend.entities.misc;

import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationService;
import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.GenerateReportDTO;
import com.GRS.backend.utilities.DatabaseUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MiscService {

    @Autowired
    private ApplicationService applicationService;

    public Object generateReport(GenerateReportDTO generateReportDTO) {
        Application app = applicationService.getApplicationByAlias(generateReportDTO.getData().getApplicationName());

        Optional<Report> optionalReport = app.getReports().stream()
                .filter(rep -> generateReportDTO.getData().getReportName().equals(rep.getAlias()))
                .findFirst();

        if (!optionalReport.isPresent()) {
            throw new EntityNotFoundException("Report", generateReportDTO.getData().getReportName());
        }

        Report report = optionalReport.get();

        SourceConnection source = report.getSourceConnection();

        Object response = DatabaseUtilities.callStoredProcedureOnDatabase(source, report, generateReportDTO.getData().getParameterValues());

        return response;

    }
}
