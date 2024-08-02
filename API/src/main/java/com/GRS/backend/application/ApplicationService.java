package com.GRS.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<Application> getAllApplications() {
        List<Application> applications = new ArrayList<>();
        applicationRepository.findAll().forEach(applications::add);
        return applications;
    }

    public void addApplication(Application application) {
        applicationRepository.save(application);
    }

}
