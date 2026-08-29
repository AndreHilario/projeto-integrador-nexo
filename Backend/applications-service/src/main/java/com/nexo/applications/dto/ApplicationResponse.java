package com.nexo.applications.dto;

import com.nexo.applications.model.Application;
import com.nexo.applications.model.ApplicationStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ApplicationResponse(
        UUID id,
        UUID jobId,
        UUID candidateId,
        ApplicationStatus status,
        Short matchScore,
        OffsetDateTime appliedAt,
        OffsetDateTime updatedAt) {

    public static ApplicationResponse from(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getJobId(),
                application.getCandidateId(),
                application.getStatus(),
                application.getMatchScore(),
                application.getAppliedAt(),
                application.getUpdatedAt());
    }
}
