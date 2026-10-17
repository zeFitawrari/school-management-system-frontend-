import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useEnrollments } from '../hooks/useEnrollments';
import type { Enrollment } from '../types/enrollment';

export function EnrollmentListPage() {
  const language = useLocaleStore((state) => state.language);
  const enrollmentsQuery = useEnrollments();

  const columns = useMemo<ColumnDef<Enrollment, unknown>[]>(
    () => [
      {
        accessorKey: 'enrollmentNumber',
        header: translate('enrollments.column.enrollmentNumber', language),
      },
      {
        accessorKey: 'studentId',
        header: translate('enrollments.column.student', language),
      },
      {
        accessorKey: 'groupId',
        header: translate('enrollments.column.group', language),
      },
      {
        accessorKey: 'branchId',
        header: translate('enrollments.column.branch', language),
      },
      {
        accessorKey: 'status',
        header: translate('enrollments.column.status', language),
        cell: ({ row }) =>
          translate(`enrollments.status.${row.original.status}`, language),
      },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {translate('enrollments.title', language)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {translate('enrollments.subtitle', language)}
          </p>
        </div>
        <Link
          to="/app/enrollments/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('enrollments.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={enrollmentsQuery.isLoading}
        isError={enrollmentsQuery.isError}
        data={enrollmentsQuery.data?.items}
        error={enrollmentsQuery.error}
        emptyTitle={translate('enrollments.children.empty', language)}
        emptyDescription={translate('enrollments.subtitle', language)}
        onRetry={() => void enrollmentsQuery.refetch()}
      >
        {(enrollments) => (
          <DataTable
            data={enrollments ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
