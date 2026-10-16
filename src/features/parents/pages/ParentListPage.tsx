import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useParents } from '../hooks/useParents';
import type { Parent } from '../types/parent';

export function ParentListPage() {
  const language = useLocaleStore((state) => state.language);
  const parentsQuery = useParents();

  const columns = useMemo<ColumnDef<Parent, unknown>[]>(
    () => [
      { accessorKey: 'parentNumber', header: translate('parents.column.parentNumber', language) },
      { accessorKey: 'fullName', header: translate('parents.column.name', language) },
      { accessorKey: 'email', header: translate('parents.column.email', language) },
      { accessorKey: 'branchId', header: translate('parents.column.branch', language) },
      { accessorKey: 'status', header: translate('parents.column.status', language) },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{translate('parents.title', language)}</h1>
          <p className="mt-1 text-muted-foreground">{translate('parents.subtitle', language)}</p>
        </div>
        <Link
          to="/app/parents/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('parents.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={parentsQuery.isLoading}
        isError={parentsQuery.isError}
        data={parentsQuery.data?.items}
        error={parentsQuery.error}
        emptyTitle={translate('parents.children.empty', language)}
        emptyDescription={translate('parents.subtitle', language)}
        onRetry={() => void parentsQuery.refetch()}
      >
        {(parents) => (
          <DataTable
            data={parents ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
