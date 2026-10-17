import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { formatDate } from '@/lib/dates';
import { useAcademicYears } from '../hooks/useAcademicYears';
import type { AcademicYear } from '../types/academic-year';

export function AcademicYearListPage() {
  const language = useLocaleStore((state) => state.language);
  const academicYearsQuery = useAcademicYears();

  const columns = useMemo<ColumnDef<AcademicYear, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: translate('academic-years.column.name', language),
      },
      {
        accessorKey: 'startDate',
        header: translate('academic-years.column.startDate', language),
        cell: ({ row }) => formatDate(row.original.startDate, { language }),
      },
      {
        accessorKey: 'endDate',
        header: translate('academic-years.column.endDate', language),
        cell: ({ row }) => formatDate(row.original.endDate, { language }),
      },
      {
        accessorKey: 'branchId',
        header: translate('academic-years.column.branch', language),
      },
      {
        accessorKey: 'status',
        header: translate('academic-years.column.status', language),
        cell: ({ row }) => translate(`academic-years.status.${row.original.status}`, language),
      },
      {
        accessorKey: 'isCurrent',
        header: translate('academic-years.column.isCurrent', language),
        cell: ({ row }) =>
          row.original.isCurrent
            ? translate('common.yes', language)
            : translate('common.no', language),
      },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {translate('academic-years.title', language)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {translate('academic-years.subtitle', language)}
          </p>
        </div>
        <Link
          to="/app/academic-years/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('academic-years.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={academicYearsQuery.isLoading}
        isError={academicYearsQuery.isError}
        data={academicYearsQuery.data?.items}
        error={academicYearsQuery.error}
        emptyTitle={translate('academic-years.children.empty', language)}
        emptyDescription={translate('academic-years.subtitle', language)}
        onRetry={() => void academicYearsQuery.refetch()}
      >
        {(years) => (
          <DataTable
            data={years ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
