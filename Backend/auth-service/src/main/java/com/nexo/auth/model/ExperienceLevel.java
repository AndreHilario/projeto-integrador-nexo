package com.nexo.auth.model;

/**
 * Nomes das constantes batem com o tipo enum "experience_level" do banco
 * (ver Backend/dbfiles/01_init.sql), usado pelo mapeamento NAMED_ENUM do Hibernate.
 */
public enum ExperienceLevel {
    Júnior,
    Pleno,
    Sênior
}
