package com.nexo.auth.dto;

public record AuthResponse(String token, UserResponse user) {
}
