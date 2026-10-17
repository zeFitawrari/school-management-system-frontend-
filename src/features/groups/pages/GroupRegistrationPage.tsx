import { GroupForm } from '../components/GroupForm';
import { BranchGuard } from '@/features/branches';

export function GroupRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <GroupForm mode="create" />
      </section>
    </BranchGuard>
  );
}
