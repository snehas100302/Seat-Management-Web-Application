package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.SeatAllocationRequest;
import com.sneha.seatmgmtapp.dto.response.AdmissionResponse;
import com.sneha.seatmgmtapp.service.AdmissionService;
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
@RequestMapping("/api/admissions")
@RequiredArgsConstructor
@Tag(name = "Admission", description = "Seat allocation and admission management")
public class AdmissionController {

    private final AdmissionService admissionService;

    @PostMapping("/allocate")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Allocate a seat for an applicant")
    public ResponseEntity<ApiResponseBody<AdmissionResponse>> allocateSeat(@Valid @RequestBody SeatAllocationRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Seat allocated", admissionService.allocateSeat(request)));
    }

    @PatchMapping("/{id}/verify-documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Mark documents as verified for an admission")
    public ResponseEntity<ApiResponseBody<AdmissionResponse>> verifyDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Documents verified", admissionService.verifyDocuments(id)));
    }

    @PatchMapping("/{id}/mark-fee-paid")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Mark fee as paid for an admission")
    public ResponseEntity<ApiResponseBody<AdmissionResponse>> markFeePaid(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Fee marked as paid", admissionService.markFeePaid(id)));
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Confirm admission and generate admission number")
    public ResponseEntity<ApiResponseBody<AdmissionResponse>> confirmAdmission(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Admission confirmed", admissionService.confirmAdmission(id)));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Cancel an admission and release the seat")
    public ResponseEntity<ApiResponseBody<AdmissionResponse>> cancelAdmission(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Admission cancelled", admissionService.cancelAdmission(id)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT')")
    @Operation(summary = "Get admission by ID")
    public ResponseEntity<ApiResponseBody<AdmissionResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Admission fetched", admissionService.getById(id)));
    }

    @GetMapping("/applicant/{applicantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Get admission by applicant ID")
    public ResponseEntity<ApiResponseBody<AdmissionResponse>> getByApplicantId(@PathVariable Long applicantId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Admission fetched", admissionService.getByApplicantId(applicantId)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT')")
    @Operation(summary = "Get all admissions")
    public ResponseEntity<ApiResponseBody<List<AdmissionResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Admissions fetched", admissionService.getAll()));
    }

    @GetMapping("/program/{programId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT')")
    @Operation(summary = "Get admissions by program ID")
    public ResponseEntity<ApiResponseBody<List<AdmissionResponse>>> getByProgramId(@PathVariable Long programId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Admissions fetched", admissionService.getByProgramId(programId)));
    }

    @GetMapping("/fee-pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT')")
    @Operation(summary = "Get admissions with pending fee")
    public ResponseEntity<ApiResponseBody<List<AdmissionResponse>>> getFeePendingList() {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Fee pending list fetched", admissionService.getFeePendingList()));
    }
}

