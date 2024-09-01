package com.GRS.backend.entities.application;

import com.GRS.backend.entities.report.Report;
import com.GRS.backend.entities.source_connection.SourceConnection;
import com.GRS.backend.exceptionHandler.exceptions.EntityNotFoundException;
import com.GRS.backend.utilities.FieldUpdater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public Page<Application> getAllApplications(String search, String searchBy, Pageable pageable, String status, LocalDate startDate, LocalDate endDate) {

        Specification<Application> spec = Specification.where(ApplicationSpecification.isNotDeleted());

        if (search != null && !search.isEmpty()) {
            spec = spec.and(ApplicationSpecification.containsTextIn(searchBy, search));
        }

        if (status != null) {
            spec = spec.and(ApplicationSpecification.hasStatus(status));
        }

        // Apply the date filter
        spec = spec.and(ApplicationSpecification.betweenDates("updatedAt", startDate, endDate));

        return applicationRepository.findAll(spec, pageable);
    }

    public Application getApplicationById(int appId) {
        Optional<Application> app = applicationRepository.findById(appId);
        if (app.isPresent()) {
            return app.get();
        } else {
            throw new EntityNotFoundException("Application", appId);
        }
    }

    @Transactional
    public Application getApplicationByAlias(String appAlias) {
        Optional<Application> app = applicationRepository.findByAlias(appAlias);
        if (app.isPresent()) {
            return app.get();
        } else {
            throw new EntityNotFoundException("Application", appAlias);
        }
    }

    public Application addApplication(Application application, String username) {
        application.setCreatedBy(username);
        application.setLastUpdatedBy(username);
        return applicationRepository.save(application);
    }

    public Application updateApplication(int appId, Application application, String username) {
        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent()) {
            Application existingApplication = existingApplicationOpt.get();

            FieldUpdater.updateField(existingApplication, "alias", application);
            FieldUpdater.updateField(existingApplication, "description", application);
            FieldUpdater.updateField(existingApplication, "isActive", application);

            existingApplication.setLastUpdatedBy(username);

            return applicationRepository.save(existingApplication);
        } else {
            throw new EntityNotFoundException("Application", appId);
        }
    }

    public List<Application> bulkUpdateIsActive(List<Integer> ApplicationIds, boolean isActive, String username) {
        List<Application> applicationList = new ArrayList<>();

        for (Integer id : ApplicationIds) {
            Optional<Application> optionalConnection = applicationRepository.findById(id);
            if (optionalConnection.isPresent()) {
                Application connection = optionalConnection.get();
                connection.setIsActive(isActive);
                connection.setLastUpdatedBy(username);
                applicationList.add(applicationRepository.save(connection));
            }
        }

        return applicationList;
    }

    public Application deleteApplication(int appId, String username) {
        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIsDeleted()) {
            Application existingApplication = existingApplicationOpt.get();

            existingApplication.setIsDeleted(true);
            existingApplication.setDeletionDate(LocalDateTime.now());
            existingApplication.setDeletedBy(username);

            applicationRepository.save(existingApplication);
            return existingApplication;
        } else {
            throw new EntityNotFoundException("Application", appId);
        }
    }

    public List<String> bulkDeleteApplications(List<Integer> applicationIds, String username) {
        List<String> deletedApps = new ArrayList<>();

        for (Integer id : applicationIds) {
            Optional<Application> optionalConnection = applicationRepository.findById(id);
            if (optionalConnection.isPresent()) {
                Application existingApplication = optionalConnection.get();

                if (!existingApplication.getIsDeleted()) {
                    existingApplication.setDeletedBy(username);
                    existingApplication.setIsDeleted(true);
                    existingApplication.setDeletionDate(LocalDateTime.now());
                    applicationRepository.save(existingApplication);
                    deletedApps.add(existingApplication.getAlias());
                }
            }
        }
        return deletedApps;
    }

    public List<Number> getAllApplicationIds() {
        List<Application> allApps = applicationRepository.findAll();
        List<Number> allAppIds = new ArrayList<>();
        for (Application app : allApps) {
            allAppIds.add(app.getId());
        }
        return allAppIds;
    }
}
