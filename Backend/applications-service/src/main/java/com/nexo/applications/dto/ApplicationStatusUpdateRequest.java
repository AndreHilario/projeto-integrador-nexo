package com.nexo.applications.dto;

import com.nexo.applications.model.ApplicationStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationStatusUpdateRequest {

    @NotNull
    private ApplicationStatus status;

    @Min(0)
    @Max(100)
    private Short matchScore;
}
