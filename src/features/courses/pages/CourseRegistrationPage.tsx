import { CourseForm } from '../components/CourseForm';
import { BranchGuard } from '@/features/branches';

export function CourseRegistrationPage() {
  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <CourseForm mode="create" />
      </section>
    </BranchGuard>
  );
}
