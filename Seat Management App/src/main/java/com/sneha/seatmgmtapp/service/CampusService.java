package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.CampusRequest;
import com.sneha.seatmgmtapp.dto.response.CampusResponse;

import java.util.List;

public interface CampusService {
    CampusResponse create(CampusRequest request);
    CampusResponse getById(Long id);
    List<CampusResponse> getAll();
    List<CampusResponse> getByInstitutionId(Long institutionId);
    CampusResponse update(Long id, CampusRequest request);
    void delete(Long id);
}

