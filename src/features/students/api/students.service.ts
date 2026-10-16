import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type {
  CreateStudentInput,
  DuplicateCheckInput,
  DuplicateCheckResult,
  Student,
  UpdateStudentInput,
} from '../types/student';

export function createStudentsService(client: ApiClient) {
  return {
    list: (params?: ListParams) => client.requestList<Student>('/students', params),
    get: (id: string, signal?: AbortSignal) => client.get<Student>(`/students/${id}`, { signal }),
    create: (input: CreateStudentInput) => client.post<Student>('/students', input),
    update: (id: string, input: UpdateStudentInput) => client.patch<Student>(`/students/${id}`, input),
    checkDuplicate: (input: DuplicateCheckInput) =>
      client.post<DuplicateCheckResult>('/students/check-duplicate', input),
    transfer: (id: string, groupId: string) =>
      client.post<Student>(`/students/${id}/transfer`, { groupId }),
    graduate: (id: string) => client.post<Student>(`/students/${id}/graduate`),
    suspend: (id: string, reason?: string) =>
      client.post<Student>(`/students/${id}/suspend`, { reason }),
  };
}

export type StudentsService = ReturnType<typeof createStudentsService>;
