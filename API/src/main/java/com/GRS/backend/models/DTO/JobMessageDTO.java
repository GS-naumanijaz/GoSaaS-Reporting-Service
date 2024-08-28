package com.GRS.backend.models.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class JobMessageDTO {

    private String name;

    @JsonProperty("data")
    private ReportDataDTO reportData;

    @Getter
    @Setter
    public static class ReportDataDTO {
        private String applicationName;
        private String reportName;

        @JsonProperty("parameterValues")
        private Map<String, String> parameterValues;
    }
}
