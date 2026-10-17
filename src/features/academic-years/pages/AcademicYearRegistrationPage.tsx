import { AcademicYearForm } from '../components/AcademicYearForm';
import { BranchGuard } from '@/features/branches';

export function AcademicYearRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <AcademicYearForm mode="create" />
      </section>
    </BranchGuard>
  );
}
