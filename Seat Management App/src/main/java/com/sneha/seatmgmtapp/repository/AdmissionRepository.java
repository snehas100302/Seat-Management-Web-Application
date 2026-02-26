package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.Admission;
import com.sneha.seatmgmtapp.enums.AdmissionStatus;
import com.sneha.seatmgmtapp.enums.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    Optional<Admission> findByApplicantId(Long applicantId);
    Optional<Admission> findByAdmissionNumber(String admissionNumber);
    boolean existsByApplicantId(Long applicantId);
    boolean existsByAdmissionNumber(String admissionNumber);

    List<Admission> findByAdmissionStatus(AdmissionStatus status);
    List<Admission> findByFeeStatus(FeeStatus feeStatus);

    @Query("SELECT a FROM Admission a WHERE a.quota.program.id = :programId")
    List<Admission> findByProgramId(@Param("programId") Long programId);

    @Query("SELECT COUNT(a) FROM Admission a WHERE a.quota.program.id = :programId AND a.admissionStatus = 'CONFIRMED'")
    Long countConfirmedByProgramId(@Param("programId") Long programId);

    @Query("SELECT COUNT(a) FROM Admission a WHERE a.quota.id = :quotaId AND a.admissionStatus = 'CONFIRMED'")
    Long countConfirmedByQuotaId(@Param("quotaId") Long quotaId);

    /**
     * Count admissions with a given prefix for serial number generation.
     */
    @Query("SELECT COUNT(a) FROM Admission a WHERE a.admissionNumber LIKE :prefix%")
    Long countByAdmissionNumberPrefix(@Param("prefix") String prefix);
}

