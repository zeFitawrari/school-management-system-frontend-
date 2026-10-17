import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { VacancyForm } from '../components/VacancyForm';
import { useVacancy } from '../hooks/useVacancies';

export function VacancyEditPage() {
  const { vacancyId } = useParams<{ vacancyId: string }>();
  const vacancyQuery = useVacancy(vacancyId);

  if (vacancyQuery.isPending) {
    return <LoadingState />;
  }

  if (vacancyQuery.isError || !vacancyQuery.data) {
    return <p className="text-danger">{vacancyQuery.isError ? 'Unable to load vacancy.' : 'Vacancy not found.'}</p>;
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <VacancyForm key={vacancyQuery.data.id} mode="edit" vacancy={vacancyQuery.data} />
    </section>
  );
}
