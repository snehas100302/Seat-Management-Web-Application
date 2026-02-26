package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.DepartmentRequest;
import com.sneha.seatmgmtapp.dto.response.DepartmentResponse;
import com.sneha.seatmgmtapp.entity.Campus;
import com.sneha.seatmgmtapp.entity.Department;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.CampusRepository;
import com.sneha.seatmgmtapp.repository.DepartmentRepository;
import com.sneha.seatmgmtapp.service.DepartmentService;
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
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CampusRepository campusRepository;

    @Override
    public DepartmentResponse create(DepartmentRequest request) {
        Campus campus = campusRepository.findById(request.getCampusId())
                .orElseThrow(() -> new ResourceNotFoundException("Campus", "id", request.getCampusId()));

        if (departmentRepository.existsByNameAndCampusIdAndActive(request.getName(), request.getCampusId())) {
            throw new IllegalArgumentException("Department with name '" + request.getName() + "' already exists in this campus");
        }

        Department department = Department.builder()
                .name(request.getName())
                .code(request.getCode())
                .campus(campus)
                .build();
        department = departmentRepository.save(department);
        log.info("Created department: {} under campus: {}", department.getName(), campus.getName());
        return EntityMapper.toDepartmentResponse(department);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return EntityMapper.toDepartmentResponse(department);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .map(EntityMapper::toDepartmentResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getByCampusId(Long campusId) {
        return departmentRepository.findByCampusId(campusId).stream()
                .map(EntityMapper::toDepartmentResponse).toList();
    }

    @Override
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        department.setName(request.getName());
        department.setCode(request.getCode());
        department = departmentRepository.save(department);
        log.info("Updated department: {}", department.getName());
        return EntityMapper.toDepartmentResponse(department);
    }

    @Override
    public void delete(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        department.setIsActive(false);
        departmentRepository.save(department);
        log.info("Soft deleted department: {}", department.getName());
    }
}

