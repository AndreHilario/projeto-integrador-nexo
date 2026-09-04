package com.nexo.jobs.model;

/**
 * Nomes das constantes batem com o tipo enum "job_status" do banco (ver
 * Backend/dbfiles/01_init.sql), usado pelo mapeamento NAMED_ENUM do Hibernate.
 */
public enum JobStatus {
    active,
    paused,
    closed
}
