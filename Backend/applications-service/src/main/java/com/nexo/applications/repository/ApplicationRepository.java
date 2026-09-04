package com.nexo.applications.repository;

import com.nexo.applications.model.Application;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByCandidateId(UUID candidateId);

    List<Application> findByJobId(UUID jobId);

    boolean existsByJobIdAndCandidateId(UUID jobId, UUID candidateId);
}
