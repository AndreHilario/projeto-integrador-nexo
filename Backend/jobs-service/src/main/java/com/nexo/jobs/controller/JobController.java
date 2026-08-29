package com.nexo.jobs.controller;

import com.nexo.jobs.dto.JobRequest;
import com.nexo.jobs.dto.JobResponse;
import com.nexo.jobs.dto.JobSummaryResponse;
import com.nexo.jobs.model.ExperienceLevel;
import com.nexo.jobs.model.JobStatus;
import com.nexo.jobs.model.Workplace;
import com.nexo.jobs.service.JobService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JobController {

    private static final Logger log = LoggerFactory.getLogger(JobController.class);

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/jobs")
    public List<JobSummaryResponse> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Workplace workplace,
            @RequestParam(required = false) ExperienceLevel experience,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) UUID companyId,
            @RequestParam(required = false) JobStatus status) {
        log.debug("GET /jobs title={} location={} companyId={} status={}", title, location, companyId, status);
        return jobService.search(title, location, workplace, experience, employmentType, companyId, status).stream()
                .map(JobSummaryResponse::from)
                .toList();
    }

    @GetMapping("/jobs/{jobId}")
    public JobResponse getById(@PathVariable UUID jobId) {
        log.debug("GET /jobs/{}", jobId);
        return JobResponse.from(jobService.getDetailAndRegisterView(jobId));
    }

    @PostMapping("/jobs")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('COMPANY')")
    public JobResponse create(Authentication authentication, @Valid @RequestBody JobRequest request) {
        log.info("POST /jobs principal={}", authentication.getName());
        return JobResponse.from(jobService.create(currentUserId(authentication), request));
    }

    @PutMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('COMPANY')")
    public JobResponse update(
            Authentication authentication, @PathVariable UUID jobId, @Valid @RequestBody JobRequest request) {
        log.info("PUT /jobs/{} principal={}", jobId, authentication.getName());
        return JobResponse.from(jobService.update(jobId, currentUserId(authentication), request));
    }

    @DeleteMapping("/jobs/{jobId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('COMPANY')")
    public void delete(Authentication authentication, @PathVariable UUID jobId) {
        log.info("DELETE /jobs/{} principal={}", jobId, authentication.getName());
        jobService.delete(jobId, currentUserId(authentication));
    }

    private UUID currentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }
}
