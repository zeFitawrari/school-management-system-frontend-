import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type { CreateTutorInput, Tutor, UpdateTutorInput } from '../types/tutor';

export function createTutorsService(client: ApiClient) {
  return {
    list: (params?: ListParams) => client.requestList<Tutor>('/tutors', params),
    get: (id: string) => client.get<Tutor>(`/tutors/${id}`),
    create: (input: CreateTutorInput) => client.post<Tutor>('/tutors', input),
    update: (id: string, input: UpdateTutorInput) =>
      client.patch<Tutor>(`/tutors/${id}`, input),
  };
}

export type TutorsService = ReturnType<typeof createTutorsService>;
