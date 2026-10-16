import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BranchGuard, useBranchContext } from '@/features/branches';
import { useCreateStudent, useStudentDuplicateCheck } from '../hooks/useStudents';
import { useStudentDraftStore } from '@/stores/student-draft.store';

const STEPS = ['Basic details', 'Academic details', 'Review'];

export function StudentRegistrationPage() {
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const draft = useStudentDraftStore();
  const createStudent = useCreateStudent();

  const [error, setError] = useState<string | null>(null);
  const data = draft.data;
  const fullName = typeof data.fullName === 'string' ? data.fullName : '';
  const phone = typeof data.phone === 'string' ? data.phone : '';
  const email = typeof data.email === 'string' ? data.email : '';
  const groupId = typeof data.groupId === 'string' ? data.groupId : '';
  const packageId = typeof data.packageId === 'string' ? data.packageId : '';

  const duplicateInput = useMemo(
    () => (fullName.trim().length >= 3 ? { fullName: fullName.trim(), phone: phone.trim() || undefined } : null),
    [fullName, phone],
  );
  const duplicateQuery = useStudentDuplicateCheck(duplicateInput);

  function patch(field: string, value: string) {
    draft.patchData({ [field]: value });
  }

  function goNext() {
    if (draft.step === 1 && fullName.trim().length < 2) {
      setError('Full name is required.');
      return;
    }
    setError(null);
    draft.setStep(Math.min(STEPS.length, draft.step + 1));
  }

  function goBack() {
    setError(null);
    draft.setStep(Math.max(1, draft.step - 1));
  }

  async function handleSave() {
    if (!activeBranchId) {
      setError('Select an active branch before registering a student.');
      return;
    }

    setError(null);

    try {
      await createStudent.mutateAsync({
        fullName: fullName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        branchId: activeBranchId,
        groupId: groupId || null,
        packageIds: packageId ? [packageId] : [],
        guardianIds: [],
      });
      draft.reset();
      navigate('/app/students');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to register student.');
    }
  }

  return (
    <BranchGuard>
      <section className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Register student</h1>
          <p className="mt-1 text-muted-foreground">
            Step {draft.step} of {STEPS.length}: {STEPS[draft.step - 1]}
          </p>
        </div>

        <ol className="flex gap-2" aria-label="Registration steps">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className={[
                'flex-1 rounded-md border px-3 py-2 text-center text-sm',
                draft.step === index + 1
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground',
              ].join(' ')}
            >
              {step}
            </li>
          ))}
        </ol>

        <div className="rounded-lg border border-border bg-card p-6">
          {draft.step === 1 ? (
            <div className="space-y-4">
              <Input label="Full name" value={fullName} onChange={(event) => patch('fullName', event.target.value)} required />
              <Input label="Phone" value={phone} onChange={(event) => patch('phone', event.target.value)} />
              <Input label="Email" type="email" value={email} onChange={(event) => patch('email', event.target.value)} />
            </div>
          ) : null}

          {draft.step === 2 ? (
            <div className="space-y-4">
              <Input label="Group ID" value={groupId} onChange={(event) => patch('groupId', event.target.value)} hint="Leave blank if unassigned." />
              <Input label="Package ID" value={packageId} onChange={(event) => patch('packageId', event.target.value)} hint="Fee/course package." />
            </div>
          ) : null}

          {draft.step === 3 ? (
            <div className="space-y-4">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Name</dt><dd className="font-medium text-foreground">{fullName || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Phone</dt><dd className="font-medium text-foreground">{phone || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd className="font-medium text-foreground">{email || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Group</dt><dd className="font-medium text-foreground">{groupId || '—'}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Package</dt><dd className="font-medium text-foreground">{packageId || '—'}</dd></div>
              </dl>

              {duplicateQuery.data?.isDuplicate ? (
                <p className="rounded-md border border-warning bg-warning-soft p-3 text-sm text-foreground" role="alert">
                  Possible duplicate: {duplicateQuery.data.matchedStudentName ?? 'an existing student'}.
                </p>
              ) : null}
            </div>
          ) : null}

          {error ? <p className="mt-4 text-sm text-danger" role="alert">{error}</p> : null}
        </div>

        <div className="flex justify-between gap-3">
          <Button type="button" variant="secondary" onClick={goBack} disabled={draft.step === 1}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                draft.reset();
                setError(null);
              }}
            >
              Reset
            </Button>
            {draft.step < STEPS.length ? (
              <Button type="button" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSave} loading={createStudent.isPending}>
                Register
              </Button>
            )}
          </div>
        </div>
      </section>
    </BranchGuard>
  );
}
