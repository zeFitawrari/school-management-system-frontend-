import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useGroups } from '../hooks/useGroups';
import type { Group } from '../types/group';

export function GroupListPage() {
  const language = useLocaleStore((state) => state.language);
  const groupsQuery = useGroups();

  const columns = useMemo<ColumnDef<Group, unknown>[]>(
    () => [
      {
        accessorKey: 'code',
        header: translate('groups.column.code', language),
      },
      {
        accessorKey: 'name',
        header: translate('groups.column.name', language),
      },
      {
        accessorKey: 'courseId',
        header: translate('groups.column.course', language),
        cell: ({ row }) => row.original.courseId ?? '—',
      },
      {
        accessorKey: 'tutorId',
        header: translate('groups.column.tutor', language),
        cell: ({ row }) => row.original.tutorId ?? '—',
      },
      {
        accessorKey: 'capacity',
        header: translate('groups.column.capacity', language),
      },
      {
        accessorKey: 'branchId',
        header: translate('groups.column.branch', language),
      },
      {
        accessorKey: 'status',
        header: translate('groups.column.status', language),
        cell: ({ row }) => translate(`groups.status.${row.original.status}`, language),
      },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {translate('groups.title', language)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {translate('groups.subtitle', language)}
          </p>
        </div>
        <Link
          to="/app/groups/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('groups.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={groupsQuery.isLoading}
        isError={groupsQuery.isError}
        data={groupsQuery.data?.items}
        error={groupsQuery.error}
        emptyTitle={translate('groups.children.empty', language)}
        emptyDescription={translate('groups.subtitle', language)}
        onRetry={() => void groupsQuery.refetch()}
      >
        {(groups) => (
          <DataTable
            data={groups ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
