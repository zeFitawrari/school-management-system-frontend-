import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { usePackage } from '../hooks/usePackages';

export function PackageDetailPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const packageQuery = usePackage(packageId);
  const canUpdate = hasPermission(permissions, 'packages.manage');

  if (!packageId) {
    return <p className="text-danger">{t('packages.notFound')}</p>;
  }

  if (isApiError(packageQuery.error) && packageQuery.error.code === 'FORBIDDEN') {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/packages')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('packages.detail.back')}
      </button>

      <QueryState
        isLoading={packageQuery.isLoading}
        isError={packageQuery.isError}
        data={packageQuery.data}
        error={packageQuery.error}
        emptyTitle={t('packages.notFound')}
        onRetry={() => void packageQuery.refetch()}
      >
        {(pkg) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{pkg.name}</h1>
              <p className="mt-1 text-muted-foreground">
                {pkg.code} · {pkg.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t('packages.form.description')}</dt>
                  <dd className="font-medium">{pkg.description ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('packages.form.price')}</dt>
                  <dd className="font-medium">
                    {pkg.price ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('packages.form.durationWeeks')}</dt>
                  <dd className="font-medium">
                    {pkg.durationWeeks ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('packages.column.branch')}</dt>
                  <dd className="font-medium">{pkg.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('packages.column.status')}</dt>
                  <dd className="font-medium">
                    {t(`packages.status.${pkg.status}`)}
                  </dd>
                </div>
              </dl>
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(`/app/packages/${pkg.id}/edit`)}
                >
                  {t('packages.detail.edit')}
                </Button>
              </div>
            ) : null}

            {packageQuery.data && packageQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('packages.detail.createdAt')}
                {new Date(pkg.createdAt).toLocaleDateString(undefined, {
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
