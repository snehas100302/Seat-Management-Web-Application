package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.ApplicantRequest;
import com.sneha.seatmgmtapp.dto.response.ApplicantResponse;

import java.util.List;

public interface ApplicantService {
    ApplicantResponse create(ApplicantRequest request);
    ApplicantResponse getById(Long id);
    List<ApplicantResponse> getAll();
    List<ApplicantResponse> getByProgramId(Long programId);
    ApplicantResponse update(Long id, ApplicantRequest request);
    void delete(Long id);
}

