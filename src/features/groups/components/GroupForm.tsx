import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useBranchContext } from '@/features/branches';
import { useCreateGroup, useUpdateGroup } from '../hooks/useGroups';
import {
  groupInputFromForm,
  groupFormDataFromGroup,
  groupSchema,
} from '../schemas/group.schema';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { Group, UpdateGroupInput } from '../types/group';
import type { GroupFormData } from '../schemas/group.schema';

type GroupFormProps = {
  mode: 'create' | 'edit';
  group?: Group;
  onSaved?: () => void;
};

export function GroupForm({ mode, group, onSaved }: GroupFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: groupFormDataFromGroup(
      group ??
        ({ code: '', name: '', branchId: activeBranchId ?? '', status: 'active' } as Group),
    ),
  });

  async function onSubmit(data: GroupFormData) {
    const input = groupInputFromForm(data);

    try {
      if (mode === 'create') {
        await createGroup.mutateAsync(input);
      } else if (group) {
        await updateGroup.mutateAsync({ id: group.id, input: input as UpdateGroupInput });
      }

      onSaved?.();
      navigate('/app/groups');
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
            {t('groups.create.title')}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t('groups.create.subtitle')}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('code')}
              label={t('groups.form.code')}
              placeholder={t('groups.form.codePlaceholder')}
              error={form.formState.errors.code?.message}
              required
            />
            <Input
              {...form.register('name')}
              label={t('groups.form.name')}
              placeholder={t('groups.form.namePlaceholder')}
              error={form.formState.errors.name?.message}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('courseId')}
              label={t('groups.form.courseId')}
              placeholder={t('groups.form.courseIdPlaceholder')}
              error={form.formState.errors.courseId?.message}
            />
            <Input
              {...form.register('tutorId')}
              label={t('groups.form.tutorId')}
              placeholder={t('groups.form.tutorIdPlaceholder')}
              error={form.formState.errors.tutorId?.message}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...form.register('capacity')}
              label={t('groups.form.capacity')}
              type="number"
              placeholder={t('groups.form.capacityPlaceholder')}
              error={form.formState.errors.capacity?.message}
            />
            <Select
              {...form.register('status')}
              label={t('groups.form.status')}
              error={form.formState.errors.status?.message}
            >
              <option value="active">{t('groups.status.active')}</option>
              <option value="inactive">{t('groups.status.inactive')}</option>
              <option value="archived">{t('groups.status.archived')}</option>
            </Select>
          </div>
          {mode === 'create' && activeBranchId ? (
            <Input
              label={t('groups.form.branch')}
              value={activeBranchId}
              disabled
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/app/groups')}
            disabled={form.formState.isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {t('groups.form.save')}
          </Button>
        </div>
      </div>
    </form>
  );
}
