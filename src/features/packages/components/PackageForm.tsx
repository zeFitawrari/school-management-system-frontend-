import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useBranchContext } from '@/features/branches';
import { useCreatePackage, useUpdatePackage } from '../hooks/usePackages';
import {
  packageInputFromForm,
  packageFormDataFromPackage,
  packageSchema,
} from '../schemas/package.schema';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { Package, UpdatePackageInput } from '../types/package';
import type { PackageFormData } from '../schemas/package.schema';

type PackageFormProps = {
  mode: 'create' | 'edit';
  package?: Package;
  onSaved?: () => void;
};

export function PackageForm({ mode, package: pkg, onSaved }: PackageFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();

  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: packageFormDataFromPackage(
      pkg ??
        ({ code: '', name: '', branchId: activeBranchId ?? '', status: 'active' } as Package),
    ),
  });

  async function onSubmit(data: PackageFormData) {
    const input = packageInputFromForm(data);

    try {
      if (mode === 'create') {
        await createPackage.mutateAsync(input);
      } else if (pkg) {
        await updatePackage.mutateAsync({ id: pkg.id, input: input as UpdatePackageInput });
      }

      onSaved?.();
      navigate('/app/packages');
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
            {t('packages.create.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('packages.create.subtitle')}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('code')}
              label={t('packages.form.code')}
              placeholder={t('packages.form.codePlaceholder')}
              error={form.formState.errors.code?.message}
              required
            />
            <Input
              {...form.register('name')}
              label={t('packages.form.name')}
              placeholder={t('packages.form.namePlaceholder')}
              error={form.formState.errors.name?.message}
              required
            />
          </div>
          <Input
            {...form.register('description')}
            label={t('packages.form.description')}
            placeholder={t('packages.form.descriptionPlaceholder')}
            error={form.formState.errors.description?.message}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('price')}
              label={t('packages.form.price')}
              type="number"
              placeholder={t('packages.form.pricePlaceholder')}
              error={form.formState.errors.price?.message}
            />
            <Input
              {...form.register('durationWeeks')}
              label={t('packages.form.durationWeeks')}
              type="number"
              placeholder={t('packages.form.durationWeeksPlaceholder')}
              error={form.formState.errors.durationWeeks?.message}
            />
            <Select
              {...form.register('status')}
              label={t('packages.form.status')}
              error={form.formState.errors.status?.message}
            >
              <option value="active">{t('packages.status.active')}</option>
              <option value="inactive">{t('packages.status.inactive')}</option>
              <option value="archived">{t('packages.status.archived')}</option>
            </Select>
          </div>
          {mode === 'create' && activeBranchId ? (
            <Input
              label={t('packages.form.branch')}
              value={activeBranchId}
              disabled
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/app/packages')}
            disabled={form.formState.isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {t('packages.form.save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
