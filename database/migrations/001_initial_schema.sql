-- ==============================================================================
-- السبع المثاني — PostgreSQL Relational Schema (Migration 001_initial_schema.sql)
-- Compliant with Sections 17, 18, 48 of Engineering Specification V1
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. USERS & RBAC TABLES
CREATE TYPE user_role_enum AS ENUM (
  'visitor', 'user', 'contributor', 'researcher', 'reviewer', 'editor', 'admin', 'super_admin'
);

CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'pending_verification');

CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  salt VARCHAR(64) NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'user',
  status user_status_enum NOT NULL DEFAULT 'active',
  locale VARCHAR(10) NOT NULL DEFAULT 'ar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role user_role_enum NOT NULL,
  permission_code VARCHAR(64) NOT NULL REFERENCES permissions(code) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_code)
);

-- 2. CATEGORIES, FIELDS, SCHOOLS & TARIQAS
CREATE TABLE categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fields (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE schools (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  founder_person_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tariqas (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  founder_person_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PERSONS (THE CENTRAL ENTITY)
CREATE TYPE gender_enum AS ENUM ('male', 'female');
CREATE TYPE verification_status_enum AS ENUM ('draft', 'under_review', 'verified', 'disputed', 'rejected');

CREATE TABLE persons (
  id VARCHAR(64) PRIMARY KEY,
  primary_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  gender gender_enum NOT NULL DEFAULT 'male',
  birth_date VARCHAR(64),
  birth_date_hijri INT,
  death_date VARCHAR(64),
  death_date_hijri INT,
  era VARCHAR(128),
  primary_school_id VARCHAR(64) REFERENCES schools(id) ON DELETE SET NULL,
  primary_tariqa_id VARCHAR(64) REFERENCES tariqas(id) ON DELETE SET NULL,
  short_bio TEXT,
  avatar_url TEXT,
  verification_status verification_status_enum NOT NULL DEFAULT 'under_review',
  is_published BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE person_names (
  id VARCHAR(64) PRIMARY KEY,
  person_id VARCHAR(64) NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(64) NOT NULL, -- full_name, kunya, laqab, nisba, honorific
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE person_titles (
  id VARCHAR(64) PRIMARY KEY,
  person_id VARCHAR(64) NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(64),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE person_biographies (
  id VARCHAR(64) PRIMARY KEY,
  person_id VARCHAR(64) NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  biography_type VARCHAR(64) NOT NULL, -- academic, summary, lineage, spiritual
  content TEXT NOT NULL,
  source_summary TEXT,
  language VARCHAR(10) NOT NULL DEFAULT 'ar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. RELATIONSHIPS & SANAD CHAINS
CREATE TABLE relationship_types (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  name_ar VARCHAR(255) NOT NULL,
  reverse_name_ar VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL, -- family, educational, spiritual, contemporary
  directed BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE relationships (
  id VARCHAR(64) PRIMARY KEY,
  from_person_id VARCHAR(64) NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  to_person_id VARCHAR(64) NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  relationship_type_id VARCHAR(64) NOT NULL REFERENCES relationship_types(id) ON DELETE RESTRICT,
  strength INT NOT NULL DEFAULT 5 CHECK (strength BETWEEN 1 AND 5),
  verification_status verification_status_enum NOT NULL DEFAULT 'under_review',
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_no_self_relation CHECK (from_person_id <> to_person_id)
);

-- 5. TREES (PROJECTIONS & VIEWS)
CREATE TYPE tree_type_enum AS ENUM (
  'lineage', 'spiritual_chain', 'scholarly_chain', 'thematic', 'geographic', 'temporal', 'custom'
);

CREATE TABLE trees (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  tree_type tree_type_enum NOT NULL DEFAULT 'thematic',
  root_person_id VARCHAR(64) REFERENCES persons(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tree_nodes (
  id VARCHAR(64) PRIMARY KEY,
  tree_id VARCHAR(64) NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
  person_id VARCHAR(64) NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  parent_node_id VARCHAR(64) REFERENCES tree_nodes(id) ON DELETE SET NULL,
  position_x FLOAT,
  position_y FLOAT,
  level INT NOT NULL DEFAULT 0,
  custom_label VARCHAR(255),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tree_id, person_id)
);

CREATE TABLE tree_edges (
  id VARCHAR(64) PRIMARY KEY,
  tree_id VARCHAR(64) NOT NULL REFERENCES trees(id) ON DELETE CASCADE,
  relationship_id VARCHAR(64) REFERENCES relationships(id) ON DELETE CASCADE,
  from_node_id VARCHAR(64) NOT NULL REFERENCES tree_nodes(id) ON DELETE CASCADE,
  to_node_id VARCHAR(64) NOT NULL REFERENCES tree_nodes(id) ON DELETE CASCADE,
  label VARCHAR(255),
  edge_style JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SOURCES, BOOKS, CITATIONS, AND CONTENT CLAIMS
CREATE TYPE source_type_enum AS ENUM (
  'book', 'manuscript', 'oral_chain', 'article', 'official_record', 'document'
);

CREATE TABLE sources (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  publication_year INT,
  publisher VARCHAR(255),
  source_type source_type_enum NOT NULL DEFAULT 'book',
  verification_level INT NOT NULL DEFAULT 5 CHECK (verification_level BETWEEN 1 AND 5),
  description TEXT,
  url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE books (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  slug VARCHAR(255) NOT NULL UNIQUE,
  author_person_id VARCHAR(64) REFERENCES persons(id) ON DELETE SET NULL,
  field_id VARCHAR(64) REFERENCES fields(id) ON DELETE SET NULL,
  description TEXT,
  language VARCHAR(10) NOT NULL DEFAULT 'ar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE citations (
  id VARCHAR(64) PRIMARY KEY,
  source_id VARCHAR(64) NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  entity_type VARCHAR(64) NOT NULL, -- person, relationship, claim
  entity_id VARCHAR(64) NOT NULL,
  volume VARCHAR(32),
  page VARCHAR(32),
  hadith_number VARCHAR(32),
  quote TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE claims (
  id VARCHAR(64) PRIMARY KEY,
  claim_text TEXT NOT NULL,
  claim_type VARCHAR(64) NOT NULL, -- title_origin, genealogy, spiritual_link
  entity_id VARCHAR(64) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  verification_status verification_status_enum NOT NULL DEFAULT 'under_review',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE claim_sources (
  claim_id VARCHAR(64) NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  source_id VARCHAR(64) NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  citation_id VARCHAR(64) REFERENCES citations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(claim_id, source_id)
);

-- 7. PLACES & SHRINES
CREATE TABLE places (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  modern_country VARCHAR(128),
  historical_region VARCHAR(128),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shrines (
  id VARCHAR(64) PRIMARY KEY,
  person_id VARCHAR(64) NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
  place_id VARCHAR(64) NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  verification_status verification_status_enum NOT NULL DEFAULT 'verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CONTRIBUTIONS, REVISIONS & AUDIT LOGS
CREATE TYPE contribution_status_enum AS ENUM ('submitted', 'under_review', 'approved', 'rejected');
CREATE TYPE contribution_action_enum AS ENUM ('create', 'update', 'delete', 'source_add');

CREATE TABLE contributions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  user_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64),
  action contribution_action_enum NOT NULL DEFAULT 'update',
  payload JSONB NOT NULL,
  status contribution_status_enum NOT NULL DEFAULT 'submitted',
  reviewer_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE revisions (
  id VARCHAR(64) PRIMARY KEY,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  revision_number INT NOT NULL,
  data_before JSONB,
  data_after JSONB NOT NULL,
  changed_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(128) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64),
  ip_address VARCHAR(64),
  user_agent TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX idx_persons_slug ON persons(slug);
CREATE INDEX idx_persons_death_hijri ON persons(death_date_hijri);
CREATE INDEX idx_persons_school ON persons(primary_school_id);
CREATE INDEX idx_persons_tariqa ON persons(primary_tariqa_id);
CREATE INDEX idx_relationships_from ON relationships(from_person_id);
CREATE INDEX idx_relationships_to ON relationships(to_person_id);
CREATE INDEX idx_relationships_type ON relationships(relationship_type_id);
CREATE INDEX idx_citations_entity ON citations(entity_type, entity_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_tree_nodes_tree ON tree_nodes(tree_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
