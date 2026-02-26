package com.sneha.seatmgmtapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
//import org.locationtech.jts.geom.Point;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a campus belonging to an institution.
 */
@Entity
@Table(name = "campuses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campus extends BaseEntity {

    @NotBlank(message = "Campus name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "code", length = 20)
    private String code;

    @Column(name = "address")
    private String address;

//    @JdbcTypeCode(SqlTypes.GEOMETRY)
//    @Column(name = "location", columnDefinition = "geometry(Point,4326)")
//    private Point location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institution_id", nullable = false)
    private Institution institution;

    @OneToMany(mappedBy = "campus", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Department> departments = new ArrayList<>();
}

