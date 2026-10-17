import { useParams } from 'react-router-dom';

import { LoadingState } from '@/components/feedback/LoadingState';
import { CourseForm } from '../components/CourseForm';
import { useCourse } from '../hooks/useCourses';

export function CourseEditPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const courseQuery = useCourse(courseId);

  if (courseQuery.isPending) {
    return <LoadingState />;
  }

  if (courseQuery.isError || !courseQuery.data) {
    return (
      <p className="text-danger">
        {courseQuery.isError ? 'Unable to load course.' : 'Course not found.'}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <CourseForm
        key={courseQuery.data.id}
        mode="edit"
        course={courseQuery.data}
      />
    </section>
  );
}
