package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampusRepository extends JpaRepository<Campus, Long> {
    List<Campus> findByInstitutionId(Long institutionId);
    boolean existsByNameAndInstitutionId(String name, Long institutionId);
    
    // Check existence only for active (non-deleted) campuses
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Campus c WHERE c.name = :name AND c.institution.id = :institutionId AND c.isActive = true")
    boolean existsByNameAndInstitutionIdAndActive(@Param("name") String name, @Param("institutionId") Long institutionId);
}

