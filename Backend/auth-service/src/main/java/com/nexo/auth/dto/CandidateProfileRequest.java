package com.nexo.auth.dto;

import com.nexo.auth.model.ExperienceLevel;
import com.nexo.auth.model.Workplace;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateProfileRequest {

    @Size(max = 30)
    private String phone;

    @Size(max = 100)
    private String city;

    @Size(max = 150)
    private String headline;

    @Size(max = 100)
    private String area;

    private ExperienceLevel experience;

    private Workplace preferredWorkplace;

    @Size(max = 255)
    private String resumeName;

    private String bio;

    private List<@Size(max = 100) String> skills;
}
