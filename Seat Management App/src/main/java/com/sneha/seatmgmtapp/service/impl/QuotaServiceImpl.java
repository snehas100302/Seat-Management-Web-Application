package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.request.QuotaRequest;
import com.sneha.seatmgmtapp.dto.response.QuotaResponse;
import com.sneha.seatmgmtapp.entity.Program;
import com.sneha.seatmgmtapp.entity.Quota;
import com.sneha.seatmgmtapp.exception.ResourceNotFoundException;
import com.sneha.seatmgmtapp.repository.ProgramRepository;
import com.sneha.seatmgmtapp.repository.QuotaRepository;
import com.sneha.seatmgmtapp.service.QuotaService;
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
public class QuotaServiceImpl implements QuotaService {

    private final QuotaRepository quotaRepository;
    private final ProgramRepository programRepository;

    @Override
    public QuotaResponse create(QuotaRequest request) {
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new ResourceNotFoundException("Program", "id", request.getProgramId()));

        // Check if quota type already exists for this program
        if (quotaRepository.findByProgramIdAndQuotaType(request.getProgramId(), request.getQuotaType()).isPresent()) {
            throw new IllegalArgumentException("Quota type " + request.getQuotaType() + " already exists for this program");
        }

        // Validate: total quota seats must not exceed program intake
        Integer currentTotalQuotaSeats = quotaRepository.sumTotalSeatsByProgramId(request.getProgramId());
        if (currentTotalQuotaSeats + request.getTotalSeats() > program.getTotalIntake()) {
            throw new IllegalArgumentException(
                    "Total quota seats (" + (currentTotalQuotaSeats + request.getTotalSeats()) +
                    ") would exceed program intake (" + program.getTotalIntake() + ")");
        }

        Quota quota = Quota.builder()
                .quotaType(request.getQuotaType())
                .totalSeats(request.getTotalSeats())
                .filledSeats(0)
                .program(program)
                .build();
        quota = quotaRepository.save(quota);
        log.info("Created quota {} with {} seats for program: {}", quota.getQuotaType(), quota.getTotalSeats(), program.getName());
        return EntityMapper.toQuotaResponse(quota);
    }

    @Override
    @Transactional(readOnly = true)
    public QuotaResponse getById(Long id) {
        Quota quota = quotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quota", "id", id));
        return EntityMapper.toQuotaResponse(quota);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuotaResponse> getByProgramId(Long programId) {
        return quotaRepository.findByProgramId(programId).stream()
                .map(EntityMapper::toQuotaResponse).toList();
    }

    @Override
    public QuotaResponse update(Long id, QuotaRequest request) {
        Quota quota = quotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quota", "id", id));

        Program program = quota.getProgram();

        // Validate updated total wouldn't exceed intake
        Integer currentTotalQuotaSeats = quotaRepository.sumTotalSeatsByProgramId(program.getId());
        int newTotal = currentTotalQuotaSeats - quota.getTotalSeats() + request.getTotalSeats();
        if (newTotal > program.getTotalIntake()) {
            throw new IllegalArgumentException(
                    "Total quota seats (" + newTotal + ") would exceed program intake (" + program.getTotalIntake() + ")");
        }

        // Cannot reduce seats below filled seats
        if (request.getTotalSeats() < quota.getFilledSeats()) {
            throw new IllegalArgumentException(
                    "Cannot reduce total seats below filled seats (" + quota.getFilledSeats() + ")");
        }

        quota.setTotalSeats(request.getTotalSeats());
        quota = quotaRepository.save(quota);
        log.info("Updated quota {} for program: {}", quota.getQuotaType(), program.getName());
        return EntityMapper.toQuotaResponse(quota);
    }

    @Override
    public void delete(Long id) {
        Quota quota = quotaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quota", "id", id));
        if (quota.getFilledSeats() > 0) {
            throw new IllegalArgumentException("Cannot delete quota with filled seats");
        }
        quota.setIsActive(false);
        quotaRepository.save(quota);
        log.info("Soft deleted quota: {} for program: {}", quota.getQuotaType(), quota.getProgram().getName());
    }
}

