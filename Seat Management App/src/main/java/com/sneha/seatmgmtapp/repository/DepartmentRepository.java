package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByCampusId(Long campusId);
    boolean existsByNameAndCampusId(String name, Long campusId);
    
    // Check existence only for active (non-deleted) departments
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Department d WHERE d.name = :name AND d.campus.id = :campusId AND d.isActive = true")
    boolean existsByNameAndCampusIdAndActive(@Param("name") String name, @Param("campusId") Long campusId);
}

