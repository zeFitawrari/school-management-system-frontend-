import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useBranchContext } from '@/features/branches';
import { useCreateCurriculum, useUpdateCurriculum } from '../hooks/useCurriculum';
import {
  curriculumInputFromForm,
  curriculumFormDataFromCurriculum,
  curriculumSchema,
} from '../schemas/curriculum.schema';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { Curriculum, UpdateCurriculumInput } from '../types/curriculum';
import type { CurriculumFormData } from '../schemas/curriculum.schema';

type CurriculumFormProps = {
  mode: 'create' | 'edit';
  curriculum?: Curriculum;
  onSaved?: () => void;
};

export function CurriculumForm({
  mode,
  curriculum,
  onSaved,
}: CurriculumFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createCurriculum = useCreateCurriculum();
  const updateCurriculum = useUpdateCurriculum();

  const form = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
    defaultValues: curriculumFormDataFromCurriculum(
      curriculum ??
        ({ name: '', courseId: '', branchId: activeBranchId ?? '', status: 'active' } as Curriculum),
    ),
  });

  async function onSubmit(data: CurriculumFormData) {
    const input = curriculumInputFromForm(data);

    try {
      if (mode === 'create') {
        await createCurriculum.mutateAsync(input);
      } else if (curriculum) {
        await updateCurriculum.mutateAsync({ id: curriculum.id, input: input as UpdateCurriculumInput });
      }

      onSaved?.();
      navigate('/app/curriculum');
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
            {t('curriculum.create.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('curriculum.create.subtitle')}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('name')}
              label={t('curriculum.form.name')}
              placeholder={t('curriculum.form.namePlaceholder')}
              error={form.formState.errors.name?.message}
              required
            />
            <Input
              {...form.register('courseId')}
              label={t('curriculum.form.courseId')}
              placeholder={t('curriculum.form.courseIdPlaceholder')}
              error={form.formState.errors.courseId?.message}
              required
            />
          </div>
          <Input
            {...form.register('description')}
            label={t('curriculum.form.description')}
            placeholder={t('curriculum.form.descriptionPlaceholder')}
            error={form.formState.errors.description?.message}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('order')}
              label={t('curriculum.form.order')}
              type="number"
              placeholder={t('curriculum.form.orderPlaceholder')}
              error={form.formState.errors.order?.message}
            />
            <Select
              {...form.register('status')}
              label={t('curriculum.form.status')}
              error={form.formState.errors.status?.message}
            >
              <option value="active">{t('curriculum.status.active')}</option>
              <option value="inactive">{t('curriculum.status.inactive')}</option>
              <option value="archived">{t('curriculum.status.archived')}</option>
            </Select>
          </div>
          {mode === 'create' && activeBranchId ? (
            <Input
              label={t('curriculum.form.branch')}
              value={activeBranchId}
              disabled
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/app/curriculum')}
            disabled={form.formState.isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {t('curriculum.form.save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
