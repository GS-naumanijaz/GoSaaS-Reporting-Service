package com.GRS.backend.models.DTO;

import com.GRS.backend.entities.application.Application;

public class GenerateReportDTO {
    private String name;
    private ReportDataDTO data;

    // Constructors, Getters, and Setters

    public GenerateReportDTO() {
    }

    public GenerateReportDTO(String name, ReportDataDTO data) {
        this.name = name;
        this.data = data;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ReportDataDTO getData() {
        return data;
    }

    public void setData(ReportDataDTO data) {
        this.data = data;
    }

}
