package com.nexo.auth.repository;

import com.nexo.auth.model.CandidateProfile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, UUID> {

    /**
     * skills é LAZY e open-in-view está desligado; sem o fetch adiantado aqui,
     * serializar a resposta fora da transação dispara LazyInitializationException.
     */
    @EntityGraph(attributePaths = "skills")
    Optional<CandidateProfile> findWithSkillsByUserId(UUID userId);
}
