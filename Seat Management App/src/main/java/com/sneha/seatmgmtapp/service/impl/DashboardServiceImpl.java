package com.sneha.seatmgmtapp.service.impl;

import com.sneha.seatmgmtapp.dto.response.DashboardResponse;
import com.sneha.seatmgmtapp.entity.Program;
import com.sneha.seatmgmtapp.entity.Quota;
import com.sneha.seatmgmtapp.enums.FeeStatus;
import com.sneha.seatmgmtapp.repository.*;
import com.sneha.seatmgmtapp.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final ProgramRepository programRepository;
    private final QuotaRepository quotaRepository;
    private final AdmissionRepository admissionRepository;
    private final ApplicantRepository applicantRepository;

    @Override
    public DashboardResponse getDashboard(Long academicYearId) {
        List<Program> programs;
        if (academicYearId != null) {
            programs = programRepository.findByAcademicYearId(academicYearId);
        } else {
            programs = programRepository.findAll();
        }

        int totalIntake = 0;
        int totalAdmitted = 0;
        Map<String, DashboardResponse.QuotaSummary> quotaMap = new HashMap<>();
        List<DashboardResponse.ProgramSummary> programSummaries = new ArrayList<>();

        for (Program program : programs) {
            totalIntake += program.getTotalIntake();
            Long admitted = admissionRepository.countConfirmedByProgramId(program.getId());
            totalAdmitted += admitted.intValue();

            programSummaries.add(DashboardResponse.ProgramSummary.builder()
                    .programId(program.getId())
                    .programName(program.getName())
                    .courseType(program.getCourseType().name())
                    .totalIntake(program.getTotalIntake())
                    .totalAdmitted(admitted.intValue())
                    .remaining(program.getTotalIntake() - admitted.intValue())
                    .build());

            List<Quota> quotas = quotaRepository.findByProgramId(program.getId());
            for (Quota quota : quotas) {
                String key = quota.getQuotaType().name();
                DashboardResponse.QuotaSummary existing = quotaMap.get(key);
                if (existing == null) {
                    quotaMap.put(key, DashboardResponse.QuotaSummary.builder()
                            .quotaType(key)
                            .totalSeats(quota.getTotalSeats())
                            .filledSeats(quota.getFilledSeats())
                            .availableSeats(quota.getAvailableSeats())
                            .build());
                } else {
                    existing.setTotalSeats(existing.getTotalSeats() + quota.getTotalSeats());
                    existing.setFilledSeats(existing.getFilledSeats() + quota.getFilledSeats());
                    existing.setAvailableSeats(existing.getAvailableSeats() + quota.getAvailableSeats());
                }
            }
        }

        long pendingDocCount = applicantRepository.findApplicantsWithPendingDocuments().size();
        long pendingFeeCount = admissionRepository.findByFeeStatus(FeeStatus.PENDING).size();

        return DashboardResponse.builder()
                .totalIntake(totalIntake)
                .totalAdmitted(totalAdmitted)
                .totalRemaining(totalIntake - totalAdmitted)
                .quotaSummaries(new ArrayList<>(quotaMap.values()))
                .programSummaries(programSummaries)
                .pendingDocumentsCount(pendingDocCount)
                .pendingFeeCount(pendingFeeCount)
                .build();
    }
}

