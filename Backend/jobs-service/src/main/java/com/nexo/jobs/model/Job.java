package com.nexo.jobs.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "company_id", nullable = false)
    private UUID companyId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private Workplace workplace;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    private ExperienceLevel experience;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(length = 100)
    private String salary;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false)
    private JobStatus status = JobStatus.active;

    @Column(nullable = false)
    private Integer views = 0;

    @CreationTimestamp
    @Column(name = "posted_at", nullable = false, updatable = false)
    private OffsetDateTime postedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<JobResponsibility> responsibilities = new LinkedHashSet<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<JobRequirement> requirements = new LinkedHashSet<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<JobSkill> skills = new LinkedHashSet<>();

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<JobBenefit> benefits = new LinkedHashSet<>();
}
