package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.AcademicYearRequest;
import com.sneha.seatmgmtapp.dto.response.AcademicYearResponse;
import com.sneha.seatmgmtapp.service.AcademicYearService;
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
@RequestMapping("/api/academic-years")
@RequiredArgsConstructor
@Tag(name = "Academic Year", description = "Academic year master setup")
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new academic year")
    public ResponseEntity<ApiResponseBody<AcademicYearResponse>> create(@Valid @RequestBody AcademicYearRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Academic year created", academicYearService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get academic year by ID")
    public ResponseEntity<ApiResponseBody<AcademicYearResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Academic year fetched", academicYearService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all academic years")
    public ResponseEntity<ApiResponseBody<List<AcademicYearResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Academic years fetched", academicYearService.getAll()));
    }

    @GetMapping("/current")
    @Operation(summary = "Get current academic year")
    public ResponseEntity<ApiResponseBody<AcademicYearResponse>> getCurrent() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Current academic year fetched", academicYearService.getCurrent()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an academic year")
    public ResponseEntity<ApiResponseBody<AcademicYearResponse>> update(@PathVariable Long id, @Valid @RequestBody AcademicYearRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Academic year updated", academicYearService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an academic year (soft delete)")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        academicYearService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Academic year deleted", ""));
    }
}

