package com.nexo.auth.dto;

import com.nexo.auth.model.CandidateProfile;
import com.nexo.auth.model.ExperienceLevel;
import com.nexo.auth.model.Workplace;
import java.util.List;
import java.util.UUID;

public record CandidateProfileResponse(
        UUID userId,
        String phone,
        String city,
        String headline,
        String area,
        ExperienceLevel experience,
        Workplace preferredWorkplace,
        String resumeName,
        String bio,
        List<String> skills) {

    public static CandidateProfileResponse from(CandidateProfile profile) {
        return new CandidateProfileResponse(
                profile.getUserId(),
                profile.getPhone(),
                profile.getCity(),
                profile.getHeadline(),
                profile.getArea(),
                profile.getExperience(),
                profile.getPreferredWorkplace(),
                profile.getResumeName(),
                profile.getBio(),
                profile.getSkills().stream().map(s -> s.getSkill()).toList());
    }
}
