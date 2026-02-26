package com.sneha.seatmgmtapp.utils;

import com.sneha.seatmgmtapp.dto.response.*;
import com.sneha.seatmgmtapp.entity.*;

import java.util.Collections;

/**
 * Utility class for mapping entities to response DTOs.
 */
public final class EntityMapper {

    private EntityMapper() {}

    public static InstitutionResponse toInstitutionResponse(Institution entity) {
        return InstitutionResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .address(entity.getAddress())
                .contactEmail(entity.getContactEmail())
                .contactPhone(entity.getContactPhone())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .campuses(entity.getCampuses() != null
                        ? entity.getCampuses().stream().map(EntityMapper::toCampusResponse).toList()
                        : Collections.emptyList())
                .build();
    }

    public static CampusResponse toCampusResponse(Campus entity) {
        return CampusResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .address(entity.getAddress())
                .institutionId(entity.getInstitution().getId())
                .institutionName(entity.getInstitution().getName())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static DepartmentResponse toDepartmentResponse(Department entity) {
        return DepartmentResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .campusId(entity.getCampus().getId())
                .campusName(entity.getCampus().getName())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static ProgramResponse toProgramResponse(Program entity) {
        return ProgramResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .courseType(entity.getCourseType())
                .entryType(entity.getEntryType())
                .totalIntake(entity.getTotalIntake())
                .supernumerarySeats(entity.getSupernumerarySeats())
                .departmentId(entity.getDepartment().getId())
                .departmentName(entity.getDepartment().getName())
                .academicYearId(entity.getAcademicYear().getId())
                .academicYearLabel(entity.getAcademicYear().getLabel())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .quotas(entity.getQuotas() != null
                        ? entity.getQuotas().stream().map(EntityMapper::toQuotaResponse).toList()
                        : Collections.emptyList())
                .build();
    }

    public static AcademicYearResponse toAcademicYearResponse(AcademicYear entity) {
        return AcademicYearResponse.builder()
                .id(entity.getId())
                .startYear(entity.getStartYear())
                .endYear(entity.getEndYear())
                .label(entity.getLabel())
                .isCurrent(entity.getIsCurrent())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static QuotaResponse toQuotaResponse(Quota entity) {
        return QuotaResponse.builder()
                .id(entity.getId())
                .quotaType(entity.getQuotaType())
                .totalSeats(entity.getTotalSeats())
                .filledSeats(entity.getFilledSeats())
                .availableSeats(entity.getAvailableSeats())
                .programId(entity.getProgram().getId())
                .programName(entity.getProgram().getName())
                .build();
    }

    public static ApplicantResponse toApplicantResponse(Applicant entity) {
        return ApplicantResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .dateOfBirth(entity.getDateOfBirth())
                .category(entity.getCategory())
                .entryType(entity.getEntryType())
                .quotaType(entity.getQuotaType())
                .admissionMode(entity.getAdmissionMode())
                .qualifyingExam(entity.getQualifyingExam())
                .qualifyingMarks(entity.getQualifyingMarks())
                .allotmentNumber(entity.getAllotmentNumber())
                .guardianName(entity.getGuardianName())
                .guardianPhone(entity.getGuardianPhone())
                .programId(entity.getProgram() != null ? entity.getProgram().getId() : null)
                .programName(entity.getProgram() != null ? entity.getProgram().getName() : null)
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .documents(entity.getDocuments() != null
                        ? entity.getDocuments().stream().map(EntityMapper::toDocumentChecklistResponse).toList()
                        : Collections.emptyList())
                .admission(entity.getAdmission() != null
                        ? toAdmissionResponse(entity.getAdmission())
                        : null)
                .build();
    }

    public static DocumentChecklistResponse toDocumentChecklistResponse(DocumentChecklist entity) {
        return DocumentChecklistResponse.builder()
                .id(entity.getId())
                .documentName(entity.getDocumentName())
                .status(entity.getStatus())
                .remarks(entity.getRemarks())
                .applicantId(entity.getApplicant().getId())
                .build();
    }

    public static AdmissionResponse toAdmissionResponse(Admission entity) {
        return AdmissionResponse.builder()
                .id(entity.getId())
                .admissionNumber(entity.getAdmissionNumber())
                .admissionStatus(entity.getAdmissionStatus())
                .feeStatus(entity.getFeeStatus())
                .applicantId(entity.getApplicant().getId())
                .applicantName(entity.getApplicant().getName())
                .quotaId(entity.getQuota().getId())
                .quotaType(entity.getQuota().getQuotaType().name())
                .programName(entity.getQuota().getProgram().getName())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public static UserResponse toUserResponse(User entity) {
        return UserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .fullName(entity.getFullName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .role(entity.getRole())
                .isActive(entity.getIsActive())
                .build();
    }
}

