import { BranchGuard } from '@/features/branches';
import { ParentForm } from '../components/ParentForm';

export function ParentRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <ParentForm mode="create" />
      </section>
    </BranchGuard>
  );
}
