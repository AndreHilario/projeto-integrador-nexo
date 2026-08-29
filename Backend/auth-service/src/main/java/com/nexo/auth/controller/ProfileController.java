package com.nexo.auth.controller;

import com.nexo.auth.dto.CandidateProfileRequest;
import com.nexo.auth.dto.CandidateProfileResponse;
import com.nexo.auth.dto.CompanyProfileRequest;
import com.nexo.auth.dto.CompanyProfileResponse;
import com.nexo.auth.service.ProfileService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    private static final Logger log = LoggerFactory.getLogger(ProfileController.class);

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public CandidateProfileResponse getCandidateProfile(Authentication authentication) {
        log.debug("GET /profile/candidate principal={}", authentication.getName());
        return CandidateProfileResponse.from(profileService.getCandidateProfile(currentUserId(authentication)));
    }

    @PutMapping("/profile/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public CandidateProfileResponse updateCandidateProfile(
            Authentication authentication, @Valid @RequestBody CandidateProfileRequest request) {
        log.info("PUT /profile/candidate principal={}", authentication.getName());
        return CandidateProfileResponse.from(
                profileService.updateCandidateProfile(currentUserId(authentication), request));
    }

    @GetMapping("/profile/company")
    @PreAuthorize("hasRole('COMPANY')")
    public CompanyProfileResponse getCompanyProfile(Authentication authentication) {
        log.debug("GET /profile/company principal={}", authentication.getName());
        return CompanyProfileResponse.from(profileService.getCompanyProfile(currentUserId(authentication)));
    }

    @PutMapping("/profile/company")
    @PreAuthorize("hasRole('COMPANY')")
    public CompanyProfileResponse updateCompanyProfile(
            Authentication authentication, @Valid @RequestBody CompanyProfileRequest request) {
        log.info("PUT /profile/company principal={}", authentication.getName());
        return CompanyProfileResponse.from(
                profileService.updateCompanyProfile(currentUserId(authentication), request));
    }

    private UUID currentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
