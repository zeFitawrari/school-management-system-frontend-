import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useCourses } from '../hooks/useCourses';
import type { Course } from '../types/course';

export function CourseListPage() {
  const language = useLocaleStore((state) => state.language);
  const coursesQuery = useCourses();

  const columns = useMemo<ColumnDef<Course, unknown>[]>(
    () => [
      {
        accessorKey: 'code',
        header: translate('courses.column.code', language),
      },
      {
        accessorKey: 'name',
        header: translate('courses.column.name', language),
      },
      {
        accessorKey: 'description',
        header: translate('courses.column.description', language),
        cell: ({ row }) => row.original.description ?? '—',
      },
      {
        accessorKey: 'credits',
        header: translate('courses.column.credits', language),
      },
      {
        accessorKey: 'branchId',
        header: translate('courses.column.branch', language),
      },
      {
        accessorKey: 'status',
        header: translate('courses.column.status', language),
        cell: ({ row }) =>
          translate(`courses.status.${row.original.status}`, language),
      },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {translate('courses.title', language)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {translate('courses.subtitle', language)}
          </p>
        </div>
        <Link
          to="/app/courses/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('courses.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={coursesQuery.isLoading}
        isError={coursesQuery.isError}
        data={coursesQuery.data?.items}
        error={coursesQuery.error}
        emptyTitle={translate('courses.children.empty', language)}
        emptyDescription={translate('courses.subtitle', language)}
        onRetry={() => void coursesQuery.refetch()}
      >
        {(courses) => (
          <DataTable
            data={courses ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
