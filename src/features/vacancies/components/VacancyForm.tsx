import { useEffect, useState, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useBranchContext } from '@/features/branches';
import { useCreateVacancy, useUpdateVacancy } from '../hooks/useVacancies';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { CreateVacancyInput, Vacancy, VacancyStatus } from '../types/vacancy';

type VacancyFormProps = {
  mode: 'create' | 'edit';
  vacancy?: Vacancy;
  onSaved?: () => void;
};

export function VacancyForm({ mode, vacancy, onSaved }: VacancyFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createVacancy = useCreateVacancy();
  const updateVacancy = useUpdateVacancy();

  const [title, setTitle] = useState(vacancy?.title ?? '');
  const [department, setDepartment] = useState(vacancy?.department ?? '');
  const [description, setDescription] = useState(vacancy?.description ?? '');
  const [status, setStatus] = useState(vacancy?.status ?? 'open');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && vacancy) {
      setTitle(vacancy.title);
      setDepartment(vacancy.department ?? '');
      setDescription(vacancy.description ?? '');
      setStatus(vacancy.status);
    }
  }, [mode, vacancy]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (title.trim().length < 2) {
      setError(t('vacancies.errors.required'));
      return;
    }

    const input: CreateVacancyInput = {
      title: title.trim(),
      department: department.trim() || undefined,
      description: description.trim() || undefined,
      branchId: mode === 'create' ? (activeBranchId ?? '') : (vacancy?.branchId ?? ''),
      status: status as VacancyStatus,
    };

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createVacancy.mutateAsync(input);
      } else if (vacancy) {
        await updateVacancy.mutateAsync({ id: vacancy.id, input });
      }

      onSaved?.();
      navigate('/app/vacancies');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('vacancies.form.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="rounded-lg border border-border bg-card p-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{t('vacancies.create.title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('vacancies.create.subtitle')}</p>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label={t('vacancies.form.title')}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <Input
            label={t('vacancies.form.department')}
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          />
          <Input
            label={t('vacancies.form.description')}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Select
            label={t('vacancies.form.status')}
            value={status}
            onChange={(event) => setStatus(event.target.value as VacancyStatus)}
          >
            <option value="open">{t('vacancies.status.open')}</option>
            <option value="closed">{t('vacancies.status.closed')}</option>
            <option value="filled">{t('vacancies.status.filled')}</option>
            <option value="draft">{t('vacancies.status.draft')}</option>
          </Select>
          {mode === 'create' && activeBranchId ? (
            <Input label={t('vacancies.form.branch')} value={activeBranchId} disabled />
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm text-danger" role="alert">{error}</p> : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => navigate('/app/vacancies')}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting || createVacancy.isPending || updateVacancy.isPending}>
          {t('vacancies.form.save')}
        </Button>
      </div>
    </form>
  );
}
