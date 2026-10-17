import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useLocaleStore } from '@/stores/locale.store';
import { translate } from '@/lib/i18n';
import { useVacancies } from '../hooks/useVacancies';
import type { Vacancy } from '../types/vacancy';

export function VacancyListPage() {
  const language = useLocaleStore((state) => state.language);
  const vacanciesQuery = useVacancies();

  const columns = useMemo<ColumnDef<Vacancy, unknown>[]>(
    () => [
      { accessorKey: 'vacancyNumber', header: translate('vacancies.column.vacancyNumber', language) },
      { accessorKey: 'title', header: translate('vacancies.column.title', language) },
      { accessorKey: 'department', header: translate('vacancies.column.department', language) },
      { accessorKey: 'branchId', header: translate('vacancies.column.branch', language) },
      { accessorKey: 'status', header: translate('vacancies.column.status', language) },
    ],
    [language],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{translate('vacancies.title', language)}</h1>
          <p className="mt-1 text-muted-foreground">{translate('vacancies.subtitle', language)}</p>
        </div>
        <Link
          to="/app/vacancies/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          {translate('vacancies.list.new', language)}
        </Link>
      </div>

      <QueryState
        isLoading={vacanciesQuery.isLoading}
        isError={vacanciesQuery.isError}
        data={vacanciesQuery.data?.items}
        error={vacanciesQuery.error}
        emptyTitle={translate('vacancies.children.empty', language)}
        emptyDescription={translate('vacancies.subtitle', language)}
        onRetry={() => void vacanciesQuery.refetch()}
      >
        {(vacancies) => (
          <DataTable
            data={vacancies ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder={translate('common.search', language)}
          />
        )}
      </QueryState>
    </section>
  );
}
