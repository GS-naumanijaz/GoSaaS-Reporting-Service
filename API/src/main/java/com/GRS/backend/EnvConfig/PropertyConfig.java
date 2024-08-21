package com.GRS.backend.EnvConfig;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PropertyConfig {

    @Autowired
    private Dotenv dotenv;

    @PostConstruct
    public void init() {
        System.setProperty("CLIENT_ID", dotenv.get("CLIENT_ID"));
        System.setProperty("CLIENT_SECRET", dotenv.get("CLIENT_SECRET"));
        System.setProperty("LOCAL_FRONTEND_URL", dotenv.get("LOCAL_FRONTEND_URL"));
        System.setProperty("HOST_FRONTEND_URL", dotenv.get("HOST_FRONTEND_URL"));
    }
}
