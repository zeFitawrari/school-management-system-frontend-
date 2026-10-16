import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createTutorsService } from '../api/tutor.service';
import { tutorKeys } from '../api/tutor.keys';
import type { CreateTutorInput, Tutor, UpdateTutorInput } from '../types/tutor';

const service = createTutorsService(api);

export function useTutors(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: tutorKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function useTutor(id: string | undefined) {
  return useQuery({
    queryKey: id ? tutorKeys.detail(id) : ['tutors', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTutorInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}

export function useUpdateTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTutorInput }) =>
      service.update(id, input),
    onSuccess: (tutor: Tutor) => {
      queryClient.setQueryData(tutorKeys.detail(tutor.id), tutor);
      void queryClient.invalidateQueries({ queryKey: tutorKeys.all });
    },
  });
}
