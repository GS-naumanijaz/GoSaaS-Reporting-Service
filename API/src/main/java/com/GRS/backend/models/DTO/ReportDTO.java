package com.GRS.backend.models.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportDTO {

    private int id;
    private String alias;
    private String description;

    public ReportDTO(int id, String alias, String description) {
        this.id = id;
        this.alias = alias;
        this.description = description;
    }
}