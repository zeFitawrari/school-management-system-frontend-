import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useVacancy } from '../hooks/useVacancies';

export function VacancyDetailPage() {
  const { vacancyId } = useParams<{ vacancyId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const vacancyQuery = useVacancy(vacancyId);
  const canUpdate = hasPermission(permissions, 'vacancies.update');

  if (!vacancyId) {
    return <p className="text-danger">{t('vacancies.notFound')}</p>;
  }

  if (isApiError(vacancyQuery.error) && vacancyQuery.error.code === 'FORBIDDEN') {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/vacancies')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('vacancies.detail.back')}
      </button>

      <QueryState
        isLoading={vacancyQuery.isLoading}
        isError={vacancyQuery.isError}
        data={vacancyQuery.data}
        error={vacancyQuery.error}
        emptyTitle={t('vacancies.notFound')}
        onRetry={() => void vacancyQuery.refetch()}
      >
        {(vacancy) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{vacancy.title}</h1>
              <p className="mt-1 text-muted-foreground">
                {vacancy.vacancyNumber} · {vacancy.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t('vacancies.form.department')}</dt>
                  <dd className="font-medium">{vacancy.department ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('vacancies.form.branch')}</dt>
                  <dd className="font-medium">{vacancy.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('vacancies.column.status')}</dt>
                  <dd className="font-medium">{vacancy.status}</dd>
                </div>
              </dl>
              {vacancy.description ? (
                <div className="mt-4">
                  <dt className="text-muted-foreground text-sm">{t('vacancies.form.description')}</dt>
                  <dd className="font-medium">{vacancy.description}</dd>
                </div>
              ) : null}
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" onClick={() => navigate(`/app/vacancies/${vacancy.id}/edit`)}>
                  {t('vacancies.detail.edit')}
                </Button>
              </div>
            ) : null}

            {vacancyQuery.data && vacancyQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('vacancies.detail.createdAt')} {new Date(vacancy.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            ) : null}
          </div>
        )}
      </QueryState>
    </section>
  );
}
