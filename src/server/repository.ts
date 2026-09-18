/**
 * السبع المثاني — Knowledge Repository & Domain Service
 * Clean Architecture Implementation: Memory-backed / Database-ready Repository
 */

import {
  Person,
  PersonName,
  PersonTitle,
  PersonBiography,
  Relationship,
  RelationshipType,
  Tree,
  Category,
  Field,
  School,
  Tariqa,
  Book,
  Source,
  Place,
  Claim,
  Contribution,
  Revision,
  AuditLog,
  GraphPayload,
  CytoscapeNodeData,
  CytoscapeEdgeData
} from '../core/types';
import { normalizeArabicText } from '../core/utils/arabic';
import {
  SEED_CATEGORIES,
  SEED_FIELDS,
  SEED_SCHOOLS,
  SEED_TARIQAS,
  SEED_RELATIONSHIP_TYPES,
  SEED_PLACES,
  SEED_SOURCES,
  SEED_BOOKS,
  SEED_PERSONS,
  SEED_PERSON_NAMES,
  SEED_RELATIONSHIPS,
  SEED_TREES,
  SEED_CLAIMS
} from '../data/seedData';
import {
  SAB_MATHANI_TIERS_CONFIG,
  KNOT_COMPLETERS_CONFIG
} from '../data/sabMathaniData';
import {
  getPersonClaimsAndEvidence,
  ClaimVerificationItem
} from '../data/evidenceClaimsData';
import {
  DETAILED_PLACES,
  SEED_SHRINES,
  SCHOLARLY_JOURNEYS,
  SEED_HISTORICAL_ERAS,
  PlaceWithDetails,
  ShrineWithPerson,
  ScholarlyJourney,
  HistoricalEra
} from '../data/placesShrinesData';
import { getSupabaseClient } from './supabase';

class KnowledgeRepository {
  private categories: Category[] = [...SEED_CATEGORIES];
  private fields: Field[] = [...SEED_FIELDS];
  private schools: School[] = [...SEED_SCHOOLS];
  private tariqas: Tariqa[] = [...SEED_TARIQAS];
  private relationshipTypes: RelationshipType[] = [...SEED_RELATIONSHIP_TYPES];
  private places: PlaceWithDetails[] = [...DETAILED_PLACES];
  private shrines: ShrineWithPerson[] = [...SEED_SHRINES];
  private scholarlyJourneys: ScholarlyJourney[] = [...SCHOLARLY_JOURNEYS];
  private historicalEras: HistoricalEra[] = [...SEED_HISTORICAL_ERAS];
  private sources: Source[] = [...SEED_SOURCES];
  private books: Book[] = [...SEED_BOOKS];
  private persons: Person[] = [...SEED_PERSONS];
  private personNames: PersonName[] = [...SEED_PERSON_NAMES];
  private relationships: Relationship[] = [...SEED_RELATIONSHIPS];
  private trees: Tree[] = [...SEED_TREES];
  private claims: Claim[] = [...SEED_CLAIMS];
  private contributions: Contribution[] = [
    {
      id: 'contrib-demo-1',
      user_id: 'usr-researcher-1',
      user_name: 'الباحث التوثيقي',
      entity_type: 'person',
      action: 'update',
      payload: {
        person_id: 'person-shafii',
        field: 'short_bio',
        suggestion: 'إضافة توثيق حول إقامته الأخيرة بالفسطاط بمصر وتأليف مذهبه الجديد.'
      },
      status: 'under_review',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];
  private revisions: Revision[] = [];
  private auditLogs: AuditLog[] = [];

  // --- Persons ---
  public getPersons(filter?: {
    category?: string;
    school?: string;
    tariqa?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let items = this.persons.filter(p => p.status === (filter?.status || 'published'));

    if (filter?.category) {
      items = items.filter(p => p.category_ids.includes(filter.category!));
    }
    if (filter?.school) {
      items = items.filter(p => p.school_id === filter.school);
    }
    if (filter?.tariqa) {
      items = items.filter(p => p.tariqa_id === filter.tariqa);
    }
    if (filter?.search) {
      const q = normalizeArabicText(filter.search);
      items = items.filter(p => {
        const matchName = normalizeArabicText(p.primary_name).includes(q);
        const matchBio = normalizeArabicText(p.short_bio || '').includes(q);
        const matchAlt = this.personNames
          .filter(n => n.person_id === p.id)
          .some(n => normalizeArabicText(n.name).includes(q));
        return matchName || matchBio || matchAlt;
      });
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const total = items.length;
    const paginated = items.slice((page - 1) * limit, page * limit);

    return {
      items: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  public getPersonByIdOrSlug(idOrSlug: string) {
    const person = this.persons.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!person) return null;

    const names = this.personNames.filter(n => n.person_id === person.id);
    const books = this.books.filter(b => b.author_person_id === person.id);
    const birthPlace = this.places.find(pl => pl.id === person.birth_place_id);
    const deathPlace = this.places.find(pl => pl.id === person.death_place_id);
    const school = this.schools.find(s => s.id === person.school_id);
    const tariqa = this.tariqas.find(t => t.id === person.tariqa_id);
    const categories = this.categories.filter(c => person.category_ids.includes(c.id));
    const claims = this.claims.filter(c => c.subject_id === person.id);

    // Relationships: Outgoing and Incoming
    const outgoing = this.relationships
      .filter(r => r.source_person_id === person.id)
      .map(r => {
        const target = this.persons.find(p => p.id === r.target_person_id);
        const type = this.relationshipTypes.find(t => t.id === r.relationship_type_id || t.code === r.relationship_type_code);
        return {
          ...r,
          direction: 'outgoing' as const,
          related_person: target ? { id: target.id, slug: target.slug, name: target.primary_name } : undefined,
          relation_label: type?.name_ar || r.relationship_type_code
        };
      });

    const incoming = this.relationships
      .filter(r => r.target_person_id === person.id)
      .map(r => {
        const source = this.persons.find(p => p.id === r.source_person_id);
        const type = this.relationshipTypes.find(t => t.id === r.relationship_type_id || t.code === r.relationship_type_code);
        return {
          ...r,
          direction: 'incoming' as const,
          related_person: source ? { id: source.id, slug: source.slug, name: source.primary_name } : undefined,
          relation_label: type ? (type.reverse_code || type.name_ar) : r.relationship_type_code
        };
      });

    // Sab' Mathani Station Meta
    let mathaniMeta: import('../core/types').MathaniMeta | null = null;
    const tier = SAB_MATHANI_TIERS_CONFIG.find(t => t.memberIds.includes(person.id));
    if (tier) {
      const partnerPersons = this.persons
        .filter(p => tier.memberIds.includes(p.id) && p.id !== person.id)
        .map(p => ({ id: p.id, name: p.primary_name, slug: p.slug }));

      mathaniMeta = {
        isMathani: true,
        tierNumber: tier.tierNumber,
        tierTitle: tier.title,
        tierShortTitle: tier.shortTitle,
        tierRealm: tier.realm,
        tierDuty: tier.duty,
        tierColor: tier.color,
        partners: partnerPersons,
        isKnotCompleter: false
      };
    } else if (KNOT_COMPLETERS_CONFIG.memberIds.includes(person.id)) {
      const knotPartners = this.persons
        .filter(p => KNOT_COMPLETERS_CONFIG.memberIds.includes(p.id) && p.id !== person.id)
        .map(p => ({ id: p.id, name: p.primary_name, slug: p.slug }));

      mathaniMeta = {
        isMathani: true,
        isKnotCompleter: true,
        knotTitle: KNOT_COMPLETERS_CONFIG.title,
        knotDuty: KNOT_COMPLETERS_CONFIG.description,
        partners: knotPartners,
        tierColor: KNOT_COMPLETERS_CONFIG.color
      };
    }

    const scholarlyClaims = getPersonClaimsAndEvidence(person.id, person.primary_name, person.short_bio);
    const shrine = this.getShrineByPersonId(person.id);

    return {
      person,
      names,
      books,
      birthPlace,
      deathPlace,
      shrine,
      school,
      tariqa,
      categories,
      claims,
      scholarlyClaims,
      relationships: [...outgoing, ...incoming],
      mathaniMeta
    };
  }

  // --- Graph Construction (Cytoscape Elements) ---
  public getTreeGraph(treeIdOrSlug: string, depth = 2, nodeLimit = 60): GraphPayload | null {
    const tree = this.trees.find(t => t.id === treeIdOrSlug || t.slug === treeIdOrSlug);
    if (!tree) return null;

    // Specialized high-precision graph builder for Sab' Mathani
    if (tree.tree_type === 'sab_mathani') {
      const mathaniNodes: { data: CytoscapeNodeData; position: { x: number; y: number } }[] = [];
      const personIdSet = new Set<string>();

      // 1. Add all 7 tiers (4 members each = 28 members)
      SAB_MATHANI_TIERS_CONFIG.forEach((tier, tIdx) => {
        const y = 140 + tIdx * 190;
        tier.memberIds.forEach((pId, mIdx) => {
          const p = this.persons.find(item => item.id === pId);
          if (!p) return;
          personIdSet.add(p.id);
          const titles = this.personNames.filter(n => n.person_id === p.id && n.name_type === 'laqab').map(n => n.name);
          const degree = this.relationships.filter(r => r.source_person_id === p.id || r.target_person_id === p.id).length;

          mathaniNodes.push({
            data: {
              id: p.id,
              label: p.primary_name,
              type: 'person',
              slug: p.slug,
              titles,
              birthDeath: `${p.birth_date || 'سر أزلي'} — ${p.death_date || 'باقٍ بأمر الله'}`,
              degree,
              tierNumber: tier.tierNumber,
              tierName: tier.title,
              realm: tier.realm,
              duty: tier.duty,
              roleBadge: tier.shortTitle,
              isKnotCompleter: false
            },
            position: {
              x: 180 + mIdx * 260,
              y
            }
          });
        });
      });

      // 2. Add the 3 Knot Completers (Hassan, Hussain, Mahdi)
      KNOT_COMPLETERS_CONFIG.memberIds.forEach((pId, idx) => {
        const p = this.persons.find(item => item.id === pId);
        if (!p) return;
        personIdSet.add(p.id);
        const titles = this.personNames.filter(n => n.person_id === p.id && n.name_type === 'laqab').map(n => n.name);
        const degree = this.relationships.filter(r => r.source_person_id === p.id || r.target_person_id === p.id).length;

        mathaniNodes.push({
          data: {
            id: p.id,
            label: p.primary_name,
            type: 'person',
            slug: p.slug,
            titles,
            birthDeath: `${p.birth_date || '؟'} — ${p.death_date || '؟'}`,
            degree,
            tierName: KNOT_COMPLETERS_CONFIG.title,
            realm: 'مقام الجمع والتمام المحمدي',
            duty: KNOT_COMPLETERS_CONFIG.description,
            roleBadge: 'عقد التمام',
            isKnotCompleter: true
          },
          position: {
            x: 1300,
            y: 350 + idx * 360
          }
        });
      });

      // 3. Extract all relationships between Mathani figures
      const mathaniEdges = this.relationships
        .filter(r => personIdSet.has(r.source_person_id) && personIdSet.has(r.target_person_id))
        .map(r => {
          const type = this.relationshipTypes.find(t => t.code === r.relationship_type_code);
          const isKnot = r.relationship_type_code === 'knot_completion_of';
          const isTier = r.relationship_type_code === 'mathani_partner_of';

          const edgeData: CytoscapeEdgeData = {
            id: r.id,
            source: r.source_person_id,
            target: r.target_person_id,
            label: isKnot ? 'إكمال العقد' : (isTier ? 'شريك في المثنى' : (type?.name_ar || r.relationship_type_code)),
            typeCode: r.relationship_type_code,
            confidence: r.confidence,
            tierRelation: isTier,
            isKnotCompletion: isKnot
          };
          return { data: edgeData };
        });

      return {
        tree,
        nodes: mathaniNodes,
        edges: mathaniEdges
      };
    }

    // Build relevant graph nodes and edges
    let rootPerson = this.persons.find(p => p.id === tree.root_person_id);
    if (!rootPerson && this.persons.length > 0) {
      rootPerson = this.persons[0];
    }

    const visitedNodeIds = new Set<string>();
    const nodeQueue: { id: string; currentDepth: number }[] = [];

    if (rootPerson) {
      visitedNodeIds.add(rootPerson.id);
      nodeQueue.push({ id: rootPerson.id, currentDepth: 0 });
    }

    const selectedRelationships: Relationship[] = [];

    // Filter relevant relationships depending on tree type
    const candidateRels = this.relationships.filter(r => {
      if (tree.tree_type === 'scholars') {
        return ['teacher_of', 'student_of', 'authorized_by'].includes(r.relationship_type_code);
      }
      if (tree.tree_type === 'spiritual_lineage') {
        return ['master_of', 'disciple_of', 'successor_of', 'ancestor_of'].includes(r.relationship_type_code);
      }
      if (tree.tree_type === 'genealogy') {
        return ['parent_of', 'child_of', 'brother_of', 'ancestor_of', 'descendant_of'].includes(r.relationship_type_code);
      }
      return true;
    });

    // BFS up to requested depth
    while (nodeQueue.length > 0 && visitedNodeIds.size < nodeLimit) {
      const { id, currentDepth } = nodeQueue.shift()!;
      if (currentDepth >= depth) continue;

      for (const rel of candidateRels) {
        if (rel.source_person_id === id && !visitedNodeIds.has(rel.target_person_id)) {
          visitedNodeIds.add(rel.target_person_id);
          selectedRelationships.push(rel);
          nodeQueue.push({ id: rel.target_person_id, currentDepth: currentDepth + 1 });
        } else if (rel.target_person_id === id && !visitedNodeIds.has(rel.source_person_id)) {
          visitedNodeIds.add(rel.source_person_id);
          selectedRelationships.push(rel);
          nodeQueue.push({ id: rel.source_person_id, currentDepth: currentDepth + 1 });
        } else if (
          (rel.source_person_id === id && visitedNodeIds.has(rel.target_person_id)) ||
          (rel.target_person_id === id && visitedNodeIds.has(rel.source_person_id))
        ) {
          if (!selectedRelationships.some(r => r.id === rel.id)) {
            selectedRelationships.push(rel);
          }
        }
      }
    }

    // Convert nodes to Cytoscape format
    const nodes = Array.from(visitedNodeIds).map((personId, index) => {
      const p = this.persons.find(item => item.id === personId)!;
      const titles = this.personNames.filter(n => n.person_id === p.id && n.name_type === 'laqab').map(n => n.name);

      const nodeData: CytoscapeNodeData = {
        id: p.id,
        label: p.primary_name,
        type: 'person',
        slug: p.slug,
        titles,
        birthDeath: `${p.birth_date || '؟'} — ${p.death_date || '؟'}`,
        degree: selectedRelationships.filter(r => r.source_person_id === p.id || r.target_person_id === p.id).length
      };

      return {
        data: nodeData,
        position: {
          x: (index % 4) * 220 + 100,
          y: Math.floor(index / 4) * 160 + 100
        }
      };
    });

    // Convert edges to Cytoscape format
    const edges = selectedRelationships.map(r => {
      const type = this.relationshipTypes.find(t => t.code === r.relationship_type_code);
      const edgeData: CytoscapeEdgeData = {
        id: r.id,
        source: r.source_person_id,
        target: r.target_person_id,
        label: type?.name_ar || r.relationship_type_code,
        typeCode: r.relationship_type_code,
        confidence: r.confidence
      };
      return { data: edgeData };
    });

    return { tree, nodes, edges };
  }

  // --- Global Search ---
  public globalSearch(rawQuery: string) {
    if (!rawQuery || rawQuery.trim().length === 0) {
      return { persons: [], books: [], sources: [], places: [] };
    }
    const q = normalizeArabicText(rawQuery);

    const persons = this.persons.filter(p => {
      return (
        normalizeArabicText(p.primary_name).includes(q) ||
        normalizeArabicText(p.short_bio || '').includes(q) ||
        this.personNames.some(n => n.person_id === p.id && normalizeArabicText(n.name).includes(q))
      );
    }).slice(0, 8);

    const books = this.books.filter(b => {
      return normalizeArabicText(b.title).includes(q) || normalizeArabicText(b.description || '').includes(q);
    }).slice(0, 5);

    const sources = this.sources.filter(s => {
      return (
        normalizeArabicText(s.title).includes(q) ||
        normalizeArabicText(s.author || '').includes(q)
      );
    }).slice(0, 5);

    const places = this.places.filter(pl => {
      return (
        normalizeArabicText(pl.name).includes(q) ||
        normalizeArabicText(pl.city || '').includes(q) ||
        normalizeArabicText(pl.country || '').includes(q)
      );
    }).slice(0, 5);

    return { persons, books, sources, places };
  }

  // --- General Getters ---
  public getTrees() {
    return this.trees;
  }

  public getCategories() {
    return this.categories;
  }

  public getSchools() {
    return this.schools;
  }

  public getTariqas() {
    return this.tariqas;
  }

  public getBooks() {
    return this.books;
  }

  public getSources() {
    return this.sources;
  }

  public getPlaces() {
    return this.places.map(p => {
      const shrinesCount = this.shrines.filter(s => s.place_id === p.id).length;
      const bornPersonsCount = this.persons.filter(item => item.birth_place_id === p.id).length;
      const diedPersonsCount = this.persons.filter(item => item.death_place_id === p.id).length;
      return {
        ...p,
        shrinesCount,
        bornPersonsCount,
        diedPersonsCount
      };
    });
  }

  public getPlaceDetail(placeId: string) {
    const place = this.places.find(p => p.id === placeId || p.slug === placeId);
    if (!place) return null;

    const shrines = this.shrines.filter(s => s.place_id === place.id);
    const bornPersons = this.persons.filter(p => p.birth_place_id === place.id).map(p => ({
      id: p.id,
      name: p.primary_name,
      slug: p.slug,
      birthDate: p.birth_date,
      shortBio: p.short_bio
    }));
    const diedPersons = this.persons.filter(p => p.death_place_id === place.id).map(p => ({
      id: p.id,
      name: p.primary_name,
      slug: p.slug,
      deathDate: p.death_date,
      shortBio: p.short_bio
    }));

    return {
      place,
      shrines,
      bornPersons,
      diedPersons
    };
  }

  public getShrines() {
    return this.shrines;
  }

  public getShrineByPersonId(personId: string) {
    return this.shrines.find(s => s.person_id === personId) || null;
  }

  public getScholarlyJourneys() {
    return this.scholarlyJourneys;
  }

  public getHistoricalEras() {
    return this.historicalEras;
  }

  public getClaims() {
    return this.claims;
  }

  public getContributions() {
    return this.contributions;
  }

  public createContribution(input: {
    user_id: string;
    user_name: string;
    entity_type: string;
    entity_id?: string;
    action: Contribution['action'];
    payload: Record<string, unknown>;
  }): Contribution {
    const newContrib: Contribution = {
      id: `contrib-${Date.now()}`,
      user_id: input.user_id,
      user_name: input.user_name,
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      action: input.action,
      payload: input.payload,
      status: 'submitted',
      created_at: new Date().toISOString()
    };
    this.contributions.unshift(newContrib);
    this.logAudit({
      user_id: input.user_id,
      action: 'contribution.submit',
      entity_type: 'contribution',
      entity_id: newContrib.id,
      metadata: { payload: input.payload }
    });

    // Mirror to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase
        .from('contributions')
        .insert({
          id: newContrib.id,
          user_id: input.user_id,
          entity_type: input.entity_type,
          entity_id: input.entity_id,
          action: input.action,
          payload: input.payload,
          status: 'submitted'
        })
        .then(
          ({ error }: { error: any }) => {
            if (error) console.warn('[Supabase Sync Warning]: Could not persist contribution', error.message);
          },
          () => {}
        );
    }
    return newContrib;
  }

  public approveContribution(id: string, reviewerId: string, reviewerNotes?: string): Contribution {
    const contrib = this.contributions.find(c => c.id === id);
    if (!contrib) throw new Error('المساهمة غير موجودة');

    const previousStatus = contrib.status;
    contrib.status = 'approved';
    contrib.reviewer_id = reviewerId;
    contrib.review_notes = reviewerNotes || 'تمت الموافقة والاعتماد التوثيقي';
    contrib.reviewed_at = new Date().toISOString();

    // Log revision
    this.revisions.unshift({
      id: `rev-${Date.now()}`,
      entity_type: contrib.entity_type,
      entity_id: contrib.entity_id || contrib.id,
      user_id: reviewerId,
      version: this.revisions.length + 1,
      before_data: { status: previousStatus },
      after_data: { status: 'approved', payload: contrib.payload },
      change_summary: reviewerNotes || 'اعتماد مقترح التحقيق',
      created_at: new Date().toISOString()
    });

    // Log audit
    this.logAudit({
      user_id: reviewerId,
      action: 'contribution.approve',
      entity_type: 'contribution',
      entity_id: contrib.id,
      metadata: { notes: reviewerNotes, previousStatus }
    });

    // Mirror to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase
        .from('contributions')
        .update({
          status: 'approved',
          reviewer_notes: reviewerNotes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id)
        .then(
          ({ error }: { error: any }) => {
            if (error) console.warn('[Supabase Sync Warning]: Could not update contribution status', error.message);
          },
          () => {}
        );
    }

    return contrib;
  }

  public rejectContribution(id: string, reviewerId: string, reviewerNotes?: string): Contribution {
    const contrib = this.contributions.find(c => c.id === id);
    if (!contrib) throw new Error('المساهمة غير موجودة');

    contrib.status = 'rejected';
    contrib.reviewer_id = reviewerId;
    contrib.review_notes = reviewerNotes || 'لم يستوفِ الشروط المرجعية المعتمدة';
    contrib.reviewed_at = new Date().toISOString();

    this.logAudit({
      user_id: reviewerId,
      action: 'contribution.reject',
      entity_type: 'contribution',
      entity_id: contrib.id,
      metadata: { notes: reviewerNotes }
    });

    return contrib;
  }

  public addRelationship(data: {
    from_person_id: string;
    to_person_id: string;
    relationship_type_id: string;
    strength?: number;
    notes?: string;
    source_id?: string;
  }, actorId: string): Relationship {
    if (data.from_person_id === data.to_person_id) {
      throw new Error('لا يمكن إنشاء علاقة بين الشخصية ونفسها');
    }

    const fromExists = this.persons.some(p => p.id === data.from_person_id);
    const toExists = this.persons.some(p => p.id === data.to_person_id);
    if (!fromExists || !toExists) {
      throw new Error('أحد أطراف العلاقة غير موجود في قاعدة الأعلام');
    }

    const relType = this.relationshipTypes.find(rt => rt.id === data.relationship_type_id);
    const rel: Relationship = {
      id: `rel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      source_person_id: data.from_person_id,
      target_person_id: data.to_person_id,
      relationship_type_id: data.relationship_type_id,
      relationship_type_code: relType?.code || 'scholarly_disciple',
      description: data.notes,
      confidence: data.strength && data.strength >= 4 ? 'high' : data.strength && data.strength >= 3 ? 'medium' : 'low',
      verification_status: 'verified',
      status: 'published',
      source_id: data.source_id,
      created_by: actorId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.relationships.push(rel);

    this.logAudit({
      user_id: actorId,
      action: 'relationship.create',
      entity_type: 'relationship',
      entity_id: rel.id,
      metadata: { from: data.from_person_id, to: data.to_person_id, type: data.relationship_type_id }
    });

    // Mirror to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase
        .from('relationships')
        .insert({
          id: rel.id,
          from_person_id: data.from_person_id,
          to_person_id: data.to_person_id,
          relationship_type_id: data.relationship_type_id,
          strength: data.strength || 3,
          notes: data.notes,
          created_by: actorId
        })
        .then(
          ({ error }: { error: any }) => {
            if (error) console.warn('[Supabase Sync Warning]: Could not persist relationship', error.message);
          },
          () => {}
        );
    }

    return rel;
  }

  public addPerson(data: {
    primary_name: string;
    birth_date?: string;
    death_date?: string;
    era?: string;
    short_bio?: string;
    school_id?: string;
    tariqa_id?: string;
    category_ids?: string[];
  }, actorId: string): Person {
    const slug = normalizeArabicText(data.primary_name)
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0621-\u064A-]/g, '') + `-${Date.now().toString(36)}`;

    const newPerson: Person = {
      id: `person-${Date.now().toString(36)}`,
      primary_name: data.primary_name.trim(),
      slug: slug,
      gender: 'male',
      birth_date: data.birth_date,
      death_date: data.death_date,
      school_id: data.school_id,
      tariqa_id: data.tariqa_id,
      category_ids: data.category_ids && data.category_ids.length > 0 ? data.category_ids : ['cat-scholars'],
      short_bio: data.short_bio || '',
      is_deceased: true,
      verification_status: 'verified',
      status: 'published',
      created_by: actorId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.persons.push(newPerson);

    this.logAudit({
      user_id: actorId,
      action: 'person.create',
      entity_type: 'person',
      entity_id: newPerson.id,
      metadata: { name: newPerson.primary_name, slug: newPerson.slug }
    });

    // Mirror to Supabase if connected
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase
        .from('persons')
        .insert({
          id: newPerson.id,
          slug: newPerson.slug,
          primary_name: newPerson.primary_name,
          gender: 'male',
          birth_date_hijri: data.birth_date,
          death_date_hijri: data.death_date,
          primary_school_id: data.school_id,
          primary_tariqa_id: data.tariqa_id,
          verification_status: 'verified',
          created_by: actorId
        })
        .then(
          ({ error }: { error: any }) => {
            if (error) console.warn('[Supabase Sync Warning]: Could not persist person', error.message);
          },
          () => {}
        );
    }

    return newPerson;
  }

  public getRelationshipTypes() {
    return this.relationshipTypes;
  }

  public getAuditLogs() {
    return this.auditLogs;
  }

  public getRevisions() {
    return this.revisions;
  }

  private logAudit(entry: {
    user_id?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    metadata?: Record<string, unknown>;
  }) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: entry.user_id || 'system',
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      metadata: entry.metadata || {},
      created_at: new Date().toISOString()
    });

    // Mirror to Supabase if connected (Phase 2 - Persistent Audit Trails)
    const supabase = getSupabaseClient();
    if (supabase) {
      supabase
        .from('audit_logs')
        .insert({
          id: `audit-${Date.now()}`,
          user_id: entry.user_id,
          action: entry.action,
          entity_type: entry.entity_type,
          entity_id: entry.entity_id,
          details: entry.metadata || {}
        })
        .then(
          ({ error }: { error: any }) => {
            if (error) console.warn('[Supabase Sync Warning]: Could not persist audit log', error.message);
          },
          () => {}
        );
    }
  }

  public getStats() {
    return {
      totalPersons: this.persons.length,
      publishedPersons: this.persons.filter(p => p.status === 'published').length,
      totalRelationships: this.relationships.length,
      totalTrees: this.trees.length,
      totalBooks: this.books.length,
      totalSources: this.sources.length,
      pendingContributions: this.contributions.filter(c => c.status === 'submitted' || c.status === 'under_review').length,
      totalPlaces: this.places.length
    };
  }
}

export const repository = new KnowledgeRepository();
