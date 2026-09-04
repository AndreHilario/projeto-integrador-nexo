-- Script de inicializacao do banco Nexo
-- Executado automaticamente pelo container Postgres na primeira subida
-- (arquivos em /docker-entrypoint-initdb.d rodam apenas quando o volume de dados esta vazio)

CREATE TYPE user_role AS ENUM ('candidate', 'company');
CREATE TYPE workplace AS ENUM ('Remoto', 'Híbrido', 'Presencial');
CREATE TYPE experience_level AS ENUM ('Júnior', 'Pleno', 'Sênior');
CREATE TYPE job_status AS ENUM ('active', 'paused', 'closed');
CREATE TYPE application_status AS ENUM ('applied', 'screening', 'interview', 'approved', 'rejected');

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role          user_role NOT NULL,
    name          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE candidate_profiles (
    user_id            UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    phone              VARCHAR(30),
    city               VARCHAR(100),
    headline           VARCHAR(150),
    area               VARCHAR(100),
    experience         experience_level,
    preferred_workplace workplace,
    resume_name        VARCHAR(255),
    bio                TEXT
);

CREATE TABLE candidate_skills (
    id             BIGSERIAL PRIMARY KEY,
    candidate_id   UUID NOT NULL REFERENCES candidate_profiles(user_id) ON DELETE CASCADE,
    skill          VARCHAR(100) NOT NULL
);

CREATE TABLE company_profiles (
    user_id     UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    legal_name  VARCHAR(150),
    document    VARCHAR(30),
    sector      VARCHAR(100),
    size        VARCHAR(50),
    city        VARCHAR(100),
    website     VARCHAR(255),
    about       TEXT
);

CREATE TABLE jobs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title            VARCHAR(150) NOT NULL,
    location         VARCHAR(150),
    workplace        workplace,
    experience       experience_level,
    employment_type  VARCHAR(50),
    salary           VARCHAR(100),
    description      TEXT,
    status           job_status NOT NULL DEFAULT 'active',
    views            INTEGER NOT NULL DEFAULT 0,
    posted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE job_responsibilities (
    id      BIGSERIAL PRIMARY KEY,
    job_id  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    item    TEXT NOT NULL
);

CREATE TABLE job_requirements (
    id      BIGSERIAL PRIMARY KEY,
    job_id  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    item    TEXT NOT NULL
);

CREATE TABLE job_skills (
    id      BIGSERIAL PRIMARY KEY,
    job_id  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill   VARCHAR(100) NOT NULL
);

CREATE TABLE job_benefits (
    id      BIGSERIAL PRIMARY KEY,
    job_id  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    item    TEXT NOT NULL
);

CREATE TABLE applications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        application_status NOT NULL DEFAULT 'applied',
    match_score   SMALLINT,
    applied_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, candidate_id)
);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_candidate_skills_candidate_id ON candidate_skills(candidate_id);
CREATE INDEX idx_job_skills_job_id ON job_skills(job_id);
