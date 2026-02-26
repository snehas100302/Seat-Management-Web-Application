package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.ProgramRequest;
import com.sneha.seatmgmtapp.dto.response.ProgramResponse;
import com.sneha.seatmgmtapp.service.ProgramService;
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
@RequestMapping("/api/programs")
@RequiredArgsConstructor
@Tag(name = "Program", description = "Program/Branch master setup")
public class ProgramController {

    private final ProgramService programService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new program")
    public ResponseEntity<ApiResponseBody<ProgramResponse>> create(@Valid @RequestBody ProgramRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Program created", programService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get program by ID")
    public ResponseEntity<ApiResponseBody<ProgramResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Program fetched", programService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all programs")
    public ResponseEntity<ApiResponseBody<List<ProgramResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Programs fetched", programService.getAll()));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Get programs by department ID")
    public ResponseEntity<ApiResponseBody<List<ProgramResponse>>> getByDepartmentId(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Programs fetched", programService.getByDepartmentId(departmentId)));
    }

    @GetMapping("/academic-year/{academicYearId}")
    @Operation(summary = "Get programs by academic year ID")
    public ResponseEntity<ApiResponseBody<List<ProgramResponse>>> getByAcademicYearId(@PathVariable Long academicYearId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Programs fetched", programService.getByAcademicYearId(academicYearId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a program")
    public ResponseEntity<ApiResponseBody<ProgramResponse>> update(@PathVariable Long id, @Valid @RequestBody ProgramRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Program updated", programService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a program (soft delete)")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        programService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Program deleted", ""));
    }
}

