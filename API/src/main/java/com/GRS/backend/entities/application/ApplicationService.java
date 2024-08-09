package com.GRS.backend.entities.application;

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
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public Page<Application> getAllApplications(String search, String searchBy, Pageable pageable, String status) {

        Specification<Application> spec = Specification.where(ApplicationSpecification.isNotDeleted());

        if (search != null && !search.isEmpty()) {
            return applicationRepository.findAll(ApplicationSpecification.containsTextIn(searchBy, search), pageable);
        }

        if (status != null) {
            spec = spec.and(ApplicationSpecification.hasStatus(status));
        }

        return applicationRepository.findAll(spec, pageable);
    }

    public Optional<Application> getApplicationById(int appId) {
        return applicationRepository.findById(appId);
    }

    public Application addApplication(Application application) {
        return applicationRepository.save(application);
    }

    public Application updateApplication(int appId, Application application) {
        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent()) {
            Application existingApplication = existingApplicationOpt.get();

            FieldUpdater.updateField(existingApplication, "name", application);
            FieldUpdater.updateField(existingApplication, "description", application);
            FieldUpdater.updateField(existingApplication, "is_active", application);

            return applicationRepository.save(existingApplication);
        } else {
            throw new EntityNotFoundException("Application", appId);
        }
    }

    public void deleteApplication(int appId) {
        Optional<Application> existingApplicationOpt = applicationRepository.findById(appId);

        if (existingApplicationOpt.isPresent() && !existingApplicationOpt.get().getIs_deleted()) {
            Application existingApplication = existingApplicationOpt.get();

            existingApplication.setIs_deleted(true);
            existingApplication.setDeletion_date(LocalDateTime.now());

            applicationRepository.save(existingApplication);
        } else {
            throw new EntityNotFoundException("Application", appId);
        }
    }
}
