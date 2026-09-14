/**
 * السبع المثاني — Core Domain Types & Knowledge Graph Schemas
 * Architectural Standard: Engineering Specification V1
 */

export type EntityStatus = 'draft' | 'pending_review' | 'published' | 'archived' | 'rejected';

export type VerificationStatus = 
  | 'unverified' 
  | 'partially_verified' 
  | 'verified' 
  | 'disputed' 
  | 'rejected';

export type ConfidenceLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export type DatePrecision = 'exact' | 'year' | 'month' | 'century' | 'approximate' | 'unknown';

export type NameType = 
  | 'full_name' 
  | 'kunya' 
  | 'laqab' 
  | 'nisba' 
  | 'alternative' 
  | 'historical' 
  | 'common' 
  | 'transliteration';

export type BioSectionType = 
  | 'overview' 
  | 'birth' 
  | 'education' 
  | 'teachers' 
  | 'students' 
  | 'career' 
  | 'spiritual_life' 
  | 'works' 
  | 'death' 
  | 'legacy' 
  | 'historical_context';

export type TreeType = 
  | 'genealogy' 
  | 'scholars' 
  | 'madhhab' 
  | 'tariqa' 
  | 'spiritual_lineage' 
  | 'historical' 
  | 'sab_mathani'
  | 'custom';

export type SourceType = 
  | 'book' 
  | 'manuscript' 
  | 'article' 
  | 'website' 
  | 'archive' 
  | 'oral_tradition' 
  | 'document' 
  | 'interview' 
  | 'other';

export type SupportType = 'supports' | 'contradicts' | 'mentions';

export type AuthorRole = 
  | 'author' 
  | 'compiler' 
  | 'editor' 
  | 'translator' 
  | 'commentator' 
  | 'attributed_author';

export type ContributionAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'relationship_add' 
  | 'relationship_update' 
  | 'source_add';

export type ContributionStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export type UserRole = 
  | 'visitor' 
  | 'user' 
  | 'contributor' 
  | 'researcher' 
  | 'reviewer' 
  | 'editor' 
  | 'admin' 
  | 'super_admin';

// --- Domain Entities ---

export interface PersonName {
  id: string;
  person_id: string;
  name: string;
  language: string;
  name_type: NameType;
  is_primary: boolean;
  source_id?: string;
}

export interface PersonTitle {
  id: string;
  person_id: string;
  title: string;
  description?: string;
  language?: string;
  source_id?: string;
}

export interface PersonBiography {
  id: string;
  person_id: string;
  section_type: BioSectionType;
  title: string;
  content: string;
  order_index: number;
  source_id?: string;
  status: EntityStatus;
}

export interface Person {
  id: string;
  slug: string;
  primary_name: string;
  short_bio?: string;
  full_bio?: string;
  birth_date?: string;
  death_date?: string;
  birth_date_precision?: DatePrecision;
  death_date_precision?: DatePrecision;
  birth_place_id?: string;
  death_place_id?: string;
  gender: 'male' | 'female';
  era_id?: string;
  is_deceased: boolean;
  avatar_url?: string;
  category_ids: string[];
  school_id?: string;
  tariqa_id?: string;
  status: EntityStatus;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by?: string;
}

export interface RelationshipType {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  reverse_code?: string;
  category: 'family' | 'scholarly' | 'spiritual' | 'contemporary' | 'association';
  description?: string;
}

export interface Relationship {
  id: string;
  source_person_id: string;
  target_person_id: string;
  relationship_type_id: string;
  relationship_type_code: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  confidence: ConfidenceLevel;
  verification_status: VerificationStatus;
  status: EntityStatus;
  source_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Tree {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tree_type: TreeType;
  category_id?: string;
  root_person_id?: string;
  visibility: 'public' | 'private' | 'unlisted';
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface TreeNode {
  id: string;
  tree_id: string;
  entity_type: 'person' | 'category' | 'school' | 'tariqa' | 'book';
  entity_id: string;
  parent_node_id?: string;
  position_x?: number;
  position_y?: number;
  sort_order?: number;
  metadata?: Record<string, unknown>;
}

export interface TreeEdge {
  id: string;
  tree_id: string;
  source_node_id: string;
  target_node_id: string;
  relationship_type_id: string;
  label?: string;
  style?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  status: EntityStatus;
}

export interface Field {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
}

export interface Tariqa {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  founder_person_id?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  description?: string;
  publication_year?: number;
  language: string;
  isbn?: string;
  publisher?: string;
  edition?: string;
  volume_count?: number;
  author_person_id?: string;
  author_role: AuthorRole;
  status: EntityStatus;
}

export interface Source {
  id: string;
  title: string;
  author?: string;
  publisher?: string;
  publication_year?: number;
  edition?: string;
  volume?: string;
  page?: string;
  isbn?: string;
  url?: string;
  source_type: SourceType;
  description?: string;
  verification_status: VerificationStatus;
}

export interface Citation {
  id: string;
  source_id: string;
  page?: string;
  volume?: string;
  chapter?: string;
  quote_reference?: string;
  url?: string;
  notes?: string;
}

export interface Claim {
  id: string;
  subject_type: 'person' | 'relationship' | 'event' | 'book';
  subject_id: string;
  predicate: string;
  object_type?: string;
  object_id?: string;
  object_value?: string;
  confidence: ConfidenceLevel;
  status: EntityStatus;
  verification_status: VerificationStatus;
  created_by?: string;
}

export interface ClaimSource {
  claim_id: string;
  source_id: string;
  citation_id?: string;
  support_type: SupportType;
  notes?: string;
}

export interface Place {
  id: string;
  name: string;
  slug: string;
  country?: string;
  region?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

export interface Shrine {
  id: string;
  person_id: string;
  place_id: string;
  name: string;
  description?: string;
  historical_status: 'confirmed' | 'traditional' | 'disputed' | 'unknown';
  verification_status: VerificationStatus;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  event_date?: string;
  date_precision?: DatePrecision;
  place_id?: string;
  source_id?: string;
}

export interface Contribution {
  id: string;
  user_id: string;
  user_name?: string;
  entity_type: string;
  entity_id?: string;
  action: ContributionAction;
  payload: Record<string, unknown>;
  status: ContributionStatus;
  reviewer_id?: string;
  review_notes?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface Revision {
  id: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  version: number;
  before_data: Record<string, unknown>;
  after_data: Record<string, unknown>;
  change_summary: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  ip_hash?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// --- API Standard Types ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Cytoscape Graph DTO
export interface CytoscapeNodeData {
  id: string;
  label: string;
  type: string;
  avatar?: string;
  slug?: string;
  titles?: string[];
  era?: string;
  birthDeath?: string;
  degree?: number;
  tierNumber?: number;
  tierName?: string;
  realm?: string;
  duty?: string;
  roleBadge?: string;
  isKnotCompleter?: boolean;
}

export interface CytoscapeEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  typeCode: string;
  direction?: 'forward' | 'backward' | 'mutual';
  confidence?: ConfidenceLevel;
  tierRelation?: boolean;
  isKnotCompletion?: boolean;
}

export interface GraphPayload {
  tree: Tree;
  nodes: { data: CytoscapeNodeData; position?: { x: number; y: number } }[];
  edges: { data: CytoscapeEdgeData }[];
}
