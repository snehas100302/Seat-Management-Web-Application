package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.ApplicantRequest;
import com.sneha.seatmgmtapp.dto.response.ApplicantResponse;
import com.sneha.seatmgmtapp.entity.Applicant;
import com.sneha.seatmgmtapp.entity.Program;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.ApplicantRepository;
import com.sneha.seatmgmtapp.repository.ProgramRepository;
import com.sneha.seatmgmtapp.service.ApplicantService;
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
public class ApplicantServiceImpl implements ApplicantService {

    private final ApplicantRepository applicantRepository;
    private final ProgramRepository programRepository;

    @Override
    public ApplicantResponse create(ApplicantRequest request) {
        Program program = null;
        if (request.getProgramId() != null) {
            program = programRepository.findById(request.getProgramId())
                    .orElseThrow(() -> new ResourceNotFoundException("Program", "id", request.getProgramId()));
        }

        Applicant applicant = Applicant.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .category(request.getCategory())
                .entryType(request.getEntryType())
                .quotaType(request.getQuotaType())
                .admissionMode(request.getAdmissionMode())
                .qualifyingExam(request.getQualifyingExam())
                .qualifyingMarks(request.getQualifyingMarks())
                .allotmentNumber(request.getAllotmentNumber())
                .guardianName(request.getGuardianName())
                .guardianPhone(request.getGuardianPhone())
                .program(program)
                .build();
        applicant = applicantRepository.save(applicant);
        log.info("Created applicant: {}", applicant.getName());
        return EntityMapper.toApplicantResponse(applicant);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicantResponse getById(Long id) {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", id));
        return EntityMapper.toApplicantResponse(applicant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponse> getAll() {
        return applicantRepository.findAll().stream()
                .map(EntityMapper::toApplicantResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicantResponse> getByProgramId(Long programId) {
        return applicantRepository.findByProgramId(programId).stream()
                .map(EntityMapper::toApplicantResponse).toList();
    }

    @Override
    public ApplicantResponse update(Long id, ApplicantRequest request) {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", id));

        applicant.setName(request.getName());
        applicant.setEmail(request.getEmail());
        applicant.setPhone(request.getPhone());
        applicant.setDateOfBirth(request.getDateOfBirth());
        applicant.setCategory(request.getCategory());
        applicant.setEntryType(request.getEntryType());
        applicant.setQuotaType(request.getQuotaType());
        applicant.setAdmissionMode(request.getAdmissionMode());
        applicant.setQualifyingExam(request.getQualifyingExam());
        applicant.setQualifyingMarks(request.getQualifyingMarks());
        applicant.setAllotmentNumber(request.getAllotmentNumber());
        applicant.setGuardianName(request.getGuardianName());
        applicant.setGuardianPhone(request.getGuardianPhone());

        applicant = applicantRepository.save(applicant);
        log.info("Updated applicant: {}", applicant.getName());
        return EntityMapper.toApplicantResponse(applicant);
    }

    @Override
    public void delete(Long id) {
        Applicant applicant = applicantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", id));
        applicant.setIsActive(false);
        applicantRepository.save(applicant);
        log.info("Soft deleted applicant: {}", applicant.getName());
    }
}

