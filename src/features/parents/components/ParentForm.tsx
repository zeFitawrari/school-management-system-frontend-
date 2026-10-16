import { useEffect, useState, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBranchContext } from '@/features/branches';
import { useCreateParent, useUpdateParent } from '../hooks/useParents';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import type { CreateParentInput, Parent } from '../types/parent';

type ParentFormProps = {
  mode: 'create' | 'edit';
  parent?: Parent;
  onSaved?: () => void;
};

export function ParentForm({ mode, parent, onSaved }: ParentFormProps) {
  const language = useLocaleStore((state) => state.language);
  const t = (key: string) => translate(key, language);
  const navigate = useNavigate();
  const { activeBranchId } = useBranchContext();
  const createParent = useCreateParent();
  const updateParent = useUpdateParent();

  const [fullName, setFullName] = useState(parent?.fullName ?? '');
  const [email, setEmail] = useState(parent?.email ?? '');
  const [phone, setPhone] = useState(parent?.phone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && parent) {
      setFullName(parent.fullName);
      setEmail(parent.email ?? '');
      setPhone(parent.phone ?? '');
    }
  }, [mode, parent]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (fullName.trim().length < 2) {
      setError(t('parents.errors.required'));
      return;
    }

    const input: CreateParentInput = {
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      branchId: mode === 'create' ? (activeBranchId ?? '') : (parent?.branchId ?? ''),
    };

    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        await createParent.mutateAsync(input);
      } else if (parent) {
        await updateParent.mutateAsync({ id: parent.id, input });
      }

      onSaved?.();
      navigate('/app/parents');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('parents.form.linkError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="rounded-lg border border-border bg-card p-6">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{t('parents.create.title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('parents.create.subtitle')}</p>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            label={t('parents.form.fullName')}
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
          <Input label={t('parents.form.email')} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label={t('parents.form.phone')} value={phone} onChange={(event) => setPhone(event.target.value)} />
          {mode === 'create' && activeBranchId ? (
            <Input label={t('parents.form.branch')} value={activeBranchId} disabled />
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm text-danger" role="alert">{error}</p> : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => navigate('/app/parents')}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting || createParent.isPending || updateParent.isPending}>
          {t('parents.form.save')}
        </Button>
      </div>
    </form>
  );
}
