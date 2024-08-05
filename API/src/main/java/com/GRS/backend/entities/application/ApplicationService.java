package com.GRS.backend.entities.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public Page<Application> getAllApplications(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return applicationRepository.findAll(ApplicationSpecification.containsTextInNameOrDescription(search), pageable);
        }
        return applicationRepository.findAll(pageable);
    }

    public Optional<Application> getApplicationById(int appId) {
        return applicationRepository.findById(appId);
    }

    public Application addApplication(Application application) {
        return applicationRepository.save(application);
    }

    public Application updateApplication(int appId, Application application) {
        Optional<Application> existingApplication = applicationRepository.findById(appId);

        if (existingApplication.isPresent()) {
            Application appToUpdate = existingApplication.get();

            if (application.getName() != null) {
                appToUpdate.setName(application.getName());
            }
            if (application.getDescription() != null) {
                appToUpdate.setDescription(application.getDescription());
            }
            if (application.getIs_active() != null) {
                appToUpdate.setIs_active(application.getIs_active());
            }
            if (application.getCreated_by() != null) {
                appToUpdate.setCreated_by(application.getCreated_by());
            }
            if (application.getDeleted_by() != null) {
                appToUpdate.setDeleted_by(application.getDeleted_by());
            }


            return applicationRepository.save(appToUpdate);
        }
        return null;
    }

    public void deleteApplication(int appId) {
        applicationRepository.deleteById(appId);
    }
}
