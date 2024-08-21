package com.GRS.backend.entities.report;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.request.Request;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.ReportDTO;
import com.GRS.backend.models.DTO.SourceConnectionDTO;
import com.GRS.backend.utilities.FieldUpdater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ApplicationRepository applicationRepository;


    public Page<Report> getAllReports(int appId, String search, String searchBy, Pageable pageable) {

        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIsDeleted()) {
            Specification<Report> spec = Specification.where(BaseSpecification.belongsTo("application", appId));

            if (search != null && !search.isEmpty()) {
                // Check if the searchBy field is "source" or "destination"
                if ("sourceConnection".equals(searchBy)) {
                    spec = spec.and(BaseSpecification.containsTextIn("sourceConnection.alias", search));
                } else if ("destinationConnection".equals(searchBy)) {
                    spec = spec.and(BaseSpecification.containsTextIn("destinationConnection.alias", search));
                } else {
                    spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
                }
            }
            return reportRepository.findAll(spec, pageable);
        }

        throw new EntityNotFoundException("Application", appId);
    }


    public Report getReportById(int reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        if (report.isPresent()) {
            return report.get();
        } else {
            throw new EntityNotFoundException("Report", reportId);
        }
    }

    public Report addReport(Report report) {
        return reportRepository.save(report);
    }

    public Report updateReport(int reportId, Report report) {
        Optional<Report> existingReportOpt = reportRepository.findById(reportId);

        if (existingReportOpt.isPresent()) {
            Report existingReport = existingReportOpt.get();

            FieldUpdater.updateField(existingReport, "alias", report);
            FieldUpdater.updateField(existingReport, "description", report);
            FieldUpdater.updateField(existingReport, "storedProcedure", report);
            FieldUpdater.updateField(existingReport, "params", report);
            FieldUpdater.updateField(existingReport, "xslTemplate", report);
            FieldUpdater.updateField(existingReport, "isPinned", report);
            FieldUpdater.updateField(existingReport, "isActive", report);


            return reportRepository.save(existingReport);
        } else {
            throw new EntityNotFoundException("Report", reportId);
        }
    }

    public void deleteReport(int reportId) {
        Optional<Report> existingReportOpt = reportRepository.findById(reportId);

        if (existingReportOpt.isPresent() && !existingReportOpt.get().getIsDeleted()) {
            Report existingReport = existingReportOpt.get();

            existingReport.setIsDeleted(true);
            existingReport.setDeletionDate(LocalDateTime.now());

            reportRepository.save(existingReport);
        } else {
            throw new EntityNotFoundException("Report", reportId);
        }
    }

    public Integer bulkDeleteReports(List<Integer> reportIds) {
        Integer deletedCount = 0;

        for (Integer id : reportIds) {
            Optional<Report> optionalConnection = reportRepository.findById(id);
            if (optionalConnection.isPresent()) {
                Report existingSourceConnection = optionalConnection.get();

                if (!existingSourceConnection.getIsDeleted()) {
                    existingSourceConnection.setIsDeleted(true);
                    existingSourceConnection.setDeletionDate(LocalDateTime.now());

                    reportRepository.save(existingSourceConnection);
                    deletedCount++;
                }
            }
        }
        return deletedCount;
    }

    public List<ReportDTO> getAllPinnerReports() {
        Specification<Report> spec = Specification.where(ReportSpecification.isPinned()).and(ReportSpecification.isNotDeleted());

        return reportRepository.findAll(spec).stream()
                .map(report -> new ReportDTO(report.getId(), report.getAlias(), report.getDescription()))
                .collect(Collectors.toList());
    }
}
