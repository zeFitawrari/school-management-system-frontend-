import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type {
  AcademicYear,
  CreateAcademicYearInput,
  UpdateAcademicYearInput,
} from '../types/academic-year';

export function createAcademicYearsService(client: ApiClient) {
  return {
    list: (params?: ListParams) =>
      client.requestList<AcademicYear>('/academic-years', params),
    get: (id: string) =>
      client.get<AcademicYear>(`/academic-years/${id}`),
    create: (input: CreateAcademicYearInput) =>
      client.post<AcademicYear>('/academic-years', input),
    update: (id: string, input: UpdateAcademicYearInput) =>
      client.patch<AcademicYear>(`/academic-years/${id}`, input),
    setCurrent: (id: string) =>
      client.post<AcademicYear>(`/academic-years/${id}/set-current`),
  };
}

export type AcademicYearsService = ReturnType<typeof createAcademicYearsService>;
