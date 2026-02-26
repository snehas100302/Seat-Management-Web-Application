package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.AcademicYearRequest;
import com.sneha.seatmgmtapp.dto.response.AcademicYearResponse;

import java.util.List;

public interface AcademicYearService {
    AcademicYearResponse create(AcademicYearRequest request);
    AcademicYearResponse getById(Long id);
    List<AcademicYearResponse> getAll();
    AcademicYearResponse getCurrent();
    AcademicYearResponse update(Long id, AcademicYearRequest request);
    void delete(Long id);
}

