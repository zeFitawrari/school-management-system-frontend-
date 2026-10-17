import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { usePackages } from '../hooks/usePackages';
import type { Package } from '../types/package';

export function PackageListPage() {
  const language = useLocaleStore((state) => state.language);
  const packagesQuery = usePackages();

  const columns = useMemo<ColumnDef<Package, unknown>[]>(
    () => [
      {
        accessorKey: 'code',
        header: translate('packages.column.code', language),
      },
      {
        accessorKey: 'name',
        header: translate('packages.column.name', language),
      },
      {
        accessorKey: 'description',
        header: translate('packages.column.description', language),
        cell: ({ row }) => row.original.description ?? '—',
      },
      {
        accessorKey: 'price',
        header: translate('packages.column.price', language),
      },
      {
        accessorKey: 'durationWeeks',
        header: translate('packages.column.durationWeeks', language),
      },
      {
        accessorKey: 'branchId',
        header: translate('packages.column.branch', language),
      },
      {
        accessorKey: 'status',
        header: translate('packages.column.status', language),
        cell: ({ row }) =>
          translate(`packages.status.${row.original.status}`, language),
      },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {translate('packages.title', language)}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {translate('packages.subtitle', language)}
          </p>
        </div>
        <Link
          to="/app/packages/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('packages.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={packagesQuery.isLoading}
        isError={packagesQuery.isError}
        data={packagesQuery.data?.items}
        error={packagesQuery.error}
        emptyTitle={translate('packages.children.empty', language)}
        emptyDescription={translate('packages.subtitle', language)}
        onRetry={() => void packagesQuery.refetch()}
      >
        {(packages) => (
          <DataTable
            data={packages ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
