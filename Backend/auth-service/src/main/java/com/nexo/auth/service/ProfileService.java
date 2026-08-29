package com.nexo.auth.service;

import com.nexo.auth.dto.CandidateProfileRequest;
import com.nexo.auth.dto.CompanyProfileRequest;
import com.nexo.auth.exception.ResourceNotFoundException;
import com.nexo.auth.model.CandidateProfile;
import com.nexo.auth.model.CandidateSkill;
import com.nexo.auth.model.CompanyProfile;
import com.nexo.auth.model.User;
import com.nexo.auth.repository.CandidateProfileRepository;
import com.nexo.auth.repository.CompanyProfileRepository;
import com.nexo.auth.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private static final Logger log = LoggerFactory.getLogger(ProfileService.class);

    private final CandidateProfileRepository candidateProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;

    public ProfileService(
            CandidateProfileRepository candidateProfileRepository,
            CompanyProfileRepository companyProfileRepository,
            UserRepository userRepository) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.userRepository = userRepository;
    }

    /** Usado por empresas para ver o perfil público de um candidato que se candidatou a uma vaga. */
    public User getCandidateUser(UUID userId) {
        log.debug("Buscando usuário candidato userId={}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("Usuário candidato não encontrado userId={}", userId);
                    return new ResourceNotFoundException("Candidato não encontrado.");
                });
    }

    public CandidateProfile getCandidateProfile(UUID userId) {
        log.debug("Buscando perfil de candidato userId={}", userId);
        return candidateProfileRepository.findWithSkillsByUserId(userId)
                .orElseThrow(() -> {
                    log.warn("Perfil de candidato não encontrado userId={}", userId);
                    return new ResourceNotFoundException("Perfil de candidato não encontrado.");
                });
    }

    @Transactional
    public CandidateProfile updateCandidateProfile(UUID userId, CandidateProfileRequest request) {
        log.info("Atualizando perfil de candidato userId={}", userId);
        CandidateProfile profile = getCandidateProfile(userId);

        profile.setPhone(request.getPhone());
        profile.setCity(request.getCity());
        profile.setHeadline(request.getHeadline());
        profile.setArea(request.getArea());
        profile.setExperience(request.getExperience());
        profile.setPreferredWorkplace(request.getPreferredWorkplace());
        profile.setResumeName(request.getResumeName());
        profile.setBio(request.getBio());

        if (request.getSkills() != null) {
            profile.getSkills().clear();
            List<CandidateSkill> skills = new ArrayList<>();
            for (String skill : request.getSkills()) {
                skills.add(new CandidateSkill(profile, skill));
            }
            profile.getSkills().addAll(skills);
        }

        CandidateProfile saved = candidateProfileRepository.save(profile);
        log.debug("Perfil de candidato atualizado userId={}", userId);
        return saved;
    }

    public CompanyProfile getCompanyProfile(UUID userId) {
        log.debug("Buscando perfil de empresa userId={}", userId);
        return companyProfileRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("Perfil de empresa não encontrado userId={}", userId);
                    return new ResourceNotFoundException("Perfil de empresa não encontrado.");
                });
    }

    @Transactional
    public CompanyProfile updateCompanyProfile(UUID userId, CompanyProfileRequest request) {
        log.info("Atualizando perfil de empresa userId={}", userId);
        CompanyProfile profile = getCompanyProfile(userId);

        profile.setLegalName(request.getLegalName());
        profile.setDocument(request.getDocument());
        profile.setSector(request.getSector());
        profile.setSize(request.getSize());
        profile.setCity(request.getCity());
        profile.setWebsite(request.getWebsite());
        profile.setAbout(request.getAbout());

        CompanyProfile saved = companyProfileRepository.save(profile);
        log.debug("Perfil de empresa atualizado userId={}", userId);
        return saved;
    }
}
