import { useCallback } from 'react';

import { useBranchStore } from '@/stores/branch.store';

export function useBranchContext() {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);
  const availableBranches = useBranchStore((state) => state.availableBranches);
  const setActiveBranch = useBranchStore((state) => state.setActiveBranch);

  const activeBranch = availableBranches.find((branch) => branch.id === activeBranchId) ?? null;

  const selectBranch = useCallback(
    (branchId: string | null) => {
      setActiveBranch(branchId);
    },
    [setActiveBranch],
  );

  return {
    activeBranchId,
    activeBranch,
    availableBranches,
    hasMultipleBranches: availableBranches.length > 1,
    requiresSelection: availableBranches.length > 0 && activeBranchId === null,
    selectBranch,
  };
}
