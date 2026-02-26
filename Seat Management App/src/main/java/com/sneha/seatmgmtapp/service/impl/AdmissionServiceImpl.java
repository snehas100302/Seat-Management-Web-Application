package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.SeatAllocationRequest;
import com.sneha.seatmgmtapp.dto.response.AdmissionResponse;
import com.sneha.seatmgmtapp.entity.Admission;
import com.sneha.seatmgmtapp.entity.Applicant;
import com.sneha.seatmgmtapp.entity.Quota;
import com.sneha.seatmgmtapp.enums.AdmissionMode;
import com.sneha.seatmgmtapp.enums.AdmissionStatus;
import com.sneha.seatmgmtapp.enums.DocumentStatus;
import com.sneha.seatmgmtapp.enums.FeeStatus;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.AdmissionRepository;
import com.sneha.seatmgmtapp.repository.ApplicantRepository;
import com.sneha.seatmgmtapp.repository.DocumentChecklistRepository;
import com.sneha.seatmgmtapp.repository.ProgramRepository;
import com.sneha.seatmgmtapp.repository.QuotaRepository;
import com.sneha.seatmgmtapp.service.AdmissionService;
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
public class AdmissionServiceImpl implements AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final ApplicantRepository applicantRepository;
    private final ProgramRepository programRepository;
    private final QuotaRepository quotaRepository;
    private final DocumentChecklistRepository documentChecklistRepository;

    @Override
    public AdmissionResponse allocateSeat(SeatAllocationRequest request) {
        Applicant applicant = applicantRepository.findById(request.getApplicantId())
                .orElseThrow(() -> new ResourceNotFoundException("Applicant", "id", request.getApplicantId()));

        // Resolve program and align applicant to it
        var program = programRepository.findById(request.getProgramId())
            .orElseThrow(() -> new ResourceNotFoundException("Program", "id", request.getProgramId()));

        // Set admission mode based on quota selection
        AdmissionMode admissionMode = request.getQuotaType() == com.sneha.seatmgmtapp.enums.QuotaType.MANAGEMENT
            ? AdmissionMode.MANAGEMENT
            : AdmissionMode.GOVERNMENT;
        applicant.setAdmissionMode(admissionMode);
        applicant.setProgram(program);
        applicantRepository.save(applicant);

        // Check if already has an admission
        if (admissionRepository.existsByApplicantId(applicant.getId())) {
            throw new IllegalArgumentException("Applicant already has a seat allocated");
        }

        // Government flow: allotment number is required for KCET/COMEDK
        if (admissionMode == AdmissionMode.GOVERNMENT) {
            String allotmentNumber = request.getAllotmentNumber();
            if (allotmentNumber == null || allotmentNumber.isBlank()) {
                allotmentNumber = applicant.getAllotmentNumber();
            }
            if (allotmentNumber == null || allotmentNumber.isBlank()) {
                throw new IllegalArgumentException("Allotment number is required for government admission");
            }
            applicant.setAllotmentNumber(allotmentNumber);
            applicantRepository.save(applicant);
        }

        // Lock the quota row for concurrent safety
        Quota quota = quotaRepository.findByProgramIdAndQuotaTypeWithLock(
                program.getId(), request.getQuotaType())
                .orElseThrow(() -> new ResourceNotFoundException("Quota not found for program and type: " + request.getQuotaType()));

        // Check seat availability
        if (quota.isFull()) {
            throw new IllegalArgumentException(
                    "No seats available in " + request.getQuotaType() + " quota for program " + applicant.getProgram().getName() +
                    ". Total: " + quota.getTotalSeats() + ", Filled: " + quota.getFilledSeats());
        }

        // Increment filled seats
        quota.setFilledSeats(quota.getFilledSeats() + 1);
        quotaRepository.save(quota);

        // Create admission record
        Admission admission = Admission.builder()
                .admissionStatus(AdmissionStatus.SEAT_ALLOCATED)
                .feeStatus(FeeStatus.PENDING)
                .applicant(applicant)
                .quota(quota)
                .build();
        admission = admissionRepository.save(admission);

        log.info("Seat allocated for applicant: {} in quota: {} for program: {}. Remaining: {}",
            applicant.getName(), quota.getQuotaType(), program.getName(), quota.getAvailableSeats());

        return EntityMapper.toAdmissionResponse(admission);
    }

    @Override
    public AdmissionResponse verifyDocuments(Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        if (admission.getAdmissionStatus() == AdmissionStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot verify documents for a cancelled admission");
        }

        // Check if all documents are verified
        boolean hasPendingDocs = documentChecklistRepository.existsByApplicantIdAndStatusNot(
                admission.getApplicant().getId(), DocumentStatus.VERIFIED);
        if (hasPendingDocs) {
            throw new IllegalArgumentException("Not all documents are verified for this applicant");
        }

        admission.setAdmissionStatus(AdmissionStatus.DOCUMENTS_VERIFIED);
        admission = admissionRepository.save(admission);
        log.info("Documents verified for admission: {}", admissionId);
        return EntityMapper.toAdmissionResponse(admission);
    }

    @Override
    public AdmissionResponse markFeePaid(Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        if (admission.getAdmissionStatus() == AdmissionStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot mark fee for a cancelled admission");
        }

        admission.setFeeStatus(FeeStatus.PAID);
        admission.setAdmissionStatus(AdmissionStatus.FEE_PAID);
        admission = admissionRepository.save(admission);
        log.info("Fee marked as paid for admission: {}", admissionId);
        return EntityMapper.toAdmissionResponse(admission);
    }

    @Override
    public AdmissionResponse confirmAdmission(Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        if (admission.getAdmissionStatus() == AdmissionStatus.CONFIRMED) {
            throw new IllegalArgumentException("Admission is already confirmed");
        }
        if (admission.getAdmissionStatus() == AdmissionStatus.CANCELLED) {
            throw new IllegalArgumentException("Cannot confirm a cancelled admission");
        }

        // Rule: Admission confirmed only if fee paid
        if (admission.getFeeStatus() != FeeStatus.PAID) {
            throw new IllegalArgumentException("Fee must be paid before confirming admission");
        }

        // Rule: Admission number generated only once (immutable)
        if (admission.getAdmissionNumber() == null) {
            String admissionNumber = generateAdmissionNumber(admission);
            admission.setAdmissionNumber(admissionNumber);
        }

        admission.setAdmissionStatus(AdmissionStatus.CONFIRMED);
        admission = admissionRepository.save(admission);
        log.info("Admission confirmed for applicant: {} with admission number: {}",
                admission.getApplicant().getName(), admission.getAdmissionNumber());
        return EntityMapper.toAdmissionResponse(admission);
    }

    @Override
    public AdmissionResponse cancelAdmission(Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", admissionId));

        if (admission.getAdmissionStatus() == AdmissionStatus.CONFIRMED) {
            throw new IllegalArgumentException("Cannot cancel a confirmed admission");
        }

        // Release seat
        Quota quota = admission.getQuota();
        quota.setFilledSeats(Math.max(0, quota.getFilledSeats() - 1));
        quotaRepository.save(quota);

        admission.setAdmissionStatus(AdmissionStatus.CANCELLED);
        admission = admissionRepository.save(admission);
        log.info("Admission cancelled for applicant: {}. Seat released in quota: {}",
                admission.getApplicant().getName(), quota.getQuotaType());
        return EntityMapper.toAdmissionResponse(admission);
    }

    @Override
    @Transactional(readOnly = true)
    public AdmissionResponse getById(Long id) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admission", "id", id));
        return EntityMapper.toAdmissionResponse(admission);
    }

    @Override
    @Transactional(readOnly = true)
    public AdmissionResponse getByApplicantId(Long applicantId) {
        Admission admission = admissionRepository.findByApplicantId(applicantId)
                .orElseThrow(() -> new ResourceNotFoundException("Admission not found for applicant", "applicantId", applicantId));
        return EntityMapper.toAdmissionResponse(admission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionResponse> getAll() {
        return admissionRepository.findAll().stream()
                .map(EntityMapper::toAdmissionResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionResponse> getByProgramId(Long programId) {
        return admissionRepository.findByProgramId(programId).stream()
                .map(EntityMapper::toAdmissionResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdmissionResponse> getFeePendingList() {
        return admissionRepository.findByFeeStatus(FeeStatus.PENDING).stream()
                .map(EntityMapper::toAdmissionResponse).toList();
    }

    /**
     * Generates admission number in format: INST/YEAR/COURSETYPE/PROGRAMCODE/QUOTA/SERIAL
     * Example: INST/2026/UG/CSE/KCET/0001
     */
    private String generateAdmissionNumber(Admission admission) {
        Applicant applicant = admission.getApplicant();
        Quota quota = admission.getQuota();

        String instCode = applicant.getProgram().getDepartment().getCampus().getInstitution().getCode();
        if (instCode == null || instCode.isBlank()) {
            instCode = "INST";
        }

        String year = String.valueOf(applicant.getProgram().getAcademicYear().getEndYear());
        String courseType = applicant.getProgram().getCourseType().name();
        String programCode = applicant.getProgram().getCode();
        if (programCode == null || programCode.isBlank()) {
            programCode = applicant.getProgram().getName().substring(0, Math.min(3, applicant.getProgram().getName().length())).toUpperCase();
        }
        String quotaType = quota.getQuotaType().name();

        String prefix = instCode + "/" + year + "/" + courseType + "/" + programCode + "/" + quotaType + "/";
        Long count = admissionRepository.countByAdmissionNumberPrefix(prefix);
        String serial = String.format("%04d", count + 1);

        return prefix + serial;
    }
}

