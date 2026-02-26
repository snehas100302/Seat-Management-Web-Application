package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.AcademicYearRequest;
import com.sneha.seatmgmtapp.dto.response.AcademicYearResponse;
import com.sneha.seatmgmtapp.entity.AcademicYear;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.AcademicYearRepository;
import com.sneha.seatmgmtapp.service.AcademicYearService;
import com.sneha.seatmgmtapp.utils.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AcademicYearServiceImpl implements AcademicYearService {

    private final AcademicYearRepository academicYearRepository;

    @Override
    public AcademicYearResponse create(AcademicYearRequest request) {
        if (request.getEndYear() <= request.getStartYear()) {
            throw new IllegalArgumentException("End year must be greater than start year");
        }
        if (academicYearRepository.existsByStartYearAndEndYear(request.getStartYear(), request.getEndYear())) {
            throw new IllegalArgumentException("Academic year " + request.getStartYear() + "-" + request.getEndYear() + " already exists");
        }

        // If setting as current, unset any existing current year
        if (Boolean.TRUE.equals(request.getIsCurrent())) {
            academicYearRepository.findByIsCurrentTrue().ifPresent(existing -> {
                existing.setIsCurrent(false);
                academicYearRepository.save(existing);
            });
        }

        AcademicYear academicYear = AcademicYear.builder()
                .startYear(request.getStartYear())
                .endYear(request.getEndYear())
                .isCurrent(Boolean.TRUE.equals(request.getIsCurrent()))
                .build();
        academicYear = academicYearRepository.save(academicYear);
        log.info("Created academic year: {}", academicYear.getLabel());
        return EntityMapper.toAcademicYearResponse(academicYear);
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicYearResponse getById(Long id) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));
        return EntityMapper.toAcademicYearResponse(academicYear);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicYearResponse> getAll() {
        return academicYearRepository.findAll().stream()
                .map(EntityMapper::toAcademicYearResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicYearResponse getCurrent() {
        AcademicYear academicYear = academicYearRepository.findByIsCurrentTrue()
                .orElseThrow(() -> new ResourceNotFoundException("No current academic year found"));
        return EntityMapper.toAcademicYearResponse(academicYear);
    }

    @Override
    public AcademicYearResponse update(Long id, AcademicYearRequest request) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));
        academicYear.setStartYear(request.getStartYear());
        academicYear.setEndYear(request.getEndYear());

        if (Boolean.TRUE.equals(request.getIsCurrent())) {
            academicYearRepository.findByIsCurrentTrue().ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    existing.setIsCurrent(false);
                    academicYearRepository.save(existing);
                }
            });
            academicYear.setIsCurrent(true);
        }

        academicYear = academicYearRepository.save(academicYear);
        log.info("Updated academic year: {}", academicYear.getLabel());
        return EntityMapper.toAcademicYearResponse(academicYear);
    }

    @Override
    public void delete(Long id) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", id));
        academicYear.setIsActive(false);
        academicYearRepository.save(academicYear);
        log.info("Soft deleted academic year: {}", academicYear.getLabel());
    }
}

