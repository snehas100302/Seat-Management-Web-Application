package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.QuotaRequest;
import com.sneha.seatmgmtapp.dto.response.QuotaResponse;

import java.util.List;

public interface QuotaService {
    QuotaResponse create(QuotaRequest request);
    QuotaResponse getById(Long id);
    List<QuotaResponse> getByProgramId(Long programId);
    QuotaResponse update(Long id, QuotaRequest request);
    void delete(Long id);
}

