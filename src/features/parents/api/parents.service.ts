import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';
import type { CreateParentInput, LinkChildInput, Parent, UpdateParentInput } from '../types/parent';

export function createParentsService(client: ApiClient) {
  return {
    list: (params?: ListParams) => client.requestList<Parent>('/parents', params),
    get: (id: string) => client.get<Parent>(`/parents/${id}`),
    create: (input: CreateParentInput) => client.post<Parent>('/parents', input),
    update: (id: string, input: UpdateParentInput) => client.patch<Parent>(`/parents/${id}`, input),
    linkChild: (id: string, input: LinkChildInput) => client.post<Parent>(`/parents/${id}/children`, input),
  };
}

export type ParentsService = ReturnType<typeof createParentsService>;
