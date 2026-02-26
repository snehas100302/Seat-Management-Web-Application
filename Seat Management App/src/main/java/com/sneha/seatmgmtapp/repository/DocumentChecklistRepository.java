package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.DocumentChecklist;
import com.sneha.seatmgmtapp.enums.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentChecklistRepository extends JpaRepository<DocumentChecklist, Long> {
    List<DocumentChecklist> findByApplicantId(Long applicantId);
    List<DocumentChecklist> findByApplicantIdAndStatus(Long applicantId, DocumentStatus status);
    boolean existsByApplicantIdAndStatusNot(Long applicantId, DocumentStatus status);
}

