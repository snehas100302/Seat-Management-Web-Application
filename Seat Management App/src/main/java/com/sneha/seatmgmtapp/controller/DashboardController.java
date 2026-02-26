package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.response.DashboardResponse;
import com.sneha.seatmgmtapp.service.DashboardService;
import com.sneha.seatmgmtapp.utils.ApiResponseBody;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dashboard and reporting")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT')")
    @Operation(summary = "Get dashboard summary with seat filling status")
    public ResponseEntity<ApiResponseBody<DashboardResponse>> getDashboard(
            @RequestParam(required = false) Long academicYearId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Dashboard fetched",
                dashboardService.getDashboard(academicYearId)));
    }
}

