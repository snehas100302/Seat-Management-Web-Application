package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.SeatAllocationRequest;
import com.sneha.seatmgmtapp.dto.response.AdmissionResponse;

import java.util.List;

public interface AdmissionService {
    /**
     * Allocate a seat for the applicant under the specified quota.
     * Validates quota availability and locks the seat.
     */
    AdmissionResponse allocateSeat(SeatAllocationRequest request);

    /**
     * Mark documents as verified for the admission.
     */
    AdmissionResponse verifyDocuments(Long admissionId);

    /**
     * Mark fee as paid for the admission.
     */
    AdmissionResponse markFeePaid(Long admissionId);

    /**
     * Confirm admission: generates admission number.
     * Only allowed if fee is paid and documents verified.
     */
    AdmissionResponse confirmAdmission(Long admissionId);

    /**
     * Cancel an admission and release the seat back.
     */
    AdmissionResponse cancelAdmission(Long admissionId);

    AdmissionResponse getById(Long id);
    AdmissionResponse getByApplicantId(Long applicantId);
    List<AdmissionResponse> getAll();
    List<AdmissionResponse> getByProgramId(Long programId);
    List<AdmissionResponse> getFeePendingList();
}

