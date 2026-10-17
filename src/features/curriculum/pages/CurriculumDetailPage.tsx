import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useCurriculumItem } from '../hooks/useCurriculum';

export function CurriculumDetailPage() {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const curriculumQuery = useCurriculumItem(curriculumId);
  const canUpdate = hasPermission(permissions, 'curriculum.manage');

  if (!curriculumId) {
    return <p className="text-danger">{t('curriculum.notFound')}</p>;
  }

  if (
    isApiError(curriculumQuery.error) &&
    curriculumQuery.error.code === 'FORBIDDEN'
  ) {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/curriculum')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('curriculum.detail.back')}
      </button>

      <QueryState
        isLoading={curriculumQuery.isLoading}
        isError={curriculumQuery.isError}
        data={curriculumQuery.data}
        error={curriculumQuery.error}
        emptyTitle={t('curriculum.notFound')}
        onRetry={() => void curriculumQuery.refetch()}
      >
        {(item) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">
                {item.name}
              </h1>
              <p className="mt-1 text-muted-foreground">
                {item.courseId} · {item.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">
                    {t('curriculum.form.description')}
                  </dt>
                  <dd className="font-medium">
                    {item.description ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t('curriculum.form.order')}
                  </dt>
                  <dd className="font-medium">
                    {item.order ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t('curriculum.column.branch')}
                  </dt>
                  <dd className="font-medium">{item.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    {t('curriculum.column.status')}
                  </dt>
                  <dd className="font-medium">
                    {t(`curriculum.status.${item.status}`)}
                  </dd>
                </div>
              </dl>
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(`/app/curriculum/${item.id}/edit`)}
                >
                  {t('curriculum.detail.edit')}
                </Button>
              </div>
            ) : null}

            {curriculumQuery.data && curriculumQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('curriculum.detail.createdAt')}
                {new Date(item.createdAt).toLocaleDateString(undefined, {
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
