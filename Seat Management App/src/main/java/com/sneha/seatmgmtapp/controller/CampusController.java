package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.CampusRequest;
import com.sneha.seatmgmtapp.dto.response.CampusResponse;
import com.sneha.seatmgmtapp.service.CampusService;
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
@RequestMapping("/api/campuses")
@RequiredArgsConstructor
@Tag(name = "Campus", description = "Campus master setup")
public class CampusController {

    private final CampusService campusService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new campus")
    public ResponseEntity<ApiResponseBody<CampusResponse>> create(@Valid @RequestBody CampusRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Campus created", campusService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get campus by ID")
    public ResponseEntity<ApiResponseBody<CampusResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Campus fetched", campusService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all campuses")
    public ResponseEntity<ApiResponseBody<List<CampusResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Campuses fetched", campusService.getAll()));
    }

    @GetMapping("/institution/{institutionId}")
    @Operation(summary = "Get campuses by institution ID")
    public ResponseEntity<ApiResponseBody<List<CampusResponse>>> getByInstitutionId(@PathVariable Long institutionId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Campuses fetched", campusService.getByInstitutionId(institutionId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a campus")
    public ResponseEntity<ApiResponseBody<CampusResponse>> update(@PathVariable Long id, @Valid @RequestBody CampusRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Campus updated", campusService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a campus (soft delete)")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        campusService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Campus deleted", ""));
    }
}

