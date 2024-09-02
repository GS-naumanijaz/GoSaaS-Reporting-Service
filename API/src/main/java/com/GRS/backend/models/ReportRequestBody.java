    package com.GRS.backend.models;

    import com.GRS.backend.entities.report.Report;

    public class ReportRequestBody {
        public Report report;
        public Integer sourceId;
        public Integer destinationId;

        public ReportRequestBody(Report report, Integer sourceId, Integer destinationId) {
            this.report = report;
            this.sourceId = sourceId;
            this.destinationId = destinationId;
        }
    }
