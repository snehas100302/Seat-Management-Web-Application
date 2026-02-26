package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.InstitutionRequest;
import com.sneha.seatmgmtapp.dto.response.InstitutionResponse;
import com.sneha.seatmgmtapp.service.InstitutionService;
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
@RequestMapping("/api/institutions")
@RequiredArgsConstructor
@Tag(name = "Institution", description = "Institution master setup")
public class InstitutionController {

    private final InstitutionService institutionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new institution")
    public ResponseEntity<ApiResponseBody<InstitutionResponse>> create(@Valid @RequestBody InstitutionRequest request) {
        InstitutionResponse response = institutionService.create(request);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Institution created", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get institution by ID")
    public ResponseEntity<ApiResponseBody<InstitutionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Institution fetched", institutionService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all institutions")
    public ResponseEntity<ApiResponseBody<List<InstitutionResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Institutions fetched", institutionService.getAll()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an institution")
    public ResponseEntity<ApiResponseBody<InstitutionResponse>> update(@PathVariable Long id, @Valid @RequestBody InstitutionRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Institution updated", institutionService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an institution (soft delete)")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        institutionService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Institution deleted", ""));
    }
}

