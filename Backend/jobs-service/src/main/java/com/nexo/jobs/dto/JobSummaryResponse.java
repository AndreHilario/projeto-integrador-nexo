package com.nexo.jobs.dto;

import com.nexo.jobs.model.ExperienceLevel;
import com.nexo.jobs.model.Job;
import com.nexo.jobs.model.JobStatus;
import com.nexo.jobs.model.Workplace;
import java.time.OffsetDateTime;
import java.util.UUID;

public record JobSummaryResponse(
        UUID id,
        UUID companyId,
        String title,
        String location,
        Workplace workplace,
        ExperienceLevel experience,
        String employmentType,
        String salary,
        JobStatus status,
        Integer views,
        OffsetDateTime postedAt) {

    public static JobSummaryResponse from(Job job) {
        return new JobSummaryResponse(
                job.getId(),
                job.getCompanyId(),
                job.getTitle(),
                job.getLocation(),
                job.getWorkplace(),
                job.getExperience(),
                job.getEmploymentType(),
                job.getSalary(),
                job.getStatus(),
                job.getViews(),
                job.getPostedAt());
    }
}
