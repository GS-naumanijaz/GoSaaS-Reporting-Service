package com.GRS.backend.entities.report;

import com.GRS.backend.base_models.BaseSpecification;
import com.GRS.backend.entities.application.Application;
import com.GRS.backend.entities.application.ApplicationRepository;
import com.GRS.backend.entities.destination_connection.DestinationConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.models.DTO.ReportDTO;
import com.GRS.backend.reportGeneration.S3ClientProvider;
import com.GRS.backend.utilities.FieldUpdater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import javax.print.attribute.standard.Destination;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    private final S3ClientProvider s3ClientProvider;

    public ReportService(S3ClientProvider s3ClientProvider) {
        this.s3ClientProvider = s3ClientProvider;
    }

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

    public Report deleteReport(int reportId) {
        Optional<Report> existingReportOpt = reportRepository.findById(reportId);

        if (existingReportOpt.isPresent() && !existingReportOpt.get().getIsDeleted()) {
            Report existingReport = existingReportOpt.get();

            existingReport.setIsDeleted(true);
            existingReport.setDeletionDate(LocalDateTime.now());

            reportRepository.save(existingReport);
            return existingReport;
        } else {
            throw new EntityNotFoundException("Report", reportId);
        }
    }

    public List<String> bulkDeleteReports(List<Integer> reportIds) {
        List<String> deletedIds = new ArrayList<>();

        for (Integer id : reportIds) {
            Optional<Report> optionalReport = reportRepository.findById(id);
            if (optionalReport.isPresent()) {
                Report existingReport = optionalReport.get();

                if (!existingReport.getIsDeleted()) {
                    existingReport.setIsDeleted(true);
                    existingReport.setDeletionDate(LocalDateTime.now());

                    reportRepository.save(existingReport);
                    deletedIds.add(existingReport.getAlias());
                }
            }
        }
        return deletedIds;
    }

    public List<Report> getAllPinnedReports() {
        Specification<Report> spec = Specification.where(ReportSpecification.isPinned()).and(ReportSpecification.isNotDeleted());

        return  reportRepository.findAll(spec);
//        return reportRepository.findAll(spec).stream()
//                .map(report -> new ReportDTO(report.getId(), report.getAlias(), report.getDescription()))
//                .collect(Collectors.toList());
    }

    public ResponseEntity<Object> uploadFile(MultipartFile file, int reportId) {
        try {
            // Retrieve the report and destination connection details
            Report report = getReportById(reportId);
            DestinationConnection destination = report.getDestinationConnection();
            destination.decryptSecretKey();
            S3Client s3Client = s3ClientProvider.createS3Client(destination);

            // Define the folder path and file name
            String folderPath = "xsl-files/"; // Adjust as needed
            String fileName = folderPath + System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Create the S3 PutObjectRequest
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(destination.getBucketName())
                    .key(fileName)
                    .build();

            // Upload the file to S3
            PutObjectResponse putObjectResponse = s3Client.putObject(putObjectRequest,
                    RequestBody.fromBytes(file.getBytes()));

            // save to db

            report.setXslTemplate(fileName);
            destination.encryptSecretKey();
            reportRepository.save(report);


            // Return the file key path
                return ResponseEntity.ok().body("File uploaded successfully. File key: " + fileName);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }
}
