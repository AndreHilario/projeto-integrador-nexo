package com.nexo.auth.repository;

import com.nexo.auth.model.CompanyProfile;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, UUID> {
}
