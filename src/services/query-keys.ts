import type { ListParams } from '@/types/api';

/**
 * Query key contract (docs/api-contract.md section 7).
 * Key factories live at `features/<name>/api/<name>.keys.ts` and are built with
 * `createQueryKeys` so every list key includes all filters plus `branchId`.
 */

export type ListFilters = ListParams & { branchId?: string };

/**
 * Normalises list params into a stable, serialisable object for query keys.
 * Defaults are filled so `{}` and `{ page: 1 }` produce the same key.
 */
export function normaliseFilters(filters?: ListFilters): Record<string, unknown> {
  return {
    page: filters?.page ?? 1,
    pageSize: filters?.pageSize,
    sort: filters?.sort,
    q: filters?.q ?? '',
    branchId: filters?.branchId,
    ...filters?.filters,
  };
}

export function createQueryKeys<TNamespace extends string>(namespace: TNamespace) {
  return {
    all: [namespace] as const,
    lists: [namespace, 'list'] as const,
    list: (filters?: ListFilters) => [namespace, 'list', normaliseFilters(filters)] as const,
    infinite: (filters?: ListFilters) =>
      [namespace, 'infinite', normaliseFilters(filters)] as const,
    detail: (id: string) => [namespace, 'detail', id] as const,
  };
}
