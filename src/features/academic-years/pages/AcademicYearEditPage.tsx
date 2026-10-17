import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { AcademicYearForm } from '../components/AcademicYearForm';
import { useAcademicYear } from '../hooks/useAcademicYears';

export function AcademicYearEditPage() {
  const { academicYearId } = useParams<{ academicYearId: string }>();
  const academicYearQuery = useAcademicYear(academicYearId);

  if (academicYearQuery.isPending) {
    return <LoadingState />;
  }

  if (academicYearQuery.isError || !academicYearQuery.data) {
    return (
      <p className="text-danger">
        {academicYearQuery.isError ? 'Unable to load academic year.' : 'Academic year not found.'}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <AcademicYearForm
        key={academicYearQuery.data.id}
        mode="edit"
        academicYear={academicYearQuery.data}
      />
    </section>
  );
}
