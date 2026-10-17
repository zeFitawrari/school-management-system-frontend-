import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createAcademicYearsService } from '../api/academic-year.service';
import { academicYearKeys } from '../api/academic-year.keys';
import type {
  AcademicYear,
  CreateAcademicYearInput,
  UpdateAcademicYearInput,
} from '../types/academic-year';

const service = createAcademicYearsService(api);

export function useAcademicYears(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: academicYearKeys.list({
      ...params,
      branchId: activeBranchId ?? undefined,
    }),
    queryFn: () => service.list(params),
  });
}

export function useAcademicYear(id: string | undefined) {
  return useQuery({
    queryKey: id ? academicYearKeys.detail(id) : ['academic-years', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAcademicYearInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAcademicYearInput }) =>
      service.update(id, input),
    onSuccess: (year: AcademicYear) => {
      queryClient.setQueryData(academicYearKeys.detail(year.id), year);
      void queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
}

export function useSetCurrentAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => service.setCurrent(id),
    onSuccess: (year: AcademicYear) => {
      queryClient.setQueryData(academicYearKeys.detail(year.id), year);
      void queryClient.invalidateQueries({ queryKey: academicYearKeys.all });
    },
  });
}
