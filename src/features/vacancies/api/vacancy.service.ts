import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type { CreateVacancyInput, Vacancy, UpdateVacancyInput } from '../types/vacancy';

export function createVacanciesService(client: ApiClient) {
  return {
    list: (params?: ListParams) => client.requestList<Vacancy>('/vacancies', params),
    get: (id: string) => client.get<Vacancy>(`/vacancies/${id}`),
    create: (input: CreateVacancyInput) => client.post<Vacancy>('/vacancies', input),
    update: (id: string, input: UpdateVacancyInput) =>
      client.patch<Vacancy>(`/vacancies/${id}`, input),
  };
}

export type VacanciesService = ReturnType<typeof createVacanciesService>;
