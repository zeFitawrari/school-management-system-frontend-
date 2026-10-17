import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { formatDate } from '@/lib/dates';
import { useAcademicYear } from '../hooks/useAcademicYears';

export function AcademicYearDetailPage() {
  const { academicYearId } = useParams<{ academicYearId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const academicYearQuery = useAcademicYear(academicYearId);
  const canUpdate = hasPermission(permissions, 'academics.years.manage');

  if (!academicYearId) {
    return <p className="text-danger">{t('academic-years.notFound')}</p>;
  }

  if (isApiError(academicYearQuery.error) && academicYearQuery.error.code === 'FORBIDDEN') {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/academic-years')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('academic-years.detail.back')}
      </button>

      <QueryState
        isLoading={academicYearQuery.isLoading}
        isError={academicYearQuery.isError}
        data={academicYearQuery.data}
        error={academicYearQuery.error}
        emptyTitle={t('academic-years.notFound')}
        onRetry={() => void academicYearQuery.refetch()}
      >
        {(year) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{year.name}</h1>
              <p className="mt-1 text-muted-foreground">
                {year.status} · {year.branchId}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t('academic-years.form.startDate')}</dt>
                  <dd className="font-medium">{formatDate(year.startDate, { language })}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('academic-years.form.endDate')}</dt>
                  <dd className="font-medium">{formatDate(year.endDate, { language })}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('academic-years.column.branch')}</dt>
                  <dd className="font-medium">{year.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('academic-years.column.status')}</dt>
                  <dd className="font-medium">
                    {t(`academic-years.status.${year.status}`)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('academic-years.column.isCurrent')}</dt>
                  <dd className="font-medium">
                    {year.isCurrent ? t('common.yes') : t('common.no')}
                  </dd>
                </div>
              </dl>
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(`/app/academic-years/${year.id}/edit`)}
                >
                  {t('academic-years.detail.edit')}
                </Button>
              </div>
            ) : null}

            {academicYearQuery.data && academicYearQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('academic-years.detail.createdAt')}
                {new Date(year.createdAt).toLocaleDateString(undefined, {
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
