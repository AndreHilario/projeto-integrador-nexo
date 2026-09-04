package com.nexo.auth.dto;

import com.nexo.auth.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotNull
    @Size(min = 2, max = 150)
    private String name;

    @NotNull
    @Email
    @Size(max = 150)
    private String email;

    @NotNull
    @Size(min = 8, max = 72)
    private String password;

    @NotNull
    private UserRole role;
}
