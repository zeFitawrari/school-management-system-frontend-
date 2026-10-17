import { PackageForm } from '../components/PackageForm';
import { BranchGuard } from '@/features/branches';

export function PackageRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <PackageForm mode="create" />
      </section>
    </BranchGuard>
  );
}
