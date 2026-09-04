package com.nexo.applications.controller;

import com.nexo.applications.dto.ApplicationRequest;
import com.nexo.applications.dto.ApplicationResponse;
import com.nexo.applications.dto.ApplicationStatusUpdateRequest;
import com.nexo.applications.exception.BadRequestException;
import com.nexo.applications.model.Application;
import com.nexo.applications.service.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApplicationController {

    private static final Logger log = LoggerFactory.getLogger(ApplicationController.class);

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/applications")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CANDIDATE')")
    public ApplicationResponse create(Authentication authentication, @Valid @RequestBody ApplicationRequest request) {
        log.info("POST /applications principal={}", authentication.getName());
        return ApplicationResponse.from(applicationService.create(currentUserId(authentication), request));
    }

    @GetMapping("/applications")
    public List<ApplicationResponse> list(Authentication authentication, @RequestParam(required = false) UUID jobId) {
        log.debug("GET /applications principal={} jobId={}", authentication.getName(), jobId);
        List<Application> applications;
        if (isCompany(authentication)) {
            if (jobId == null) {
                throw new BadRequestException("O parâmetro jobId é obrigatório para empresas.");
            }
            applications = applicationService.listByJob(jobId);
        } else {
            applications = applicationService.listByCandidate(currentUserId(authentication));
        }
        return applications.stream().map(ApplicationResponse::from).toList();
    }

    @GetMapping("/applications/{applicationId}")
    public ApplicationResponse getById(Authentication authentication, @PathVariable UUID applicationId) {
        log.debug("GET /applications/{} principal={}", applicationId, authentication.getName());
        UUID candidateId = isCompany(authentication) ? null : currentUserId(authentication);
        return ApplicationResponse.from(applicationService.getById(applicationId, candidateId));
    }

    @PutMapping("/applications/{applicationId}")
    @PreAuthorize("hasRole('COMPANY')")
    public ApplicationResponse updateStatus(
            Authentication authentication,
            @PathVariable UUID applicationId,
            @Valid @RequestBody ApplicationStatusUpdateRequest request) {
        log.info("PUT /applications/{} principal={}", applicationId, authentication.getName());
        return ApplicationResponse.from(applicationService.updateStatus(applicationId, request));
    }

    private UUID currentUserId(Authentication authentication) {
        return UUID.fromString(authentication.getName());
    }

    private boolean isCompany(Authentication authentication) {
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_COMPANY"));
    }
}
