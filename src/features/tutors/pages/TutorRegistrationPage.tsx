import { TutorForm } from '../components/TutorForm';
import { BranchGuard } from '@/features/branches';

export function TutorRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <TutorForm mode="create" />
      </section>
    </BranchGuard>
  );
}
