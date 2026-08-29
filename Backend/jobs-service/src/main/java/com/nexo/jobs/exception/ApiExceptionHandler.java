package com.nexo.jobs.exception;

import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequest(BadRequestException ex) {
        log.warn("400 Bad Request: {}", ex.getMessage());
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(ResourceNotFoundException ex) {
        log.warn("404 Not Found: {}", ex.getMessage());
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler({UnauthorizedException.class, AuthenticationException.class})
    public ResponseEntity<Object> handleUnauthorized(RuntimeException ex) {
        log.warn("401 Unauthorized: {}", ex.getMessage());
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex) {
        log.warn("403 Forbidden: {}", ex.getMessage());
        return build(HttpStatus.FORBIDDEN, "Este usuário não tem permissão para acessar este recurso.");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Dados inválidos.");
        log.warn("400 Bad Request (validação): {}", message);
        return build(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnexpected(Exception ex) {
        log.error("500 Internal Server Error não tratado", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado. Consulte os logs do jobs-service.");
    }

    private ResponseEntity<Object> build(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", OffsetDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
