import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type { CreateUserInput, UpdateUserInput, User } from '../types/user';

export function createUsersService(client: ApiClient) {
  return {
    list: (params?: ListParams) =>
      client.requestList<User>('/users', params),
    get: (id: string, signal?: AbortSignal) =>
      client.get<User>(`/users/${id}`, { signal }),
    create: (input: CreateUserInput) => client.post<User>('/users', input),
    update: (id: string, input: UpdateUserInput) =>
      client.patch<User>(`/users/${id}`, input),
    deactivate: (id: string) => client.post<void>(`/users/${id}/deactivate`),
    activate: (id: string) => client.post<void>(`/users/${id}/activate`),
  };
}

export type UsersService = ReturnType<typeof createUsersService>;
