import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useTutors } from '../hooks/useTutors';
import type { Tutor } from '../types/tutor';

export function TutorListPage() {
  const language = useLocaleStore((state) => state.language);
  const tutorsQuery = useTutors();

  const columns = useMemo<ColumnDef<Tutor, unknown>[]>(
    () => [
      { accessorKey: 'tutorNumber', header: translate('tutors.column.tutorNumber', language) },
      { accessorKey: 'fullName', header: translate('tutors.column.name', language) },
      { accessorKey: 'email', header: translate('tutors.column.email', language) },
      { accessorKey: 'subjects', header: translate('tutors.column.subjects', language) },
      { accessorKey: 'status', header: translate('tutors.column.status', language) },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{translate('tutors.title', language)}</h1>
          <p className="mt-1 text-muted-foreground">{translate('tutors.subtitle', language)}</p>
        </div>
        <Link
          to="/app/tutors/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('tutors.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={tutorsQuery.isLoading}
        isError={tutorsQuery.isError}
        data={tutorsQuery.data?.items}
        error={tutorsQuery.error}
        emptyTitle={translate('tutors.children.empty', language)}
        emptyDescription={translate('tutors.subtitle', language)}
        onRetry={() => void tutorsQuery.refetch()}
      >
        {(tutors) => (
          <DataTable
            data={tutors ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
