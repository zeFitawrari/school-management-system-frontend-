import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useEnrollment } from '../hooks/useEnrollments';

export function EnrollmentDetailPage() {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const enrollmentQuery = useEnrollment(enrollmentId);
  const canUpdate = hasPermission(permissions, 'enrollments.manage');

  if (!enrollmentId) {
    return <p className="text-danger">{t('enrollments.notFound')}</p>;
  }

  if (
    isApiError(enrollmentQuery.error) &&
    enrollmentQuery.error.code === 'FORBIDDEN'
  ) {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/enrollments')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('enrollments.detail.back')}
      </button>

      <QueryState
        isLoading={enrollmentQuery.isLoading}
        isError={enrollmentQuery.isError}
        data={enrollmentQuery.data}
        error={enrollmentQuery.error}
        emptyTitle={t('enrollments.notFound')}
        onRetry={() => void enrollmentQuery.refetch()}
      >
        {(enrollment) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">
                {enrollment.enrollmentNumber}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {enrollment.status} · {enrollment.branchId}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">
                    {t('enrollments.form.studentId')}
                  </dt>
                  <dd className="font-medium">{enrollment.studentId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t('enrollments.form.groupId')}
                  </dt>
                  <dd className="font-medium">{enrollment.groupId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t('enrollments.column.branch')}
                  </dt>
                  <dd className="font-medium">{enrollment.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t('enrollments.column.status')}
                  </dt>
                  <dd className="font-medium">
                    {t(`enrollments.status.${enrollment.status}`)}
                  </dd>
                </div>
              </dl>
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(`/app/enrollments/${enrollment.id}/edit`)}
                >
                  {t('enrollments.detail.edit')}
                </Button>
              </div>
            ) : null}

            {enrollmentQuery.data && enrollmentQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('enrollments.detail.createdAt')}
                {new Date(enrollment.createdAt).toLocaleDateString(undefined, {
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
