package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.DepartmentRequest;
import com.sneha.seatmgmtapp.dto.response.DepartmentResponse;
import com.sneha.seatmgmtapp.service.DepartmentService;
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
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@Tag(name = "Department", description = "Department master setup")
public class DepartmentController {

    private final DepartmentService departmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new department")
    public ResponseEntity<ApiResponseBody<DepartmentResponse>> create(@Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Department created", departmentService.create(request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID")
    public ResponseEntity<ApiResponseBody<DepartmentResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Department fetched", departmentService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all departments")
    public ResponseEntity<ApiResponseBody<List<DepartmentResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Departments fetched", departmentService.getAll()));
    }

    @GetMapping("/campus/{campusId}")
    @Operation(summary = "Get departments by campus ID")
    public ResponseEntity<ApiResponseBody<List<DepartmentResponse>>> getByCampusId(@PathVariable Long campusId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Departments fetched", departmentService.getByCampusId(campusId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a department")
    public ResponseEntity<ApiResponseBody<DepartmentResponse>> update(@PathVariable Long id, @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Department updated", departmentService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a department (soft delete)")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        departmentService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Department deleted", ""));
    }
}

