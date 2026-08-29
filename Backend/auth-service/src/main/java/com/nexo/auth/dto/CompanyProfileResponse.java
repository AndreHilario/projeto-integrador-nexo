package com.nexo.auth.dto;

import com.nexo.auth.model.CompanyProfile;
import java.util.UUID;

public record CompanyProfileResponse(
        UUID userId,
        String legalName,
        String document,
        String sector,
        String size,
        String city,
        String website,
        String about) {

    public static CompanyProfileResponse from(CompanyProfile profile) {
        return new CompanyProfileResponse(
                profile.getUserId(),
                profile.getLegalName(),
                profile.getDocument(),
                profile.getSector(),
                profile.getSize(),
                profile.getCity(),
                profile.getWebsite(),
                profile.getAbout());
    }
}
