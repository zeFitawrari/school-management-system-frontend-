import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { QueryState } from '@/components/feedback/QueryState';
import { ForbiddenPage } from '@/app/ForbiddenPage';
import { hasPermission } from '@/permissions/access';
import { isApiError } from '@/services/api-error';
import { useStudents } from '@/features/students';
import { useAuthStore } from '@/stores/auth.store';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useLinkChild, useParent } from '../hooks/useParents';

export function ParentDetailPage() {
  const { parentId } = useParams<{ parentId: string }>();
  const navigate = useNavigate();
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const permissions = useAuthStore((state) => state.permissions);
  const parentQuery = useParent(parentId);
  const linkChild = useLinkChild();
  const studentsQuery = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const canUpdate = hasPermission(permissions, 'parents.update');

  const unlinkedStudents = useMemo(() => {
    const items = studentsQuery.data?.items ?? [];
    const parentIdValue = parentId ?? '';
    return items.filter((student) => !student.guardianIds?.includes(parentIdValue));
  }, [studentsQuery.data, parentId]);

  if (!parentId) {
    return <p className="text-danger">{t('parents.notFound')}</p>;
  }

  if (isApiError(parentQuery.error) && parentQuery.error.code === 'FORBIDDEN') {
    return <ForbiddenPage />;
  }

  const selectedStudent = unlinkedStudents.find((student) => student.id === selectedStudentId);

  async function handleConfirmLink() {
    if (!parentId || !selectedStudent) {
      return;
    }

    setMessage(null);
    try {
      await linkChild.mutateAsync({ id: parentId, input: { studentId: selectedStudent.id } });
      setSelectedStudentId('');
      setConfirmOpen(false);
      setMessage(t('parents.form.linkSuccess'));
    } catch {
      setMessage(t('parents.form.linkError'));
    }
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/parents')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {t('parents.detail.back')}
      </button>

      <QueryState
        isLoading={parentQuery.isLoading}
        isError={parentQuery.isError}
        data={parentQuery.data}
        error={parentQuery.error}
        emptyTitle={t('parents.notFound')}
        onRetry={() => void parentQuery.refetch()}
      >
        {(parent) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{parent.fullName}</h1>
              <p className="mt-1 text-muted-foreground">
                {parent.parentNumber} · {parent.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">{t('parents.form.email')}</dt>
                  <dd className="font-medium">{parent.email ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('parents.form.phone')}</dt>
                  <dd className="font-medium">{parent.phone ?? '—'}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('parents.column.branch')}</dt>
                  <dd className="font-medium">{parent.branchId}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">{t('parents.form.linkChildren')}</h2>

              {parent.children.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('parents.children.empty')}</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full min-w-[480px] border-collapse text-sm">
                    <thead className="bg-muted/60">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left font-semibold">{t('parents.children.name')}</th>
                        <th scope="col" className="px-3 py-3 text-left font-semibold">{t('parents.children.group')}</th>
                        <th scope="col" className="px-3 py-3 text-left font-semibold">{t('parents.children.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parent.children.map((child) => (
                        <tr key={child.id} className="border-t border-border even:bg-muted/20">
                          <td className="px-3 py-2 font-medium">{child.fullName}</td>
                          <td className="px-3 py-2">{child.groupId ?? '—'}</td>
                          <td className="px-3 py-2">{child.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {canUpdate ? (
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground">{t('parents.link.title')}</h2>

                <Select
                  label={t('parents.link.select')}
                  value={selectedStudentId}
                  onChange={(event) => {
                    setSelectedStudentId(event.target.value);
                    setConfirmOpen(false);
                  }}
                >
                  <option value="">{t('parents.link.select')}</option>
                  {unlinkedStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.fullName}
                    </option>
                  ))}
                </Select>

                {confirmOpen && selectedStudent ? (
                  <div className="space-y-3 rounded-md border border-border bg-background p-4">
                    <p className="text-sm text-foreground">
                      {t('parents.link.confirmPrefix')} <strong>{selectedStudent.fullName}</strong>
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <Button type="button" variant="secondary" onClick={() => { setConfirmOpen(false); setSelectedStudentId(''); }}>
                        {t('parents.link.cancel')}
                      </Button>
                      <Button type="button" onClick={() => void handleConfirmLink()} loading={linkChild.isPending}>
                        {t('parents.link.confirm')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    disabled={!selectedStudentId || linkChild.isPending}
                  >
                    {t('parents.link.continue')}
                  </Button>
                )}
              </div>
            ) : null}

            {message ? <p className="text-sm text-muted-foreground" role="status">{message}</p> : null}
          </div>
        )}
      </QueryState>
    </section>
  );
}
