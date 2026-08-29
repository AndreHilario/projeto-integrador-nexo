package com.nexo.auth.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "company_profiles")
@Getter
@Setter
@NoArgsConstructor
public class CompanyProfile {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "legal_name", length = 150)
    private String legalName;

    @Column(length = 30)
    private String document;

    @Column(length = 100)
    private String sector;

    @Column(length = 50)
    private String size;

    @Column(length = 100)
    private String city;

    @Column(length = 255)
    private String website;

    @Column(columnDefinition = "text")
    private String about;
}
