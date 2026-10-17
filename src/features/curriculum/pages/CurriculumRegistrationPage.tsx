import { CurriculumForm } from '../components/CurriculumForm';
import { BranchGuard } from '@/features/branches';

export function CurriculumRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <CurriculumForm mode="create" />
      </section>
    </BranchGuard>
  );
}
