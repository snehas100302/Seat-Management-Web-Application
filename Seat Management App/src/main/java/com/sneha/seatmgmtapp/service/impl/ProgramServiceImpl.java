package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.ProgramRequest;
import com.sneha.seatmgmtapp.dto.response.ProgramResponse;
import com.sneha.seatmgmtapp.entity.AcademicYear;
import com.sneha.seatmgmtapp.entity.Department;
import com.sneha.seatmgmtapp.entity.Program;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.AcademicYearRepository;
import com.sneha.seatmgmtapp.repository.DepartmentRepository;
import com.sneha.seatmgmtapp.repository.ProgramRepository;
import com.sneha.seatmgmtapp.service.ProgramService;
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
public class ProgramServiceImpl implements ProgramService {

    private final ProgramRepository programRepository;
    private final DepartmentRepository departmentRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    public ProgramResponse create(ProgramRequest request) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("AcademicYear", "id", request.getAcademicYearId()));

        if (programRepository.existsByNameAndDepartmentIdAndAcademicYearIdAndActive(
                request.getName(), request.getDepartmentId(), request.getAcademicYearId())) {
            throw new IllegalArgumentException("Program '" + request.getName() + "' already exists for this department and academic year");
        }

        Program program = Program.builder()
                .name(request.getName())
                .code(request.getCode())
                .courseType(request.getCourseType())
                .entryType(request.getEntryType())
                .totalIntake(request.getTotalIntake())
                .supernumerarySeats(request.getSupernumerarySeats() != null ? request.getSupernumerarySeats() : 0)
                .department(department)
                .academicYear(academicYear)
                .build();
        program = programRepository.save(program);
        log.info("Created program: {} under department: {}", program.getName(), department.getName());
        return EntityMapper.toProgramResponse(program);
    }

    @Override
    @Transactional(readOnly = true)
    public ProgramResponse getById(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", "id", id));
        return EntityMapper.toProgramResponse(program);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgramResponse> getAll() {
        return programRepository.findAll().stream()
                .map(EntityMapper::toProgramResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgramResponse> getByDepartmentId(Long departmentId) {
        return programRepository.findByDepartmentId(departmentId).stream()
                .map(EntityMapper::toProgramResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProgramResponse> getByAcademicYearId(Long academicYearId) {
        return programRepository.findByAcademicYearId(academicYearId).stream()
                .map(EntityMapper::toProgramResponse).toList();
    }

    @Override
    public ProgramResponse update(Long id, ProgramRequest request) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", "id", id));
        program.setName(request.getName());
        program.setCode(request.getCode());
        program.setCourseType(request.getCourseType());
        program.setEntryType(request.getEntryType());
        program.setTotalIntake(request.getTotalIntake());
        if (request.getSupernumerarySeats() != null) {
            program.setSupernumerarySeats(request.getSupernumerarySeats());
        }
        program = programRepository.save(program);
        log.info("Updated program: {}", program.getName());
        return EntityMapper.toProgramResponse(program);
    }

    @Override
    public void delete(Long id) {
        Program program = programRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Program", "id", id));
        program.setIsActive(false);
        programRepository.save(program);
        log.info("Soft deleted program: {}", program.getName());
    }
}

