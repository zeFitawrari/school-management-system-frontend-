import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createUsersService } from '../api/users.service';
import { userKeys } from '../api/users.keys';
import type { CreateUserInput, UpdateUserInput } from '../types/user';

const service = createUsersService(api);

export function useUsers(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: userKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function useUser(id: string | undefined, signal?: AbortSignal) {
  return useQuery({
    queryKey: id ? userKeys.detail(id) : ['users', 'detail', 'none'],
    queryFn: () => service.get(id as string, signal),
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.lists });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateUserInput) => service.update(id, input),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.detail(id), user);
      void queryClient.invalidateQueries({ queryKey: userKeys.lists });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => service.deactivate(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: userKeys.lists });
    },
  });
}
