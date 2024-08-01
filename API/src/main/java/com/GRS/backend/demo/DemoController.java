package com.GRS.backend.demo;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
public class DemoController {

    @GetMapping("/check-auth")
    public ResponseEntity<Map<String, Boolean>> checkAuth(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken);
        Map<String, Boolean> response = Collections.singletonMap("authenticated", isAuthenticated);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/demo")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello OAuth2, youve logged in");
    }

    @GetMapping("/openPage")
    public ResponseEntity<String> openPage() {
        return ResponseEntity.ok("Should be accessable without login");
    }
}