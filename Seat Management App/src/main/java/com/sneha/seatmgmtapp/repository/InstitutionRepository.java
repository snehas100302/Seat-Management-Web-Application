package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.Institution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {
    Optional<Institution> findByCode(String code);
    Optional<Institution> findByName(String name);
    boolean existsByCode(String code);
    boolean existsByName(String name);
    
    // Check existence only for active (non-deleted) institutions
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Institution i WHERE i.name = :name AND i.isActive = true")
    boolean existsByNameAndActive(@Param("name") String name);
    
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Institution i WHERE i.code = :code AND i.isActive = true")
    boolean existsByCodeAndActive(@Param("code") String code);
}

