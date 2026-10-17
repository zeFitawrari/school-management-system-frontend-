import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { GroupForm } from '../components/GroupForm';
import { useGroup } from '../hooks/useGroups';

export function GroupEditPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const groupQuery = useGroup(groupId);

  if (groupQuery.isPending) {
    return <LoadingState />;
  }

  if (groupQuery.isError || !groupQuery.data) {
    return (
      <p className="text-danger">
        {groupQuery.isError ? 'Unable to load group.' : 'Group not found.'}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <GroupForm
        key={groupQuery.data.id}
        mode="edit"
        group={groupQuery.data}
      />
    </section>
  );
}
