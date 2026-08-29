package com.nexo.auth.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateNameRequest {

    @NotNull
    @Size(min = 2, max = 150)
    private String name;
}
