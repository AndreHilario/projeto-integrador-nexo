package com.nexo.applications.model;

/**
 * Nomes das constantes batem com o tipo enum "application_status" do banco
 * (ver Backend/dbfiles/01_init.sql), usado pelo mapeamento NAMED_ENUM do Hibernate.
 */
public enum ApplicationStatus {
    applied,
    screening,
    interview,
    approved,
    rejected
}
