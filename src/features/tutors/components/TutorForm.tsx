import { useEffect, useState, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBranchContext } from '@/features/branches';
import { useCreateTutor, useUpdateTutor } from '../hooks/useTutors';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { CreateTutorInput, Tutor } from '../types/tutor';

type TutorFormProps = {
  mode: 'create' | 'edit';
  tutor?: Tutor;
  onSaved?: () => void;
};

export function TutorForm({ mode, tutor, onSaved }: TutorFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createTutor = useCreateTutor();
  const updateTutor = useUpdateTutor();

  const [fullName, setFullName] = useState(tutor?.fullName ?? '');
  const [email, setEmail] = useState(tutor?.email ?? '');
  const [phone, setPhone] = useState(tutor?.phone ?? '');
  const [subjects, setSubjects] = useState(tutor?.subjects.join(', ') ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && tutor) {
      setFullName(tutor.fullName);
      setEmail(tutor.email ?? '');
      setPhone(tutor.phone ?? '');
      setSubjects(tutor.subjects.join(', '));
    }
  }, [mode, tutor]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (fullName.trim().length < 2) {
      setError(t('tutors.errors.required'));
      return;
    }

    const input: CreateTutorInput = {
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      branchId: mode === 'create' ? (activeBranchId ?? '') : (tutor?.branchId ?? ''),
      subjects: subjects.split(',').map((s) => s.trim()).filter(Boolean),
    };

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createTutor.mutateAsync(input);
      } else if (tutor) {
        await updateTutor.mutateAsync({ id: tutor.id, input });
      }

      onSaved?.();
      navigate('/app/tutors');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('tutors.form.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="rounded-lg border border-border bg-card p-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{t('tutors.create.title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('tutors.create.subtitle')}</p>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label={t('tutors.form.fullName')}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
          <Input
            label={t('tutors.form.email')}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            label={t('tutors.form.phone')}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
          <Input
            label={t('tutors.form.subjects')}
            value={subjects}
            hint={t('tutors.form.subjectsHint')}
            onChange={(event) => setSubjects(event.target.value)}
          />
          {mode === 'create' && activeBranchId ? (
            <Input label={t('tutors.form.branch')} value={activeBranchId} disabled />
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm text-danger" role="alert">{error}</p> : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => navigate('/app/tutors')}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting || createTutor.isPending || updateTutor.isPending}>
          {t('tutors.form.save')}
        </Button>
      </div>
    </form>
  );
}
