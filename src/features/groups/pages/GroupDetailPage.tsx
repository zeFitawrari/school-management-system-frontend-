import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useGroup } from '../hooks/useGroups';

export function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const groupQuery = useGroup(groupId);
  const canUpdate = hasPermission(permissions, 'groups.manage');

  if (!groupId) {
    return <p className="text-danger">{t('groups.notFound')}</p>;
  }

  if (isApiError(groupQuery.error) && groupQuery.error.code === 'FORBIDDEN') {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/groups')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('groups.detail.back')}
      </button>

      <QueryState
        isLoading={groupQuery.isLoading}
        isError={groupQuery.isError}
        data={groupQuery.data}
        error={groupQuery.error}
        emptyTitle={t('groups.notFound')}
        onRetry={() => void groupQuery.refetch()}
      >
        {(group) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{group.name}</h1>
              <p className="mt-1 text-muted-foreground">
                {group.code} · {group.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t('groups.form.courseId')}</dt>
                  <dd className="font-medium">{group.courseId ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('groups.form.tutorId')}</dt>
                  <dd className="font-medium">{group.tutorId ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('groups.form.capacity')}</dt>
                  <dd className="font-medium">
                    {group.capacity ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('groups.column.branch')}</dt>
                  <dd className="font-medium">{group.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('groups.column.status')}</dt>
                  <dd className="font-medium">
                    {t(`groups.status.${group.status}`)}
                  </dd>
                </div>
              </dl>
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(`/app/groups/${group.id}/edit`)}
                >
                  {t('groups.detail.edit')}
                </Button>
              </div>
            ) : null}

            {groupQuery.data && groupQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('groups.detail.createdAt')}
                {new Date(group.createdAt).toLocaleDateString(undefined, {
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
