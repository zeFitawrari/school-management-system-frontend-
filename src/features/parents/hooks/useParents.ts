import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createParentsService } from '../api/parents.service';
import { parentKeys } from '../api/parents.keys';
import type { CreateParentInput, LinkChildInput, Parent, UpdateParentInput } from '../types/parent';

const service = createParentsService(api);

export function useParents(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: parentKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function useParent(id: string | undefined) {
  return useQuery({
    queryKey: id ? parentKeys.detail(id) : ['parents', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateParentInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}

export function useUpdateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateParentInput }) => service.update(id, input),
    onSuccess: (parent: Parent) => {
      queryClient.setQueryData(parentKeys.detail(parent.id), parent);
      void queryClient.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}

export function useLinkChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: LinkChildInput }) => service.linkChild(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: parentKeys.all });
    },
  });
}
