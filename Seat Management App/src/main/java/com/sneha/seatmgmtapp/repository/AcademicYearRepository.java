package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    Optional<AcademicYear> findByStartYearAndEndYear(Integer startYear, Integer endYear);
    Optional<AcademicYear> findByIsCurrentTrue();
    boolean existsByStartYearAndEndYear(Integer startYear, Integer endYear);
}

