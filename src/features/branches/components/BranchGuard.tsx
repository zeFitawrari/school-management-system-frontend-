import { EmptyState } from '@/components/feedback/EmptyState';
import { useBranchContext } from '../hooks/useBranchContext';

export function BranchGuard({ children }: { children: React.ReactNode }) {
  const { activeBranchId, requiresSelection } = useBranchContext();

  if (!requiresSelection || activeBranchId) {
    return <>{children}</>;
  }

  return (
    <EmptyState
      title="Select a branch"
      description="Choose an active branch to continue working with branch-scoped records."
    />
  );
}
