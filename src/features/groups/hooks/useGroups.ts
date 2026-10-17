import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createGroupsService } from '../api/group.service';
import { groupKeys } from '../api/group.keys';
import type { Group, CreateGroupInput, UpdateGroupInput } from '../types/group';

const service = createGroupsService(api);

export function useGroups(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: groupKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function useGroup(id: string | undefined) {
  return useQuery({
    queryKey: id ? groupKeys.detail(id) : ['groups', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateGroupInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateGroupInput }) =>
      service.update(id, input),
    onSuccess: (group: Group) => {
      queryClient.setQueryData(groupKeys.detail(group.id), group);
      void queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}
