package com.GRS.backend.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Page<Report> getAllReports(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return reportRepository.findAll(ReportSpecification.containsTextInAliasOrDescription(search), pageable);
        }
        return reportRepository.findAll(pageable);
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
            if (report.getStoredProcedure() != null) {
                reportToUpdate.setStoredProcedure(report.getStoredProcedure());
            }
            if (report.getParams() != null) {
                reportToUpdate.setParams(report.getParams());
            }
            if (report.getXSLTemplate() != null) {
                reportToUpdate.setXSLTemplate(report.getXSLTemplate());
            }
            if (report.getIsDeleted() != null) {
                reportToUpdate.setIsDeleted(report.getIsDeleted());
            }
            if (report.getIsPinned() != null) {
                reportToUpdate.setIsPinned(report.getIsPinned());
            }
            if (report.getCreationDate() != null) {
                reportToUpdate.setCreationDate(report.getCreationDate());
            }
            if (report.getDeletionDate() != null) {
                reportToUpdate.setDeletionDate(report.getDeletionDate());
            }
            if (report.getUpdationDate() != null) {
                reportToUpdate.setUpdationDate(report.getUpdationDate());
            }
            return reportRepository.save(reportToUpdate);
        }
        return null;
    }

    public void deleteReport(int reportId) {
        reportRepository.deleteById(reportId);
    }
}
