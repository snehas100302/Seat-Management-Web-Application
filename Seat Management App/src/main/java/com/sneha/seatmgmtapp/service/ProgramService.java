package com.sneha.seatmgmtapp.service;

import com.sneha.seatmgmtapp.dto.request.ProgramRequest;
import com.sneha.seatmgmtapp.dto.response.ProgramResponse;

import java.util.List;

public interface ProgramService {
    ProgramResponse create(ProgramRequest request);
    ProgramResponse getById(Long id);
    List<ProgramResponse> getAll();
    List<ProgramResponse> getByDepartmentId(Long departmentId);
    List<ProgramResponse> getByAcademicYearId(Long academicYearId);
    ProgramResponse update(Long id, ProgramRequest request);
    void delete(Long id);
}

