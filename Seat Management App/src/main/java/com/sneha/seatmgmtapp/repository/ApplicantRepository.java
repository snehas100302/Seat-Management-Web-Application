package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.Applicant;
import com.sneha.seatmgmtapp.enums.QuotaType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    List<Applicant> findByProgramId(Long programId);
    Optional<Applicant> findByEmail(String email);
    List<Applicant> findByQuotaType(QuotaType quotaType);

    @Query("SELECT a FROM Applicant a JOIN a.documents d WHERE d.status = 'PENDING'")
    List<Applicant> findApplicantsWithPendingDocuments();

    @Query("SELECT a FROM Applicant a WHERE a.program.department.campus.institution.id = :institutionId")
    List<Applicant> findByInstitutionId(@Param("institutionId") Long institutionId);
}

