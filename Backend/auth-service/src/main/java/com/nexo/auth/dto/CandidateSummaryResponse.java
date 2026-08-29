package com.nexo.auth.dto;

import com.nexo.auth.model.CandidateProfile;
import com.nexo.auth.model.ExperienceLevel;
import com.nexo.auth.model.User;
import com.nexo.auth.model.Workplace;
import java.util.List;
import java.util.UUID;

/**
 * Recorte público do perfil de um candidato, exposto apenas para empresas
 * (ex.: ao revisar os candidatos de uma vaga). Não inclui e-mail nem telefone.
 */
public record CandidateSummaryResponse(
        UUID userId,
        String name,
        String city,
        String headline,
        String area,
        ExperienceLevel experience,
        Workplace preferredWorkplace,
        String bio,
        List<String> skills) {

    public static CandidateSummaryResponse from(User user, CandidateProfile profile) {
        return new CandidateSummaryResponse(
                user.getId(),
                user.getName(),
                profile.getCity(),
                profile.getHeadline(),
                profile.getArea(),
                profile.getExperience(),
                profile.getPreferredWorkplace(),
                profile.getBio(),
                profile.getSkills().stream().map(s -> s.getSkill()).toList());
    }
}
