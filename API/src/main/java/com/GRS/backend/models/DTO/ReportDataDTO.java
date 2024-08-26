package com.GRS.backend.models.DTO;

import java.util.Map;

public class ReportDataDTO {
    private String applicationName;
    private String reportName;
    private Map<String, String> parameterValues;

    // Constructors, Getters, and Setters

    public ReportDataDTO() {
    }

    public ReportDataDTO(String applicationName, String reportName, Map<String, String> parameterValues) {
        this.applicationName = applicationName;
        this.reportName = reportName;
        this.parameterValues = parameterValues;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public Map<String, String> getParameterValues() {
        return parameterValues;
    }

    public void setParameterValues(Map<String, String> parameterValues) {
        this.parameterValues = parameterValues;
    }
}
