import { queryClient } from '@/app/query-client';
import { resetBranchScopedStores } from '@/stores/reset';
import { useBranchStore } from '@/stores/branch.store';

export function BranchSwitcher() {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);
  const availableBranches = useBranchStore((state) => state.availableBranches);
  const setActiveBranch = useBranchStore((state) => state.setActiveBranch);

  if (availableBranches.length <= 1) {
    const activeName =
      availableBranches.find((branch) => branch.id === activeBranchId)?.name ?? 'No branch selected';

    return <span className="text-sm text-muted-foreground">{activeName}</span>;
  }

  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <span className="sr-only">Active branch</span>
      <select
        value={activeBranchId ?? ''}
        onChange={(event) => {
          const next = event.target.value || null;
          setActiveBranch(next);
          resetBranchScopedStores();
          void queryClient.invalidateQueries();
        }}
        className="min-h-9 rounded-md border border-input bg-background px-2 py-1 text-sm"
      >
        {availableBranches.map((branch) => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    </label>
  );
}
