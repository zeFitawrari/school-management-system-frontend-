import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { TutorForm } from '../components/TutorForm';
import { useTutor } from '../hooks/useTutors';

export function TutorEditPage() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const tutorQuery = useTutor(tutorId);

  if (tutorQuery.isPending) {
    return <LoadingState />;
  }

  if (tutorQuery.isError || !tutorQuery.data) {
    return <p className="text-danger">{tutorQuery.isError ? 'Unable to load tutor.' : 'Tutor not found.'}</p>;
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <TutorForm key={tutorQuery.data.id} mode="edit" tutor={tutorQuery.data} />
    </section>
  );
}
