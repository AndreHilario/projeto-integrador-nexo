package com.nexo.jobs.repository;

import com.nexo.jobs.model.ExperienceLevel;
import com.nexo.jobs.model.Job;
import com.nexo.jobs.model.JobStatus;
import com.nexo.jobs.model.Workplace;
import java.util.UUID;
import org.springframework.data.jpa.domain.Specification;

public final class JobSpecifications {

    private JobSpecifications() {
    }

    public static Specification<Job> titleContains(String title) {
        return (root, query, cb) -> title == null
                ? null
                : cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    public static Specification<Job> locationContains(String location) {
        return (root, query, cb) -> location == null
                ? null
                : cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
    }

    public static Specification<Job> hasWorkplace(Workplace workplace) {
        return (root, query, cb) -> workplace == null ? null : cb.equal(root.get("workplace"), workplace);
    }

    public static Specification<Job> hasExperience(ExperienceLevel experience) {
        return (root, query, cb) -> experience == null ? null : cb.equal(root.get("experience"), experience);
    }

    public static Specification<Job> hasEmploymentType(String employmentType) {
        return (root, query, cb) -> employmentType == null
                ? null
                : cb.equal(cb.lower(root.get("employmentType")), employmentType.toLowerCase());
    }

    public static Specification<Job> hasCompanyId(UUID companyId) {
        return (root, query, cb) -> companyId == null ? null : cb.equal(root.get("companyId"), companyId);
    }

    public static Specification<Job> hasStatus(JobStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
}
