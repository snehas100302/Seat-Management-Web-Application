package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.response.DashboardResponse;

public interface DashboardService {
    /**
     * Get dashboard summary across all programs or filtered by academic year.
     */
    DashboardResponse getDashboard(Long academicYearId);
}

