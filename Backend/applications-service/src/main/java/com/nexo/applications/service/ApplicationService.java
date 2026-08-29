package com.nexo.applications.service;

import com.nexo.applications.dto.ApplicationRequest;
import com.nexo.applications.dto.ApplicationStatusUpdateRequest;
import com.nexo.applications.exception.BadRequestException;
import com.nexo.applications.exception.ResourceNotFoundException;
import com.nexo.applications.model.Application;
import com.nexo.applications.repository.ApplicationRepository;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationService.class);

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public Application create(UUID candidateId, ApplicationRequest request) {
        log.info("Criando candidatura candidateId={} jobId={}", candidateId, request.getJobId());
        if (applicationRepository.existsByJobIdAndCandidateId(request.getJobId(), candidateId)) {
            log.warn("candidateId={} já se candidatou à vaga jobId={}", candidateId, request.getJobId());
            throw new BadRequestException("Você já se candidatou a esta vaga.");
        }

        Application application = new Application();
        application.setJobId(request.getJobId());
        application.setCandidateId(candidateId);
        application.setMatchScore(request.getMatchScore());
        Application saved = applicationRepository.save(application);
        log.debug("Candidatura criada id={}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<Application> listByCandidate(UUID candidateId) {
        log.debug("Listando candidaturas candidateId={}", candidateId);
        return applicationRepository.findByCandidateId(candidateId);
    }

    @Transactional(readOnly = true)
    public List<Application> listByJob(UUID jobId) {
        log.debug("Listando candidaturas jobId={}", jobId);
        return applicationRepository.findByJobId(jobId);
    }

    /** candidateId nulo indica acesso por uma empresa, que pode ver qualquer candidatura. */
    @Transactional(readOnly = true)
    public Application getById(UUID applicationId, UUID candidateId) {
        Application application = findOrThrow(applicationId);
        if (candidateId != null && !application.getCandidateId().equals(candidateId)) {
            log.warn("candidateId={} tentou acessar candidatura id={} de outro candidato", candidateId, applicationId);
            throw new AccessDeniedException("Esta candidatura pertence a outro candidato.");
        }
        return application;
    }

    @Transactional
    public Application updateStatus(UUID applicationId, ApplicationStatusUpdateRequest request) {
        log.info("Atualizando candidatura id={} status={}", applicationId, request.getStatus());
        Application application = findOrThrow(applicationId);
        application.setStatus(request.getStatus());
        if (request.getMatchScore() != null) {
            application.setMatchScore(request.getMatchScore());
        }
        return applicationRepository.save(application);
    }

    private Application findOrThrow(UUID applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> {
                    log.warn("Candidatura não encontrada id={}", applicationId);
                    return new ResourceNotFoundException("Candidatura não encontrada.");
                });
    }
}
