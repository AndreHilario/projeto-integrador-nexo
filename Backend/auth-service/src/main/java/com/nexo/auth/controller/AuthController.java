package com.nexo.auth.controller;

import com.nexo.auth.dto.AuthResponse;
import com.nexo.auth.dto.LoginRequest;
import com.nexo.auth.dto.RegisterRequest;
import com.nexo.auth.dto.UpdateNameRequest;
import com.nexo.auth.dto.UserResponse;
import com.nexo.auth.exception.ResourceNotFoundException;
import com.nexo.auth.model.User;
import com.nexo.auth.repository.UserRepository;
import com.nexo.auth.service.AuthService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /register email={} role={}", request.getEmail(), request.getRole());
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /login email={}", request.getEmail());
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        log.debug("GET /me principal={}", authentication.getName());
        return ResponseEntity.ok(UserResponse.from(currentUser(authentication)));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            Authentication authentication, @Valid @RequestBody UpdateNameRequest request) {
        log.info("PUT /me principal={} novoNome={}", authentication.getName(), request.getName());
        User user = currentUser(authentication);
        user.setName(request.getName());
        return ResponseEntity.ok(UserResponse.from(userRepository.save(user)));
    }

    private User currentUser(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }
}
