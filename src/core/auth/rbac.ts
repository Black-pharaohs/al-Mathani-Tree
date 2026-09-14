/**
 * السبع المثاني — User & RBAC Domain Definitions
 * Strictly compliant with Sections 40, 41, 42, 43 of Engineering Specification V1
 */

import { UserRole } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  salt: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending_verification';
  locale: string;
  created_at: string;
  updated_at: string;
}

export type Permission =
  | 'person.read'
  | 'person.create'
  | 'person.update'
  | 'person.delete'
  | 'person.publish'
  | 'relationship.create'
  | 'relationship.update'
  | 'relationship.delete'
  | 'source.create'
  | 'source.update'
  | 'source.verify'
  | 'tree.create'
  | 'tree.update'
  | 'contribution.submit'
  | 'contribution.review'
  | 'contribution.approve'
  | 'contribution.reject'
  | 'user.manage'
  | 'audit.read'
  | 'settings.manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  visitor: [
    'person.read'
  ],
  user: [
    'person.read',
    'contribution.submit'
  ],
  contributor: [
    'person.read',
    'contribution.submit',
    'source.create'
  ],
  researcher: [
    'person.read',
    'contribution.submit',
    'source.create',
    'source.update',
    'source.verify',
    'relationship.create'
  ],
  reviewer: [
    'person.read',
    'contribution.submit',
    'contribution.review',
    'contribution.approve',
    'contribution.reject',
    'source.verify'
  ],
  editor: [
    'person.read',
    'person.create',
    'person.update',
    'relationship.create',
    'relationship.update',
    'source.create',
    'source.update',
    'source.verify',
    'tree.create',
    'tree.update',
    'contribution.review',
    'contribution.approve'
  ],
  admin: [
    'person.read',
    'person.create',
    'person.update',
    'person.delete',
    'person.publish',
    'relationship.create',
    'relationship.update',
    'relationship.delete',
    'source.create',
    'source.update',
    'source.verify',
    'tree.create',
    'tree.update',
    'contribution.submit',
    'contribution.review',
    'contribution.approve',
    'contribution.reject',
    'user.manage',
    'audit.read',
    'settings.manage'
  ],
  super_admin: [
    'person.read',
    'person.create',
    'person.update',
    'person.delete',
    'person.publish',
    'relationship.create',
    'relationship.update',
    'relationship.delete',
    'source.create',
    'source.update',
    'source.verify',
    'tree.create',
    'tree.update',
    'contribution.submit',
    'contribution.review',
    'contribution.approve',
    'contribution.reject',
    'user.manage',
    'audit.read',
    'settings.manage'
  ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}
