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
        System.setProperty("FRONTEND_URL", dotenv.get("FRONTEND_URL"));
    }
}
