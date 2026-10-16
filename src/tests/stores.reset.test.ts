import { beforeEach, describe, expect, it } from 'vitest';

import { useStudentDraftStore } from '@/stores/student-draft.store';
import { useUIStore } from '@/stores/ui.store';
import { resetAllStores } from '@/stores/reset';
import { useAuthStore } from '@/stores/auth.store';

describe('store reset', () => {
  beforeEach(() => {
    resetAllStores();
  });

  it('clears branch-scoped and global client state', () => {
    useStudentDraftStore.getState().patchData({ name: 'Ada' });
    useUIStore.getState().setMobileNav(true);
    useAuthStore.getState().setUser(
      {
        id: 'user-1',
        fullName: 'Sara',
        email: 'sara@example.com',
        roles: ['director'],
        permissions: ['students.read'],
        branchIds: ['branch-1'],
      },
      ['students.read'],
    );

    resetAllStores();

    expect(useStudentDraftStore.getState().data).toEqual({});
    expect(useUIStore.getState().mobileNavOpen).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
