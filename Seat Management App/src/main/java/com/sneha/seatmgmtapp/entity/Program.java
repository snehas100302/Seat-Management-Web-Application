package com.sneha.seatmgmtapp.entity;

import com.sneha.seatmgmtapp.enums.CourseType;
import com.sneha.seatmgmtapp.enums.EntryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a program/branch (e.g., B.Tech CSE, M.Tech AI).
 */
@Entity
@Table(name = "programs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Program extends BaseEntity {

	@NotBlank(message = "Program name is required")
	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "code", length = 20)
	private String code;

	@NotNull(message = "Course type is required")
	@Enumerated(EnumType.STRING)
	@JdbcType(value = PostgreSQLEnumJdbcType.class)
	@Column(name = "course_type", nullable = false)
	private CourseType courseType;

	@NotNull(message = "Entry type is required")
	@Enumerated(EnumType.STRING)
	@JdbcType(value = PostgreSQLEnumJdbcType.class)
	@Column(name = "entry_type", nullable = false)
	private EntryType entryType;

	@NotNull(message = "Total intake is required")
	@Min(value = 1, message = "Total intake must be at least 1")
	@Column(name = "total_intake", nullable = false)
	private Integer totalIntake;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "department_id", nullable = false)
	private Department department;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "academic_year_id", nullable = false)
	private AcademicYear academicYear;

	@OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<Quota> quotas = new ArrayList<>();

	@Column(name = "supernumerary_seats")
	@Builder.Default
	private Integer supernumerarySeats = 0;
}

