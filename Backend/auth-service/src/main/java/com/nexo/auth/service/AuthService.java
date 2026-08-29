package com.nexo.auth.service;

import com.nexo.auth.dto.AuthResponse;
import com.nexo.auth.dto.LoginRequest;
import com.nexo.auth.dto.RegisterRequest;
import com.nexo.auth.dto.UserResponse;
import com.nexo.auth.exception.BadRequestException;
import com.nexo.auth.exception.UnauthorizedException;
import com.nexo.auth.model.CandidateProfile;
import com.nexo.auth.model.CompanyProfile;
import com.nexo.auth.model.User;
import com.nexo.auth.model.UserRole;
import com.nexo.auth.repository.CandidateProfileRepository;
import com.nexo.auth.repository.CompanyProfileRepository;
import com.nexo.auth.repository.UserRepository;
import com.nexo.auth.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            CandidateProfileRepository candidateProfileRepository,
            CompanyProfileRepository companyProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registrando novo usuário email={} role={}", request.getEmail(), request.getRole());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registro recusado: e-mail já cadastrado email={}", request.getEmail());
            throw new BadRequestException("Já existe um usuário cadastrado com este e-mail.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user = userRepository.save(user);
        log.debug("Usuário criado id={}", user.getId());

        if (user.getRole() == UserRole.candidate) {
            CandidateProfile profile = new CandidateProfile();
            profile.setUser(user);
            candidateProfileRepository.save(profile);
        } else {
            CompanyProfile profile = new CompanyProfile();
            profile.setUser(user);
            companyProfileRepository.save(profile);
        }
        log.debug("Perfil vazio criado para userId={}", user.getId());

        String token = jwtService.generateToken(user);
        log.info("Registro concluído com sucesso userId={}", user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Tentativa de login email={}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login recusado: e-mail não encontrado email={}", request.getEmail());
                    return new UnauthorizedException("E-mail ou senha inválidos.");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Login recusado: senha incorreta userId={}", user.getId());
            throw new UnauthorizedException("E-mail ou senha inválidos.");
        }

        String token = jwtService.generateToken(user);
        log.info("Login concluído com sucesso userId={}", user.getId());
        return new AuthResponse(token, UserResponse.from(user));
    }
}
