package com.GRS.backend.reportGeneration.queue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobController {

    @Autowired
    private JobProducer jobProducer;

    @PostMapping("/createJob")
    public void createJob(@RequestBody String job) {
        jobProducer.sendJob(job);
    }
}
