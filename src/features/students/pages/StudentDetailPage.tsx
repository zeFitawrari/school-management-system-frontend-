import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QueryState } from '@/components/feedback/QueryState';
import { useStudent, useTransferStudent, useGraduateStudent, useSuspendStudent } from '../hooks/useStudents';

export function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const id = studentId;
  const navigate = useNavigate();
  const studentQuery = useStudent(id);
  const transfer = useTransferStudent(id ?? '');
  const graduate = useGraduateStudent(id ?? '');
  const suspend = useSuspendStudent(id ?? '');

  const [targetGroup, setTargetGroup] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  if (!id) {
    return <p className="text-danger">Missing student id.</p>;
  }

  async function handleTransfer() {
    if (!targetGroup.trim()) {
      setMessage('Enter a target group ID.');
      return;
    }
    setMessage(null);
    try {
      await transfer.mutateAsync(targetGroup.trim());
      setTargetGroup('');
      setMessage('Student transferred.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Transfer failed.');
    }
  }

  async function handleGraduate() {
    setMessage(null);
    try {
      await graduate.mutateAsync();
      setMessage('Student graduated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Graduation failed.');
    }
  }

  async function handleSuspend() {
    setMessage(null);
    try {
      await suspend.mutateAsync(suspendReason.trim() || undefined);
      setSuspendReason('');
      setMessage('Student suspended.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Suspension failed.');
    }
  }

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => navigate('/app/students')}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to students
      </button>

      <QueryState
        isLoading={studentQuery.isLoading}
        isError={studentQuery.isError}
        data={studentQuery.data}
        error={studentQuery.error}
        emptyTitle="Student not found"
        onRetry={() => void studentQuery.refetch()}
      >
        {(student) => (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h1 className="text-3xl font-semibold text-foreground">{student.fullName}</h1>
              <p className="mt-1 text-muted-foreground">
                {student.studentNumber} · {student.status}
              </p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-muted-foreground">Email</dt><dd className="font-medium">{student.email ?? '—'}</dd></div>
                <div><dt className="text-muted-foreground">Phone</dt><dd className="font-medium">{student.phone ?? '—'}</dd></div>
                <div><dt className="text-muted-foreground">Group</dt><dd className="font-medium">{student.groupId ?? '—'}</dd></div>
                <div><dt className="text-muted-foreground">Branch</dt><dd className="font-medium">{student.branchId}</dd></div>
                <div><dt className="text-muted-foreground">Packages</dt><dd className="font-medium">{student.packageIds.join(', ') || '—'}</dd></div>
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Lifecycle actions</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Input label="Transfer to group" value={targetGroup} onChange={(event) => setTargetGroup(event.target.value)} />
                </div>
                <Button type="button" onClick={handleTransfer} loading={transfer.isPending}>
                  Transfer
                </Button>
              </div>

              <Input label="Suspension reason" value={suspendReason} onChange={(event) => setSuspendReason(event.target.value)} />
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="danger" onClick={handleSuspend} loading={suspend.isPending}>
                  Suspend
                </Button>
                <Button type="button" variant="secondary" onClick={handleGraduate} loading={graduate.isPending}>
                  Graduate
                </Button>
              </div>

              {message ? <p className="text-sm text-muted-foreground" role="status">{message}</p> : null}
            </div>
          </div>
        )}
      </QueryState>
    </section>
  );
}
