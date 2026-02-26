package com.sneha.seatmgmtapp.entity;

import com.sneha.seatmgmtapp.enums.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents an applicant applying for admission.
 * Limited to max 15 fields as per requirement.
 */
@Entity
@Table(name = "applicants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Applicant extends BaseEntity {

    @NotBlank(message = "Applicant name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Enumerated(EnumType.STRING)
    @JdbcType(value = PostgreSQLEnumJdbcType.class)
    @Column(nullable = false)
    private Category category;

    @NotNull(message = "Entry type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntryType entryType;

    @NotNull(message = "Quota type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuotaType quotaType;

    @Enumerated(EnumType.STRING)
    @Column(name = "admission_mode")
    private AdmissionMode admissionMode;

    @Column(name = "qualifying_exam")
    private String qualifyingExam;

    @Column(name = "qualifying_marks")
    private Double qualifyingMarks;

    @Column(name = "allotment_number")
    private String allotmentNumber;

    @Column(name = "guardian_name")
    private String guardianName;

    @Column(name = "guardian_phone", length = 15)
    private String guardianPhone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = true)
    private Program program;

    @OneToMany(mappedBy = "applicant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DocumentChecklist> documents = new ArrayList<>();

    @OneToOne(mappedBy = "applicant", cascade = CascadeType.ALL, orphanRemoval = true)
    private Admission admission;
}

