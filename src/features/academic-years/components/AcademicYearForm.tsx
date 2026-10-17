import { useEffect, useState, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useBranchContext } from '@/features/branches';
import { useCreateAcademicYear, useUpdateAcademicYear } from '../hooks/useAcademicYears';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type {
  AcademicYear,
  AcademicYearStatus,
  CreateAcademicYearInput,
} from '../types/academic-year';

type AcademicYearFormProps = {
  mode: 'create' | 'edit';
  academicYear?: AcademicYear;
  onSaved?: () => void;
};

export function AcademicYearForm({
  mode,
  academicYear,
  onSaved,
}: AcademicYearFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createAcademicYear = useCreateAcademicYear();
  const updateAcademicYear = useUpdateAcademicYear();

  const [name, setName] = useState(academicYear?.name ?? '');
  const [startDate, setStartDate] = useState(academicYear?.startDate ?? '');
  const [endDate, setEndDate] = useState(academicYear?.endDate ?? '');
  const [status, setStatus] = useState(academicYear?.status ?? 'draft');
  const [isCurrent, setIsCurrent] = useState(academicYear?.isCurrent ?? false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && academicYear) {
      setName(academicYear.name);
      setStartDate(academicYear.startDate);
      setEndDate(academicYear.endDate);
      setStatus(academicYear.status);
      setIsCurrent(academicYear.isCurrent);
    }
  }, [mode, academicYear]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError(t('academic-years.errors.required'));
      return;
    }

    if (!startDate || !endDate) {
      setError(t('academic-years.errors.datesRequired'));
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setError(t('academic-years.errors.endBeforeStart'));
      return;
    }

    const input: CreateAcademicYearInput = {
      name: name.trim(),
      startDate,
      endDate,
      branchId: mode === 'create' ? (activeBranchId ?? '') : (academicYear?.branchId ?? ''),
      status: status as AcademicYearStatus,
      isCurrent,
    };

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createAcademicYear.mutateAsync(input);
      } else if (academicYear) {
        await updateAcademicYear.mutateAsync({ id: academicYear.id, input });
      }

      onSaved?.();
      navigate('/app/academic-years');
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : t('academic-years.form.saveError'),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="rounded-lg border border-border bg-card p-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {t('academic-years.create.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('academic-years.create.subtitle')}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label={t('academic-years.form.name')}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t('academic-years.form.startDate')}
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
            <Input
              label={t('academic-years.form.endDate')}
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </div>
          <Select
            label={t('academic-years.form.status')}
            value={status}
            onChange={(event) => setStatus(event.target.value as AcademicYearStatus)}
          >
            <option value="draft">{t('academic-years.status.draft')}</option>
            <option value="active">{t('academic-years.status.active')}</option>
            <option value="archived">{t('academic-years.status.archived')}</option>
          </Select>
          <Input
            type="checkbox"
            label={t('academic-years.form.isCurrent')}
            checked={isCurrent}
            onChange={(event) => setIsCurrent(event.target.checked)}
            hint={t('academic-years.form.isCurrentHint')}
          />
          {mode === 'create' && activeBranchId ? (
            <Input label={t('academic-years.form.branch')} value={activeBranchId} disabled />
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm text-danger" role="alert">{error}</p> : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => navigate('/app/academic-years')}>
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          loading={
            isSubmitting ||
            createAcademicYear.isPending ||
            updateAcademicYear.isPending
          }
        >
          {t('academic-years.form.save')}
        </Button>
      </div>
    </form>
  );
}
