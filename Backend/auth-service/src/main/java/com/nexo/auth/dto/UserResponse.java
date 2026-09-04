package com.nexo.auth.dto;

import com.nexo.auth.model.User;
import com.nexo.auth.model.UserRole;
import java.time.OffsetDateTime;
import java.util.UUID;

public record UserResponse(UUID id, String name, String email, UserRole role, OffsetDateTime createdAt) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
