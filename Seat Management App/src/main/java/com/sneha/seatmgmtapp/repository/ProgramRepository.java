package com.sneha.seatmgmtapp.repository;

import com.sneha.seatmgmtapp.entity.Program;
import com.sneha.seatmgmtapp.enums.CourseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    List<Program> findByDepartmentId(Long departmentId);
    List<Program> findByAcademicYearId(Long academicYearId);
    List<Program> findByCourseType(CourseType courseType);
    boolean existsByNameAndDepartmentIdAndAcademicYearId(String name, Long departmentId, Long academicYearId);

    @Query("SELECT p FROM Program p WHERE p.department.campus.institution.id = :institutionId")
    List<Program> findByInstitutionId(@Param("institutionId") Long institutionId);

    @Query("SELECT p FROM Program p WHERE p.department.campus.id = :campusId")
    List<Program> findByCampusId(@Param("campusId") Long campusId);
    
    // Check existence only for active (non-deleted) programs
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Program p WHERE p.name = :name AND p.department.id = :departmentId AND p.academicYear.id = :academicYearId AND p.isActive = true")
    boolean existsByNameAndDepartmentIdAndAcademicYearIdAndActive(@Param("name") String name, @Param("departmentId") Long departmentId, @Param("academicYearId") Long academicYearId);
}

