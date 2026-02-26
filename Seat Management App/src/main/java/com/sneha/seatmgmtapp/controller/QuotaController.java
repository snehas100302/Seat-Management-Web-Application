package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.QuotaRequest;
import com.sneha.seatmgmtapp.dto.response.QuotaResponse;
import com.sneha.seatmgmtapp.service.QuotaService;
import com.sneha.seatmgmtapp.utils.ApiResponseBody;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotas")
@RequiredArgsConstructor
@Tag(name = "Quota", description = "Seat quota management")
public class QuotaController {

    private final QuotaService quotaService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new quota for a program")
    public ResponseEntity<ApiResponseBody<QuotaResponse>> create(@Valid @RequestBody QuotaRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Quota created", quotaService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quota by ID")
    public ResponseEntity<ApiResponseBody<QuotaResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Quota fetched", quotaService.getById(id)));
    }

    @GetMapping("/program/{programId}")
    @Operation(summary = "Get all quotas for a program")
    public ResponseEntity<ApiResponseBody<List<QuotaResponse>>> getByProgramId(@PathVariable Long programId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Quotas fetched", quotaService.getByProgramId(programId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a quota")
    public ResponseEntity<ApiResponseBody<QuotaResponse>> update(@PathVariable Long id, @Valid @RequestBody QuotaRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Quota updated", quotaService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a quota (soft delete)")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        quotaService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Quota deleted", ""));
    }
}

