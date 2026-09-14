/**
 * السبع المثاني — Authentication & Authorization Service
 * Pure Node.js crypto-based secure authentication without external dependencies
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { User, Permission, hasPermission, ROLE_PERMISSIONS } from '../core/auth/rbac';
import { UserRole } from '../core/types';

// In-Memory User Store (Backed by relational models)
const usersStore: Map<string, User> = new Map();
const sessionTokens: Map<string, { userId: string; expiresAt: number }> = new Map();

// Helper to hash password
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const currentSalt = salt || crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, currentSalt, 64);
  return {
    hash: derivedKey.toString('hex'),
    salt: currentSalt
  };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(computedHash, 'hex'), Buffer.from(hash, 'hex'));
}

// Initialize seed users for Sprint 1 verification
function initSeedUsers() {
  const seedUsersList = [
    {
      id: 'usr-admin-001',
      name: 'مدير المنصة والمشرف العام',
      email: 'admin@almathani.org',
      role: 'admin' as UserRole,
      password: 'Admin@123456'
    },
    {
      id: 'usr-reviewer-001',
      name: 'محقق علمي معتمد',
      email: 'reviewer@almathani.org',
      role: 'reviewer' as UserRole,
      password: 'Reviewer@123'
    },
    {
      id: 'usr-researcher-001',
      name: 'باحث في التراث الإسلامي',
      email: 'researcher@almathani.org',
      role: 'researcher' as UserRole,
      password: 'Research@123'
    },
    {
      id: 'usr-contrib-001',
      name: 'مساهم موثق',
      email: 'contributor@almathani.org',
      role: 'contributor' as UserRole,
      password: 'Contrib@123'
    }
  ];

  for (const u of seedUsersList) {
    const { hash, salt } = hashPassword(u.password);
    const userObj: User = {
      id: u.id,
      name: u.name,
      email: u.email.toLowerCase(),
      password_hash: hash,
      salt: salt,
      role: u.role,
      status: 'active',
      locale: 'ar',
      created_at: '2026-09-01T00:00:00Z',
      updated_at: '2026-09-01T00:00:00Z'
    };
    usersStore.set(userObj.id, userObj);
  }
}

initSeedUsers();

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const AuthService = {
  findUserByEmail(email: string): User | undefined {
    const cleanEmail = email.trim().toLowerCase();
    for (const user of usersStore.values()) {
      if (user.email === cleanEmail) return user;
    }
    return undefined;
  },

  findUserById(id: string): User | undefined {
    return usersStore.get(id);
  },

  getAllUsers(): Omit<User, 'password_hash' | 'salt'>[] {
    return Array.from(usersStore.values()).map(u => {
      const { password_hash, salt, ...safeUser } = u;
      return safeUser;
    });
  },

  register(params: { name: string; email: string; password: string; role?: UserRole }): { user: Omit<User, 'password_hash' | 'salt'>; token: string } {
    const existing = this.findUserByEmail(params.email);
    if (existing) {
      throw new Error('البريد الإلكتروني مسجل بالفعل');
    }

    const { hash, salt } = hashPassword(params.password);
    const userId = `usr-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;
    
    const newUser: User = {
      id: userId,
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      password_hash: hash,
      salt: salt,
      role: params.role || 'user',
      status: 'active',
      locale: 'ar',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    usersStore.set(newUser.id, newUser);
    const token = this.createSession(newUser.id);

    const { password_hash, salt: s, ...safeUser } = newUser;
    return { user: safeUser, token };
  },

  login(email: string, password: string): { user: Omit<User, 'password_hash' | 'salt'>; token: string } {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    if (user.status !== 'active') {
      throw new Error('الحساب غير نشط حالياً، يُرجى مراجعة إدارة المنصة');
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const token = this.createSession(user.id);
    const { password_hash, salt, ...safeUser } = user;
    return { user: safeUser, token };
  },

  createSession(userId: string): string {
    const token = `tok_${crypto.randomBytes(32).toString('hex')}`;
    // 7 days expiration
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    sessionTokens.set(token, { userId, expiresAt });
    return token;
  },

  validateSession(token: string): User | null {
    if (!token) return null;
    const session = sessionTokens.get(token);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      sessionTokens.delete(token);
      return null;
    }

    return usersStore.get(session.userId) || null;
  },

  destroySession(token: string) {
    sessionTokens.delete(token);
  },

  updateUserRole(userId: string, newRole: UserRole): User {
    const user = usersStore.get(userId);
    if (!user) throw new Error('المستخدم غير موجود');
    user.role = newRole;
    user.updated_at = new Date().toISOString();
    usersStore.set(userId, user);
    return user;
  }
};

// Middleware: Authenticate Token from Authorization Header
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    const user = AuthService.validateSession(token);
    if (user) {
      req.user = user;
    }
  }

  next();
}

// Middleware: Require Authenticated User
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'يجب تسجيل الدخول للوصول إلى هذا المورد'
    });
  }
  next();
}

// Middleware: Require Specific Permission
export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'يجب تسجيل الدخول لتنفيذ هذا الإجراء'
      });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: `ليس لديك الصلاحية المطلوبة (${permission}) لتنفيذ هذه العملية`
      });
    }

    next();
  };
}

// Middleware: Require Specific Role
export function requireRole(roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'يجب تسجيل الدخول للوصول إلى هذا المورد'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'لا تملك المستوى الإداري الكافي للوصول'
      });
    }

    next();
  };
}
