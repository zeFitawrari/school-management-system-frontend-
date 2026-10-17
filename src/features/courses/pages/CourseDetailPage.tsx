import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useCourse } from '../hooks/useCourses';

export function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const courseQuery = useCourse(courseId);
  const canUpdate = hasPermission(permissions, 'courses.update');

  if (!courseId) {
    return <p className="text-danger">{t('courses.notFound')}</p>;
  }

  if (isApiError(courseQuery.error) && courseQuery.error.code === 'FORBIDDEN') {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/courses')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('courses.detail.back')}
      </button>

      <QueryState
        isLoading={courseQuery.isLoading}
        isError={courseQuery.isError}
        data={courseQuery.data}
        error={courseQuery.error}
        emptyTitle={t('courses.notFound')}
        onRetry={() => void courseQuery.refetch()}
      >
        {(course) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{course.name}</h1>
              <p className="mt-1 text-muted-foreground">
                {course.code} · {course.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t('courses.form.description')}</dt>
                  <dd className="font-medium">{course.description ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('courses.form.credits')}</dt>
                  <dd className="font-medium">
                    {course.credits ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('courses.column.branch')}</dt>
                  <dd className="font-medium">{course.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('courses.column.status')}</dt>
                  <dd className="font-medium">
                    {t(`courses.status.${course.status}`)}
                  </dd>
                </div>
              </dl>
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(`/app/courses/${course.id}/edit`)}
                >
                  {t('courses.detail.edit')}
                </Button>
              </div>
            ) : null}

            {courseQuery.data && courseQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('courses.detail.createdAt')}
                {new Date(course.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            ) : null}
          </div>
        )}
      </QueryState>
    </section>
  );
}
