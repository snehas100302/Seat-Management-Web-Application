package com.sneha.seatmgmtapp.controller;

import com.sneha.seatmgmtapp.dto.request.DocumentChecklistRequest;
import com.sneha.seatmgmtapp.dto.response.DocumentChecklistResponse;
import com.sneha.seatmgmtapp.enums.DocumentStatus;
import com.sneha.seatmgmtapp.service.DocumentChecklistService;
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
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Tag(name = "Document Checklist", description = "Document verification management")
public class DocumentChecklistController {

    private final DocumentChecklistService documentChecklistService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Add a document to applicant's checklist")
    public ResponseEntity<ApiResponseBody<DocumentChecklistResponse>> create(@Valid @RequestBody DocumentChecklistRequest request) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.CREATED.value(), "Document added", documentChecklistService.create(request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Get document by ID")
    public ResponseEntity<ApiResponseBody<DocumentChecklistResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Document fetched", documentChecklistService.getById(id)));
    }

    @GetMapping("/applicant/{applicantId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Get all documents for an applicant")
    public ResponseEntity<ApiResponseBody<List<DocumentChecklistResponse>>> getByApplicantId(@PathVariable Long applicantId) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Documents fetched", documentChecklistService.getByApplicantId(applicantId)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Update document status (PENDING / SUBMITTED / VERIFIED)")
    public ResponseEntity<ApiResponseBody<DocumentChecklistResponse>> updateStatus(
            @PathVariable Long id, @RequestParam DocumentStatus status) {
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Document status updated", documentChecklistService.updateStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADMISSION_OFFICER')")
    @Operation(summary = "Delete a document from checklist")
    public ResponseEntity<ApiResponseBody<String>> delete(@PathVariable Long id) {
        documentChecklistService.delete(id);
        return ResponseEntity.ok(ApiResponseBody.success(HttpStatus.OK.value(), "Document deleted", ""));
    }
}

