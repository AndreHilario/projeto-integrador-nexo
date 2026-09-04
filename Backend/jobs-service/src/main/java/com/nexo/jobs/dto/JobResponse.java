package com.nexo.jobs.dto;

import com.nexo.jobs.model.ExperienceLevel;
import com.nexo.jobs.model.Job;
import com.nexo.jobs.model.JobStatus;
import com.nexo.jobs.model.Workplace;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record JobResponse(
        UUID id,
        UUID companyId,
        String title,
        String location,
        Workplace workplace,
        ExperienceLevel experience,
        String employmentType,
        String salary,
        String description,
        JobStatus status,
        Integer views,
        OffsetDateTime postedAt,
        OffsetDateTime updatedAt,
        List<String> responsibilities,
        List<String> requirements,
        List<String> skills,
        List<String> benefits) {

    public static JobResponse from(Job job) {
        return new JobResponse(
                job.getId(),
                job.getCompanyId(),
                job.getTitle(),
                job.getLocation(),
                job.getWorkplace(),
                job.getExperience(),
                job.getEmploymentType(),
                job.getSalary(),
                job.getDescription(),
                job.getStatus(),
                job.getViews(),
                job.getPostedAt(),
                job.getUpdatedAt(),
                job.getResponsibilities().stream().map(r -> r.getItem()).toList(),
                job.getRequirements().stream().map(r -> r.getItem()).toList(),
                job.getSkills().stream().map(s -> s.getSkill()).toList(),
                job.getBenefits().stream().map(b -> b.getItem()).toList());
    }
}
