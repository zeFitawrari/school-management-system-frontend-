import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type {
  Package,
  CreatePackageInput,
  UpdatePackageInput,
} from '../types/package';

export function createPackagesService(client: ApiClient) {
  return {
    list: (params?: ListParams) =>
      client.requestList<Package>('/packages', params),
    get: (id: string) => client.get<Package>(`/packages/${id}`),
    create: (input: CreatePackageInput) =>
      client.post<Package>('/packages', input),
    update: (id: string, input: UpdatePackageInput) =>
      client.patch<Package>(`/packages/${id}`, input),
  };
}

export type PackagesService = ReturnType<typeof createPackagesService>;
