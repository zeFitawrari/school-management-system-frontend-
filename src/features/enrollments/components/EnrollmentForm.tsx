import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useBranchContext } from '@/features/branches';
import { useCreateEnrollment, useUpdateEnrollment } from '../hooks/useEnrollments';
import {
  enrollmentInputFromForm,
  enrollmentFormDataFromEnrollment,
  enrollmentSchema,
} from '../schemas/enrollment.schema';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { Enrollment, UpdateEnrollmentInput } from '../types/enrollment';
import type { EnrollmentFormData } from '../schemas/enrollment.schema';

type EnrollmentFormProps = {
  mode: 'create' | 'edit';
  enrollment?: Enrollment;
  onSaved?: () => void;
};

export function EnrollmentForm({
  mode,
  enrollment,
  onSaved,
}: EnrollmentFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createEnrollment = useCreateEnrollment();
  const updateEnrollment = useUpdateEnrollment();

  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: enrollmentFormDataFromEnrollment(
      enrollment ??
        ({ studentId: '', groupId: '', branchId: activeBranchId ?? '', status: 'active' } as Enrollment),
    ),
  });

  async function onSubmit(data: EnrollmentFormData) {
    const input = enrollmentInputFromForm(data);

    try {
      if (mode === 'create') {
        await createEnrollment.mutateAsync(input);
      } else if (enrollment) {
        await updateEnrollment.mutateAsync({
          id: enrollment.id,
          input: input as UpdateEnrollmentInput,
        });
      }

      onSaved?.();
      navigate('/app/enrollments');
    } catch {
      // Handled by resolver/toast in page layer
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <div className="rounded-lg border border-border bg-card p-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {t('enrollments.create.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('enrollments.create.subtitle')}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('studentId')}
              label={t('enrollments.form.studentId')}
              placeholder={t('enrollments.form.studentIdPlaceholder')}
              error={form.formState.errors.studentId?.message}
              required
            />
            <Input
              {...form.register('groupId')}
              label={t('enrollments.form.groupId')}
              placeholder={t('enrollments.form.groupIdPlaceholder')}
              error={form.formState.errors.groupId?.message}
              required
            />
          </div>
          <Input
            {...form.register('branchId')}
            label={t('enrollments.form.branchId')}
            value={activeBranchId ?? ''}
            disabled
          />
          <Input
            {...form.register('academicYearId')}
            label={t('enrollments.form.academicYearId')}
            placeholder={t('enrollments.form.academicYearIdPlaceholder')}
            error={form.formState.errors.academicYearId?.message}
          />
          <Select
            {...form.register('status')}
            label={t('enrollments.form.status')}
            error={form.formState.errors.status?.message}
          >
            <option value="active">{t('enrollments.status.active')}</option>
            <option value="completed">{t('enrollments.status.completed')}</option>
            <option value="dropped">{t('enrollments.status.dropped')}</option>
            <option value="archived">{t('enrollments.status.archived')}</option>
          </Select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/app/enrollments')}
            disabled={form.formState.isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {t('enrollments.form.save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
