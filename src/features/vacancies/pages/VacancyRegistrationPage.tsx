import { VacancyForm } from '../components/VacancyForm';
import { BranchGuard } from '@/features/branches';

export function VacancyRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <VacancyForm mode="create" />
      </section>
    </BranchGuard>
  );
}
