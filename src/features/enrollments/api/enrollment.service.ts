import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type { Enrollment, CreateEnrollmentInput, UpdateEnrollmentInput } from '../types/enrollment';

export function createEnrollmentsService(client: ApiClient) {
  return {
    list: (params?: ListParams) =>
      client.requestList<Enrollment>('/enrollments', params),
    get: (id: string) =>
      client.get<Enrollment>(`/enrollments/${id}`),
    create: (input: CreateEnrollmentInput) =>
      client.post<Enrollment>('/enrollments', input),
    update: (id: string, input: UpdateEnrollmentInput) =>
      client.patch<Enrollment>(`/enrollments/${id}`, input),
  };
}

export type EnrollmentsService = ReturnType<typeof createEnrollmentsService>;
