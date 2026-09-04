package com.nexo.applications.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationRequest {

    @NotNull
    private UUID jobId;

    /** Compatibilidade candidato/vaga calculada pelo cliente no momento da candidatura. */
    @Min(0)
    @Max(100)
    private Short matchScore;
}
