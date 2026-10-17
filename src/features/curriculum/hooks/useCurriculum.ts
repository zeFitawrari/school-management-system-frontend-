import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createCurriculumService } from '../api/curriculum.service';
import { curriculumKeys } from '../api/curriculum.keys';
import type {
  Curriculum,
  CreateCurriculumInput,
  UpdateCurriculumInput,
} from '../types/curriculum';

const service = createCurriculumService(api);

export function useCurriculum(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: curriculumKeys.list({
      ...params,
      branchId: activeBranchId ?? undefined,
    }),
    queryFn: () => service.list(params),
  });
}

export function useCurriculumItem(id: string | undefined) {
  return useQuery({
    queryKey: id ? curriculumKeys.detail(id) : ['curriculum', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCurriculumInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
    },
  });
}

export function useUpdateCurriculum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCurriculumInput }) =>
      service.update(id, input),
    onSuccess: (curriculum: Curriculum) => {
      queryClient.setQueryData(curriculumKeys.detail(curriculum.id), curriculum);
      void queryClient.invalidateQueries({ queryKey: curriculumKeys.all });
    },
  });
}
