import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { ParentForm } from '../components/ParentForm';
import { useParent } from '../hooks/useParents';

export function ParentEditPage() {
  const { parentId } = useParams<{ parentId: string }>();
  const parentQuery = useParent(parentId);

  if (parentQuery.isPending) {
    return <LoadingState />;
  }

  if (parentQuery.isError || !parentQuery.data) {
    return <p className="text-danger">{parentQuery.isError ? 'Unable to load parent.' : 'Parent not found.'}</p>;
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <ParentForm key={parentQuery.data.id} mode="edit" parent={parentQuery.data} />
    </section>
  );
}
