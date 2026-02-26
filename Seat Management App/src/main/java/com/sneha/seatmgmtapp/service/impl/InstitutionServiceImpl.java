package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.InstitutionRequest;
import com.sneha.seatmgmtapp.dto.response.InstitutionResponse;
import com.sneha.seatmgmtapp.entity.Institution;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.InstitutionRepository;
import com.sneha.seatmgmtapp.service.InstitutionService;
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
public class InstitutionServiceImpl implements InstitutionService {

    private final InstitutionRepository institutionRepository;

    @Override
    public InstitutionResponse create(InstitutionRequest request) {
        if (institutionRepository.existsByNameAndActive(request.getName())) {
            throw new IllegalArgumentException("Institution with name '" + request.getName() + "' already exists");
        }
        if (request.getCode() != null && institutionRepository.existsByCodeAndActive(request.getCode())) {
            throw new IllegalArgumentException("Institution with code '" + request.getCode() + "' already exists");
        }
        Institution institution = Institution.builder()
                .name(request.getName())
                .code(request.getCode())
                .address(request.getAddress())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .build();
        institution = institutionRepository.save(institution);
        log.info("Created institution: {}", institution.getName());
        return EntityMapper.toInstitutionResponse(institution);
    }

    @Override
    @Transactional(readOnly = true)
    public InstitutionResponse getById(Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));
        return EntityMapper.toInstitutionResponse(institution);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InstitutionResponse> getAll() {
        return institutionRepository.findAll().stream()
                .map(EntityMapper::toInstitutionResponse).toList();
    }

    @Override
    public InstitutionResponse update(Long id, InstitutionRequest request) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));
        institution.setName(request.getName());
        institution.setCode(request.getCode());
        institution.setAddress(request.getAddress());
        institution.setContactEmail(request.getContactEmail());
        institution.setContactPhone(request.getContactPhone());
        institution = institutionRepository.save(institution);
        log.info("Updated institution: {}", institution.getName());
        return EntityMapper.toInstitutionResponse(institution);
    }

    @Override
    public void delete(Long id) {
        Institution institution = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution", "id", id));
        institution.setIsActive(false);
        institutionRepository.save(institution);
        log.info("Soft deleted institution: {}", institution.getName());
    }
}

