import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type {
  Curriculum,
  CreateCurriculumInput,
  UpdateCurriculumInput,
} from '../types/curriculum';

export function createCurriculumService(client: ApiClient) {
  return {
    list: (params?: ListParams) =>
      client.requestList<Curriculum>('/curriculum', params),
    get: (id: string) =>
      client.get<Curriculum>(`/curriculum/${id}`),
    create: (input: CreateCurriculumInput) =>
      client.post<Curriculum>('/curriculum', input),
    update: (id: string, input: UpdateCurriculumInput) =>
      client.patch<Curriculum>(`/curriculum/${id}`, input),
  };
}

export type CurriculumService = ReturnType<typeof createCurriculumService>;
