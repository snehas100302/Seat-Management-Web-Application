package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.CampusRequest;
import com.sneha.seatmgmtapp.dto.response.CampusResponse;
import com.sneha.seatmgmtapp.entity.Campus;
import com.sneha.seatmgmtapp.entity.Institution;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.CampusRepository;
import com.sneha.seatmgmtapp.repository.InstitutionRepository;
import com.sneha.seatmgmtapp.service.CampusService;
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
public class CampusServiceImpl implements CampusService {

    private final CampusRepository campusRepository;
    private final InstitutionRepository institutionRepository;

    @Override
    public CampusResponse create(CampusRequest request) {
        Institution institution = institutionRepository.findById(request.getInstitutionId())
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", request.getInstitutionId()));

        if (campusRepository.existsByNameAndInstitutionIdAndActive(request.getName(), request.getInstitutionId())) {
            throw new IllegalArgumentException("Campus with name '" + request.getName() + "' already exists in this institution");
        }

        Campus campus = Campus.builder()
                .name(request.getName())
                .code(request.getCode())
                .address(request.getAddress())
                .institution(institution)
                .build();
        campus = campusRepository.save(campus);
        log.info("Created campus: {} under institution: {}", campus.getName(), institution.getName());
        return EntityMapper.toCampusResponse(campus);
    }

    @Override
    @Transactional(readOnly = true)
    public CampusResponse getById(Long id) {
        Campus campus = campusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campus", "id", id));
        return EntityMapper.toCampusResponse(campus);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampusResponse> getAll() {
        return campusRepository.findAll().stream()
                .map(EntityMapper::toCampusResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampusResponse> getByInstitutionId(Long institutionId) {
        return campusRepository.findByInstitutionId(institutionId).stream()
                .map(EntityMapper::toCampusResponse).toList();
    }

    @Override
    public CampusResponse update(Long id, CampusRequest request) {
        Campus campus = campusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campus", "id", id));
        campus.setName(request.getName());
        campus.setCode(request.getCode());
        campus.setAddress(request.getAddress());
        campus = campusRepository.save(campus);
        log.info("Updated campus: {}", campus.getName());
        return EntityMapper.toCampusResponse(campus);
    }

    @Override
    public void delete(Long id) {
        Campus campus = campusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campus", "id", id));
        campus.setIsActive(false);
        campusRepository.save(campus);
        log.info("Soft deleted campus: {}", campus.getName());
    }
}

