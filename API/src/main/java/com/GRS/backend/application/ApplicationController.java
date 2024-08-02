package com.GRS.backend.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @RequestMapping("/applications")
    public List<Application> getAllTopics() {
        return applicationService.getAllApplications();
    }

    @RequestMapping(method = RequestMethod.POST, value = "/applications")
    public void addApplication(@RequestBody Application application) {
        applicationService.addApplication(application);
    }

}
