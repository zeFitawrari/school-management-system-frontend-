import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createVacanciesService } from '../api/vacancy.service';
import { vacancyKeys } from '../api/vacancy.keys';
import type { CreateVacancyInput, Vacancy, UpdateVacancyInput } from '../types/vacancy';

const service = createVacanciesService(api);

export function useVacancies(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: vacancyKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function useVacancy(id: string | undefined) {
  return useQuery({
    queryKey: id ? vacancyKeys.detail(id) : ['vacancies', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateVacancyInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVacancyInput }) =>
      service.update(id, input),
    onSuccess: (vacancy: Vacancy) => {
      queryClient.setQueryData(vacancyKeys.detail(vacancy.id), vacancy);
      void queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
}
