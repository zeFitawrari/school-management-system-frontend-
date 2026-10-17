import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createEnrollmentsService } from '../api/enrollment.service';
import { enrollmentKeys } from '../api/enrollment.keys';
import type {
  Enrollment,
  CreateEnrollmentInput,
  UpdateEnrollmentInput,
} from '../types/enrollment';

const service = createEnrollmentsService(api);

export function useEnrollments(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: enrollmentKeys.list({
      ...params,
      branchId: activeBranchId ?? undefined,
    }),
    queryFn: () => service.list(params),
  });
}

export function useEnrollment(id: string | undefined) {
  return useQuery({
    queryKey: id ? enrollmentKeys.detail(id) : ['enrollments', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEnrollmentInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
    },
  });
}

export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEnrollmentInput }) =>
      service.update(id, input),
    onSuccess: (enrollment: Enrollment) => {
      queryClient.setQueryData(enrollmentKeys.detail(enrollment.id), enrollment);
      void queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
    },
  });
}
