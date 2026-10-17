import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type { Group, CreateGroupInput, UpdateGroupInput } from '../types/group';

export function createGroupsService(client: ApiClient) {
  return {
    list: (params?: ListParams) => client.requestList<Group>('/groups', params),
    get: (id: string) => client.get<Group>(`/groups/${id}`),
    create: (input: CreateGroupInput) => client.post<Group>('/groups', input),
    update: (id: string, input: UpdateGroupInput) =>
      client.patch<Group>(`/groups/${id}`, input),
  };
}

export type GroupsService = ReturnType<typeof createGroupsService>;
