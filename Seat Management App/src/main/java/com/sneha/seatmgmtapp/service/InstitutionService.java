package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.InstitutionRequest;
import com.sneha.seatmgmtapp.dto.response.InstitutionResponse;

import java.util.List;

public interface InstitutionService {
    InstitutionResponse create(InstitutionRequest request);
    InstitutionResponse getById(Long id);
    List<InstitutionResponse> getAll();
    InstitutionResponse update(Long id, InstitutionRequest request);
    void delete(Long id);
}

