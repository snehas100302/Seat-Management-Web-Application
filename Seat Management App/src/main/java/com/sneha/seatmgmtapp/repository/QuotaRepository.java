package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.Quota;
import com.sneha.seatmgmtapp.enums.QuotaType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotaRepository extends JpaRepository<Quota, Long> {
    List<Quota> findByProgramId(Long programId);

    Optional<Quota> findByProgramIdAndQuotaType(Long programId, QuotaType quotaType);

    /**
     * Pessimistic lock for seat allocation to prevent race conditions.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT q FROM Quota q WHERE q.program.id = :programId AND q.quotaType = :quotaType")
    Optional<Quota> findByProgramIdAndQuotaTypeWithLock(
            @Param("programId") Long programId,
            @Param("quotaType") QuotaType quotaType
    );

    @Query("SELECT COALESCE(SUM(q.totalSeats), 0) FROM Quota q WHERE q.program.id = :programId")
    Integer sumTotalSeatsByProgramId(@Param("programId") Long programId);
}

