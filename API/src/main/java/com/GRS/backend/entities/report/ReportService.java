package com.GRS.backend.entities.report;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Page<Report> getAllReports(String search, String searchBy, Pageable pageable) {
        Specification<Report> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            spec = spec.and(BaseSpecification.containsTextIn(searchBy, search));
        }
        return reportRepository.findAll(spec, pageable);
    }

    public Optional<Report> getReportById(int reportId) {
        return reportRepository.findById(reportId);
    }

    public Report addReport(Report report) {
        return reportRepository.save(report);
    }

    public Report updateReport(int reportId, Report report) {
        Optional<Report> existingReport = reportRepository.findById(reportId);
        if (existingReport.isPresent()) {
            Report reportToUpdate = existingReport.get();
            if (report.getAlias() != null) {
                reportToUpdate.setAlias(report.getAlias());
            }
            if (report.getDescription() != null) {
                reportToUpdate.setDescription(report.getDescription());
            }
            if (report.getStored_procedure() != null) {
                reportToUpdate.setStored_procedure(report.getStored_procedure());
            }
            if (report.getParams() != null) {
                reportToUpdate.setParams(report.getParams());
            }
            if (report.getXsl_template() != null) {
                reportToUpdate.setXsl_template(report.getXsl_template());
            }
            if (report.getIs_deleted() != null) {
                reportToUpdate.setIs_deleted(report.getIs_deleted());
            }
            if (report.getIs_pinned() != null) {
                reportToUpdate.setIs_pinned(report.getIs_pinned());
            }
            if (report.getCreation_date() != null) {
                reportToUpdate.setCreation_date(report.getCreation_date());
            }
            if (report.getDeletion_date() != null) {
                reportToUpdate.setDeletion_date(report.getDeletion_date());
            }
            if (report.getUpdation_date() != null) {
                reportToUpdate.setUpdation_date(report.getUpdation_date());
            }
            return reportRepository.save(reportToUpdate);
        }
        return null;
    }

    public void deleteReport(int reportId) {
        reportRepository.deleteById(reportId);
    }
}
