import { EnrollmentForm } from '../components/EnrollmentForm';
import { BranchGuard } from '@/features/branches';

export function EnrollmentRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <EnrollmentForm mode="create" />
      </section>
    </BranchGuard>
  );
}
