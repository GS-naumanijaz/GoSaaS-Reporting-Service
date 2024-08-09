package com.GRS.backend.entities.report;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.FieldUpdater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ApplicationRepository applicationRepository;


    public Page<Report> getAllReports(int appId, String search, String searchBy, Pageable pageable) {


        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIs_deleted()) {
            Specification<Report> spec = Specification.where(BaseSpecification.belongsTo("application", appId));

            if (search != null && !search.isEmpty()) {
                spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
            }
            return reportRepository.findAll(spec, pageable);
        }

        throw new EntityNotFoundException("Application", appId);
    }

    public Optional<Report> getReportById(int reportId) {
        return reportRepository.findById(reportId);
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
            FieldUpdater.updateField(existingReport, "stored_procedure", report);
            FieldUpdater.updateField(existingReport, "params", report);
            FieldUpdater.updateField(existingReport, "xsl_template", report);
            FieldUpdater.updateField(existingReport, "is_pinned", report);

            return reportRepository.save(existingReport);
        } else {
            throw new EntityNotFoundException("Report", reportId);
        }
    }

    public void deleteReport(int reportId) {
        Optional<Report> existingReportOpt = reportRepository.findById(reportId);

        if (existingReportOpt.isPresent() && !existingReportOpt.get().getIs_deleted()) {
            Report existingReport = existingReportOpt.get();

            existingReport.setIs_deleted(true);
            existingReport.setDeletion_date(LocalDateTime.now());

            reportRepository.save(existingReport);
        } else {
            throw new EntityNotFoundException("Report", reportId);
        }
    }
}
