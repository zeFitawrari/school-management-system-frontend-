import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useTutor } from '../hooks/useTutors';

export function TutorDetailPage() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const tutorQuery = useTutor(tutorId);
  const canUpdate = hasPermission(permissions, 'tutors.update');

  if (!tutorId) {
    return <p className="text-danger">{t('tutors.notFound')}</p>;
  }

  if (isApiError(tutorQuery.error) && tutorQuery.error.code === 'FORBIDDEN') {
    return <ForbiddenPage />;
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/tutors')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('tutors.detail.back')}
      </button>

      <QueryState
        isLoading={tutorQuery.isLoading}
        isError={tutorQuery.isError}
        data={tutorQuery.data}
        error={tutorQuery.error}
        emptyTitle={t('tutors.notFound')}
        onRetry={() => void tutorQuery.refetch()}
      >
        {(tutor) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{tutor.fullName}</h1>
              <p className="mt-1 text-muted-foreground">
                {tutor.tutorNumber} · {tutor.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t('tutors.form.email')}</dt>
                  <dd className="font-medium">{tutor.email ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('tutors.form.phone')}</dt>
                  <dd className="font-medium">{tutor.phone ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('tutors.column.branch')}</dt>
                  <dd className="font-medium">{tutor.branchId}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('tutors.column.subjects')}</dt>
                  <dd className="font-medium">{tutor.subjects.join(', ') || '—'}</dd>
                </div>
              </dl>
            </div>

            {canUpdate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() => navigate(`/app/tutors/${tutor.id}/edit`)}
                >
                  {t('tutors.detail.edit')}
                </Button>
              </div>
            ) : null}

            {tutorQuery.data && tutorQuery.isSuccess ? (
              <p className="text-sm text-muted-foreground" role="status">
                {t('tutors.detail.updatedAt')} {new Date(tutor.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            ) : null}
          </div>
        )}
      </QueryState>
    </section>
  );
}
