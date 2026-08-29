package com.nexo.jobs.dto;

import com.nexo.jobs.model.ExperienceLevel;
import com.nexo.jobs.model.JobStatus;
import com.nexo.jobs.model.Workplace;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    @Size(max = 150)
    private String location;

    private Workplace workplace;

    private ExperienceLevel experience;

    @Size(max = 50)
    private String employmentType;

    @Size(max = 100)
    private String salary;

    private String description;

    /** Ignorado na criação (sempre começa "active"); usado apenas em atualizações. */
    private JobStatus status;

    private List<@Size(max = 2000) String> responsibilities;

    private List<@Size(max = 2000) String> requirements;

    private List<@Size(max = 100) String> skills;

    private List<@Size(max = 2000) String> benefits;
}
