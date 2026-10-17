import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { CurriculumForm } from '../components/CurriculumForm';
import { useCurriculumItem } from '../hooks/useCurriculum';

export function CurriculumEditPage() {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const curriculumQuery = useCurriculumItem(curriculumId);

  if (curriculumQuery.isPending) {
    return <LoadingState />;
  }

  if (curriculumQuery.isError || !curriculumQuery.data) {
    return (
      <p className="text-danger">
        {curriculumQuery.isError
          ? 'Unable to load curriculum.'
          : 'Curriculum not found.'}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <CurriculumForm
        key={curriculumQuery.data.id}
        mode="edit"
        curriculum={curriculumQuery.data}
      />
    </section>
  );
}
