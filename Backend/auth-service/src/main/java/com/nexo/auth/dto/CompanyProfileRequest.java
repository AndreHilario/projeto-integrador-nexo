package com.nexo.auth.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyProfileRequest {

    @Size(max = 150)
    private String legalName;

    @Size(max = 30)
    private String document;

    @Size(max = 100)
    private String sector;

    @Size(max = 50)
    private String size;

    @Size(max = 100)
    private String city;

    @Size(max = 255)
    private String website;

    private String about;
}
