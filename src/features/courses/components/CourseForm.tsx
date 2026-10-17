import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useBranchContext } from '@/features/branches';
import { useCreateCourse, useUpdateCourse } from '../hooks/useCourses';
import { courseInputFromForm, courseFormDataFromCourse, courseSchema } from '../schemas/course.schema';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { Course, UpdateCourseInput } from '../types/course';
import type { CourseFormData } from '../schemas/course.schema';

type CourseFormProps = {
  mode: 'create' | 'edit';
  course?: Course;
  onSaved?: () => void;
};

export function CourseForm({ mode, course, onSaved }: CourseFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: courseFormDataFromCourse(
      course ??
        ({ code: '', name: '', branchId: activeBranchId ?? '', status: 'active' } as Course),
    ),
  });

  async function onSubmit(data: CourseFormData) {
    const input = courseInputFromForm(data);

    try {
      if (mode === 'create') {
        await createCourse.mutateAsync(input);
      } else if (course) {
        await updateCourse.mutateAsync({ id: course.id, input: input as UpdateCourseInput });
      }

      onSaved?.();
      navigate('/app/courses');
    } catch {
      // Handled by resolver/toast in page layer
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="rounded-lg border border-border bg-card p-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {t('courses.create.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('courses.create.subtitle')}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('code')}
              label={t('courses.form.code')}
              placeholder={t('courses.form.codePlaceholder')}
              error={form.formState.errors.code?.message}
              required
            />
            <Input
              {...form.register('name')}
              label={t('courses.form.name')}
              placeholder={t('courses.form.namePlaceholder')}
              error={form.formState.errors.name?.message}
              required
            />
          </div>
          <Input
            {...form.register('description')}
            label={t('courses.form.description')}
            placeholder={t('courses.form.descriptionPlaceholder')}
            error={form.formState.errors.description?.message}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('credits')}
              label={t('courses.form.credits')}
              type="number"
              placeholder={t('courses.form.creditsPlaceholder')}
              error={form.formState.errors.credits?.message}
            />
            <Select
              {...form.register('status')}
              label={t('courses.form.status')}
              error={form.formState.errors.status?.message}
            >
              <option value="active">{t('courses.status.active')}</option>
              <option value="inactive">{t('courses.status.inactive')}</option>
              <option value="archived">{t('courses.status.archived')}</option>
            </Select>
          </div>
          {mode === 'create' && activeBranchId ? (
            <Input
              label={t('courses.form.branch')}
              value={activeBranchId}
              disabled
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/app/courses')}
            disabled={form.formState.isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {t('courses.form.save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
