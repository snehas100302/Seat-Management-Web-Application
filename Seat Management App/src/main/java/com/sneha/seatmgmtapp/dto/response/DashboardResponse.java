package com.sneha.seatmgmtapp.dto.response;

import lombok.*;

import java.util.List;

/**
 * Dashboard summary response for management view.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Integer totalIntake;
    private Integer totalAdmitted;
    private Integer totalRemaining;
    private List<QuotaSummary> quotaSummaries;
    private List<ProgramSummary> programSummaries;
    private Long pendingDocumentsCount;
    private Long pendingFeeCount;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuotaSummary {
        private String quotaType;
        private Integer totalSeats;
        private Integer filledSeats;
        private Integer availableSeats;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProgramSummary {
        private Long programId;
        private String programName;
        private String courseType;
        private Integer totalIntake;
        private Integer totalAdmitted;
        private Integer remaining;
    }
}

