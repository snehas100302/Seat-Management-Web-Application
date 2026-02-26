package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.DepartmentRequest;
import com.sneha.seatmgmtapp.dto.response.DepartmentResponse;

import java.util.List;

public interface DepartmentService {
    DepartmentResponse create(DepartmentRequest request);
    DepartmentResponse getById(Long id);
    List<DepartmentResponse> getAll();
    List<DepartmentResponse> getByCampusId(Long campusId);
    DepartmentResponse update(Long id, DepartmentRequest request);
    void delete(Long id);
}

