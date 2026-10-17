import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useCurriculum } from '../hooks/useCurriculum';
import type { Curriculum } from '../types/curriculum';

export function CurriculumListPage() {
  const language = useLocaleStore((state) => state.language);
  const curriculumQuery = useCurriculum();

  const columns = useMemo<ColumnDef<Curriculum, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: translate('curriculum.column.name', language),
      },
      {
        accessorKey: 'courseId',
        header: translate('curriculum.column.course', language),
      },
      {
        accessorKey: 'description',
        header: translate('curriculum.column.description', language),
        cell: ({ row }) => row.original.description ?? '—',
      },
      {
        accessorKey: 'branchId',
        header: translate('curriculum.column.branch', language),
      },
      {
        accessorKey: 'order',
        header: translate('curriculum.column.order', language),
      },
      {
        accessorKey: 'status',
        header: translate('curriculum.column.status', language),
        cell: ({ row }) =>
          translate(`curriculum.status.${row.original.status}`, language),
      },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {translate('curriculum.title', language)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {translate('curriculum.subtitle', language)}
          </p>
        </div>
        <Link
          to="/app/curriculum/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('curriculum.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={curriculumQuery.isLoading}
        isError={curriculumQuery.isError}
        data={curriculumQuery.data?.items}
        error={curriculumQuery.error}
        emptyTitle={translate('curriculum.children.empty', language)}
        emptyDescription={translate('curriculum.subtitle', language)}
        onRetry={() => void curriculumQuery.refetch()}
      >
        {(items) => (
          <DataTable
            data={items ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
