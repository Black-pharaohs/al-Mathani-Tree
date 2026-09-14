/**
 * السبع المثاني — Express & Vite Modular Server
 * Architectural Specification: Modular Monolith + Clean Architecture
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { repository } from './src/server/repository';
import {
  AuthService,
  authenticateToken,
  requireAuth,
  requirePermission,
  requireRole,
  AuthenticatedRequest
} from './src/server/auth';
import { UserRole } from './src/core/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(authenticateToken);

  // --- API Routes (v1) ---

  // Health Check
  app.get('/api/v1/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    });
  });

  // --- Authentication & Users (Sprint 1) ---
  app.post('/api/v1/auth/register', (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'يرجى تقديم الاسم، البريد الإلكتروني، وكلمة المرور' }
        });
        return;
      }
      const result = AuthService.register({ name, email, password, role });
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { message: err.message } });
    }
  });

  app.post('/api/v1/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' }
        });
        return;
      }
      const result = AuthService.login(email, password);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(401).json({ success: false, error: { message: err.message } });
    }
  });

  app.post('/api/v1/auth/logout', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (token) {
      AuthService.destroySession(token);
    }
    res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  });

  app.get('/api/v1/auth/me', (req: AuthenticatedRequest, res) => {
    if (!req.user) {
      res.json({ success: true, data: null });
      return;
    }
    const { password_hash, salt, ...safeUser } = req.user;
    res.json({ success: true, data: safeUser });
  });

  app.get('/api/v1/auth/users', requireRole(['admin', 'super_admin']), (req, res) => {
    res.json({
      success: true,
      data: AuthService.getAllUsers()
    });
  });

  app.patch('/api/v1/auth/users/:id/role', requireRole(['admin', 'super_admin']), (req, res) => {
    try {
      const { role } = req.body;
      if (!role) {
        res.status(400).json({ success: false, error: { message: 'يجب تحديد الدور الجديد' } });
        return;
      }
      const updated = AuthService.updateUserRole(req.params.id, role as UserRole);
      const { password_hash, salt, ...safeUser } = updated;
      res.json({ success: true, data: safeUser });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { message: err.message } });
    }
  });

  // OpenAPI / API Documentation Contract
  app.get('/api/v1/docs', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'السبع المثاني — API Specification',
        version: '1.0.0',
        description: 'REST API documentation for Islamic Knowledge Graph & Digital Encyclopedia'
      },
      paths: {
        '/api/v1/persons': { get: { summary: 'List and search verified persons' } },
        '/api/v1/persons/{id}': { get: { summary: 'Get person details and relationships' } },
        '/api/v1/trees': { get: { summary: 'List available knowledge trees' } },
        '/api/v1/trees/{id}/graph': { get: { summary: 'Cytoscape-compatible tree graph projection' } },
        '/api/v1/sources': { get: { summary: 'List scholarly sources and manuscripts' } },
        '/api/v1/search': { get: { summary: 'Arabic normalized global search' } },
        '/api/v1/contributions': {
          get: { summary: 'List pending revisions and contributions' },
          post: { summary: 'Submit a new scholarly contribution' }
        }
      }
    });
  });

  // Dashboard Stats
  app.get('/api/v1/stats', (req, res) => {
    res.json({
      success: true,
      data: repository.getStats()
    });
  });

  // Persons List
  app.get('/api/v1/persons', (req, res) => {
    const { category, school, tariqa, status, search, page, limit } = req.query;
    const result = repository.getPersons({
      category: category as string,
      school: school as string,
      tariqa: tariqa as string,
      status: (status as string) || 'published',
      search: search as string,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 20
    });

    res.json({
      success: true,
      data: result.items,
      meta: result.meta
    });
  });

  // Person Details
  app.get('/api/v1/persons/:id', (req, res) => {
    const personDetail = repository.getPersonByIdOrSlug(req.params.id);
    if (!personDetail) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PERSON_NOT_FOUND',
          message: 'لم يتم العثور على الشخصية المطلوبة'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: personDetail
    });
  });

  // Trees List
  app.get('/api/v1/trees', (req, res) => {
    res.json({
      success: true,
      data: repository.getTrees()
    });
  });

  // Tree Graph Projection for Cytoscape
  app.get('/api/v1/trees/:id/graph', (req, res) => {
    const depth = req.query.depth ? parseInt(req.query.depth as string, 10) : 2;
    const limit = req.query.node_limit ? parseInt(req.query.node_limit as string, 10) : 60;

    const graph = repository.getTreeGraph(req.params.id, depth, limit);
    if (!graph) {
      res.status(404).json({
        success: false,
        error: {
          code: 'TREE_NOT_FOUND',
          message: 'لم يتم العثور على الشجرة المعرفية المطلوبة'
        }
      });
      return;
    }

    res.json({
      success: true,
      data: graph
    });
  });

  // Categories
  app.get('/api/v1/categories', (req, res) => {
    res.json({
      success: true,
      data: repository.getCategories()
    });
  });

  // Schools (Madhhabs)
  app.get('/api/v1/schools', (req, res) => {
    res.json({
      success: true,
      data: repository.getSchools()
    });
  });

  // Tariqas
  app.get('/api/v1/tariqas', (req, res) => {
    res.json({
      success: true,
      data: repository.getTariqas()
    });
  });

  // Books
  app.get('/api/v1/books', (req, res) => {
    res.json({
      success: true,
      data: repository.getBooks()
    });
  });

  // Sources
  app.get('/api/v1/sources', (req, res) => {
    res.json({
      success: true,
      data: repository.getSources()
    });
  });

  // Places
  app.get('/api/v1/places', (req, res) => {
    res.json({
      success: true,
      data: repository.getPlaces()
    });
  });

  // Global Search
  app.get('/api/v1/search', (req, res) => {
    const q = req.query.q as string;
    const results = repository.globalSearch(q);
    res.json({
      success: true,
      data: results
    });
  });

  // Contributions List
  app.get('/api/v1/contributions', (req, res) => {
    res.json({
      success: true,
      data: repository.getContributions()
    });
  });

  // Submit Contribution
  app.post('/api/v1/contributions', (req: AuthenticatedRequest, res) => {
    const { user_name, entity_type, entity_id, action, payload } = req.body;
    if (!entity_type || !payload) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'البيانات المدخلة غير مكتملة'
        }
      });
      return;
    }

    const created = repository.createContribution({
      user_id: req.user ? req.user.id : 'usr-guest-' + Math.floor(Math.random() * 1000),
      user_name: req.user ? req.user.name : user_name || 'باحث مساهم',
      entity_type,
      entity_id,
      action: action || 'update',
      payload
    });

    res.status(201).json({
      success: true,
      data: created
    });
  });

  // Approve Contribution (Requires Reviewer or Admin)
  app.post('/api/v1/contributions/:id/approve', requirePermission('contribution.approve'), (req: AuthenticatedRequest, res) => {
    try {
      const { reviewer_notes } = req.body;
      const approved = repository.approveContribution(
        req.params.id,
        req.user!.id,
        reviewer_notes
      );
      res.json({ success: true, data: approved });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { message: err.message } });
    }
  });

  // Reject Contribution (Requires Reviewer or Admin)
  app.post('/api/v1/contributions/:id/reject', requirePermission('contribution.reject'), (req: AuthenticatedRequest, res) => {
    try {
      const { reviewer_notes } = req.body;
      const rejected = repository.rejectContribution(
        req.params.id,
        req.user!.id,
        reviewer_notes
      );
      res.json({ success: true, data: rejected });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { message: err.message } });
    }
  });

  // Relationship Types
  app.get('/api/v1/relationship-types', (req, res) => {
    res.json({
      success: true,
      data: repository.getRelationshipTypes()
    });
  });

  // Create Relationship (Requires Researcher, Editor, or Admin)
  app.post('/api/v1/relationships', requirePermission('relationship.create'), (req: AuthenticatedRequest, res) => {
    try {
      const { from_person_id, to_person_id, relationship_type_id, strength, notes, source_id } = req.body;
      if (!from_person_id || !to_person_id || !relationship_type_id) {
        res.status(400).json({
          success: false,
          error: { message: 'يجب تحديد الشخصيتين ونوع العلاقة' }
        });
        return;
      }

      const rel = repository.addRelationship({
        from_person_id,
        to_person_id,
        relationship_type_id,
        strength,
        notes,
        source_id
      }, req.user!.id);

      res.status(201).json({ success: true, data: rel });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { message: err.message } });
    }
  });

  // Create Person (Requires Editor or Admin)
  app.post('/api/v1/persons', requirePermission('person.create'), (req: AuthenticatedRequest, res) => {
    try {
      const { primary_name, birth_date, death_date, era, short_bio, school_id, tariqa_id, category_ids } = req.body;
      if (!primary_name) {
        res.status(400).json({
          success: false,
          error: { message: 'يجب توفير الاسم الرئيسي للشخصية' }
        });
        return;
      }

      const person = repository.addPerson({
        primary_name,
        birth_date,
        death_date,
        era,
        short_bio,
        school_id,
        tariqa_id,
        category_ids
      }, req.user!.id);

      res.status(201).json({ success: true, data: person });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { message: err.message } });
    }
  });

  // Audit Logs (Requires Admin or Super Admin)
  app.get('/api/v1/audit-logs', requirePermission('audit.read'), (req, res) => {
    res.json({
      success: true,
      data: repository.getAuditLogs()
    });
  });

  // --- Vite Middleware / Static Assets ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[السبع المثاني] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
