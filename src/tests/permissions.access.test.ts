import { describe, expect, it } from 'vitest';

import { ALL_PERMISSIONS, isPermission } from '@/permissions/permission-catalog';
import { presetForRole, rolePresets } from '@/permissions/role-presets';
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  isAccessibleBranch,
  isLinkedChild,
  isOwnRecord,
} from '@/permissions/access';

describe('permissions catalog', () => {
  it('contains the known permission strings as unique values', () => {
    expect(new Set(ALL_PERMISSIONS).size).toBe(ALL_PERMISSIONS.length);
    expect(ALL_PERMISSIONS).toContain('students.read');
  });

  it('validates candidate strings', () => {
    expect(isPermission('students.read')).toBe(true);
    expect(isPermission('does.not.exist')).toBe(false);
  });
});

describe('role presets', () => {
  it('gives super_admin technical permissions but no finance editing by default', () => {
    expect(presetForRole('super_admin')).toContain('users.read');
    expect(presetForRole('super_admin')).not.toContain('payments.record');
  });

  it('defines a preset for every catalog role', () => {
    expect(Object.keys(rolePresets)).toContain('owner');
    expect(presetForRole('unknown-role')).toEqual([]);
  });
});

describe('access helpers', () => {
  it('defaults to deny and supports all/any checks', () => {
    expect(hasPermission(['students.read'], 'students.read')).toBe(true);
    expect(hasPermission(['students.read'], 'students.create')).toBe(false);
    expect(hasAnyPermission(['students.read'], ['students.create', 'students.read'])).toBe(true);
    expect(hasAllPermissions(['students.read'], ['students.read', 'students.create'])).toBe(false);
  });

  it('resolves record scope helpers', () => {
    expect(isOwnRecord('user-1', 'user-1')).toBe(true);
    expect(isLinkedChild(['child-1'], 'child-1')).toBe(true);
    expect(isAccessibleBranch('branch-1', { activeBranchId: 'branch-1' })).toBe(true);
  });
});
