package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.ApplicantRequest;
import com.sneha.seatmgmtapp.dto.response.ApplicantResponse;
import com.sneha.seatmgmtapp.service.ApplicantService;
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
@RequestMapping("/api/applicants")
@RequiredArgsConstructor
@Tag(name = "Applicant", description = "Applicant management")
public class ApplicantController {

    private final ApplicantService applicantService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Create a new applicant")
    public ResponseEntity<ApiResponseBody<ApplicantResponse>> create(@Valid @RequestBody ApplicantRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Applicant created", applicantService.create(request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Get applicant by ID")
    public ResponseEntity<ApiResponseBody<ApplicantResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Applicant fetched", applicantService.getById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Get all applicants")
    public ResponseEntity<ApiResponseBody<List<ApplicantResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Applicants fetched", applicantService.getAll()));
    }

    @GetMapping("/program/{programId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Get applicants by program ID")
    public ResponseEntity<ApiResponseBody<List<ApplicantResponse>>> getByProgramId(@PathVariable Long programId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Applicants fetched", applicantService.getByProgramId(programId)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Update an applicant")
    public ResponseEntity<ApiResponseBody<ApplicantResponse>> update(@PathVariable Long id, @Valid @RequestBody ApplicantRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Applicant updated", applicantService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Delete an applicant (soft delete)")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        applicantService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Applicant deleted", ""));
    }
}

