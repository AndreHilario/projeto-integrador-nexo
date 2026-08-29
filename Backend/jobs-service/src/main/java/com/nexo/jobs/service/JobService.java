package com.nexo.jobs.service;

import com.nexo.jobs.dto.JobRequest;
import com.nexo.jobs.exception.ResourceNotFoundException;
import com.nexo.jobs.model.ExperienceLevel;
import com.nexo.jobs.model.Job;
import com.nexo.jobs.model.JobBenefit;
import com.nexo.jobs.model.JobRequirement;
import com.nexo.jobs.model.JobResponsibility;
import com.nexo.jobs.model.JobSkill;
import com.nexo.jobs.model.JobStatus;
import com.nexo.jobs.model.Workplace;
import com.nexo.jobs.repository.JobRepository;
import com.nexo.jobs.repository.JobSpecifications;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private static final Logger log = LoggerFactory.getLogger(JobService.class);

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Transactional(readOnly = true)
    public List<Job> search(
            String title,
            String location,
            Workplace workplace,
            ExperienceLevel experience,
            String employmentType,
            UUID companyId,
            JobStatus status) {
        JobStatus effectiveStatus = status != null ? status : (companyId == null ? JobStatus.active : null);

        Specification<Job> spec = Specification.allOf(
                JobSpecifications.titleContains(title),
                JobSpecifications.locationContains(location),
                JobSpecifications.hasWorkplace(workplace),
                JobSpecifications.hasExperience(experience),
                JobSpecifications.hasEmploymentType(employmentType),
                JobSpecifications.hasCompanyId(companyId),
                JobSpecifications.hasStatus(effectiveStatus));

        log.debug("Buscando vagas com filtros title={} location={} companyId={} status={}", title, location, companyId, effectiveStatus);
        return jobRepository.findAll(spec);
    }

    @Transactional
    public Job getDetailAndRegisterView(UUID jobId) {
        Job job = getOwnedOrAny(jobId, null);
        job.setViews(job.getViews() + 1);
        touchDetails(job);
        return job;
    }

    @Transactional
    public Job create(UUID companyId, JobRequest request) {
        log.info("Criando vaga para companyId={}", companyId);
        Job job = new Job();
        job.setCompanyId(companyId);
        applyRequest(job, request, true);
        Job saved = jobRepository.save(job);
        log.debug("Vaga criada id={}", saved.getId());
        return saved;
    }

    @Transactional
    public Job update(UUID jobId, UUID companyId, JobRequest request) {
        log.info("Atualizando vaga id={} companyId={}", jobId, companyId);
        Job job = getOwnedOrAny(jobId, companyId);
        applyRequest(job, request, false);
        Job saved = jobRepository.save(job);
        touchDetails(saved);
        return saved;
    }

    @Transactional
    public void delete(UUID jobId, UUID companyId) {
        log.info("Removendo vaga id={} companyId={}", jobId, companyId);
        Job job = getOwnedOrAny(jobId, companyId);
        jobRepository.delete(job);
    }

    private Job getOwnedOrAny(UUID jobId, UUID requiredCompanyId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> {
                    log.warn("Vaga não encontrada id={}", jobId);
                    return new ResourceNotFoundException("Vaga não encontrada.");
                });
        if (requiredCompanyId != null && !job.getCompanyId().equals(requiredCompanyId)) {
            log.warn("companyId={} tentou acessar vaga id={} de outra empresa", requiredCompanyId, jobId);
            throw new AccessDeniedException("Esta vaga pertence a outra empresa.");
        }
        return job;
    }

    private void applyRequest(Job job, JobRequest request, boolean isCreate) {
        job.setTitle(request.getTitle());
        job.setLocation(request.getLocation());
        job.setWorkplace(request.getWorkplace());
        job.setExperience(request.getExperience());
        job.setEmploymentType(request.getEmploymentType());
        job.setSalary(request.getSalary());
        job.setDescription(request.getDescription());

        if (!isCreate && request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        if (request.getResponsibilities() != null) {
            job.getResponsibilities().clear();
            request.getResponsibilities().forEach(item -> job.getResponsibilities().add(new JobResponsibility(job, item)));
        }

        if (request.getRequirements() != null) {
            job.getRequirements().clear();
            request.getRequirements().forEach(item -> job.getRequirements().add(new JobRequirement(job, item)));
        }

        if (request.getSkills() != null) {
            job.getSkills().clear();
            request.getSkills().forEach(skill -> job.getSkills().add(new JobSkill(job, skill)));
        }

        if (request.getBenefits() != null) {
            job.getBenefits().clear();
            request.getBenefits().forEach(item -> job.getBenefits().add(new JobBenefit(job, item)));
        }
    }

    /** Força a inicialização das coleções LAZY dentro da transação antes de mapear para o DTO. */
    private void touchDetails(Job job) {
        job.getResponsibilities().size();
        job.getRequirements().size();
        job.getSkills().size();
        job.getBenefits().size();
    }
}
