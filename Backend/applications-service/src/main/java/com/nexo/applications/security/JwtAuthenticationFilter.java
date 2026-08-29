package com.nexo.applications.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header == null) {
            log.debug("{} {} -> sem header Authorization", request.getMethod(), request.getRequestURI());
        } else if (!header.startsWith(BEARER_PREFIX)) {
            log.warn("{} {} -> header Authorization presente mas sem prefixo 'Bearer '", request.getMethod(), request.getRequestURI());
        } else {
            String token = header.substring(BEARER_PREFIX.length());
            try {
                Claims claims = jwtService.parseClaims(token);
                String userId = claims.getSubject();
                String role = claims.get("role", String.class);

                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
                var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("{} {} -> autenticado userId={} role={}", request.getMethod(), request.getRequestURI(), userId, role);
            } catch (JwtException | IllegalArgumentException ex) {
                SecurityContextHolder.clearContext();
                log.warn("{} {} -> token JWT inválido: {}", request.getMethod(), request.getRequestURI(), ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
