package com.GRS.backend.reportGeneration.queue;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JobProducer {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendJob(String job) {
        rabbitTemplate.convertAndSend("myExchange", "routingKey", job);
    }
}