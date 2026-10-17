import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { EnrollmentForm } from '../components/EnrollmentForm';
import { useEnrollment } from '../hooks/useEnrollments';

export function EnrollmentEditPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const enrollmentQuery = useEnrollment(enrollmentId);

  if (enrollmentQuery.isPending) {
    return <LoadingState />;
  }

  if (enrollmentQuery.isError || !enrollmentQuery.data) {
    return (
      <p className="text-danger">
        {enrollmentQuery.isError
          ? 'Unable to load enrollment.'
          : 'Enrollment not found.'}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <EnrollmentForm
        key={enrollmentQuery.data.id}
        mode="edit"
        enrollment={enrollmentQuery.data}
      />
    </section>
  );
}
