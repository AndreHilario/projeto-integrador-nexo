package com.nexo.auth.model;

/**
 * Os nomes das constantes precisam bater exatamente com os labels do tipo
 * enum "user_role" criado em Backend/dbfiles/01_init.sql, pois o Hibernate
 * mapeia por nome via {@code @JdbcTypeCode(SqlTypes.NAMED_ENUM)}.
 */
public enum UserRole {
    candidate,
    company
}
