package com.GRS.backend.resolver;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;


@Component
public class RequestInterceptor implements HandlerInterceptor {

    Logger logger = LoggerFactory.getLogger(RequestInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Pre-handle logic if needed
        return true; // Continue with the request
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        // Post-handle logic if needed
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) throws Exception {
        // Log the message after the request has been processed
        int status = response.getStatus();

        if (status >= 200 && status < 300) {
            logger.info("API call completed successfully. METHOD: " + request.getMethod() + ", URI: " + request.getRequestURI() + ", Status: " + status);
        } else {
            logger.error("API call completed with failure. METHOD: " + request.getMethod() + ", URI: " + request.getRequestURI() + ", Status: " + status);
        }
    }
}
