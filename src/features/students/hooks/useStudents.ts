import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createStudentsService } from '../api/students.service';
import { studentKeys } from '../api/students.keys';
import type {
  CreateStudentInput,
  DuplicateCheckInput,
  Student,
  UpdateStudentInput,
} from '../types/student';

const service = createStudentsService(api);

export function useStudents(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: studentKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function useStudent(id: string | undefined, signal?: AbortSignal) {
  return useQuery({
    queryKey: id ? studentKeys.detail(id) : ['students', 'detail', 'none'],
    queryFn: () => service.get(id as string, signal),
    enabled: Boolean(id),
  });
}

export function useStudentDuplicateCheck(input: DuplicateCheckInput | null) {
  return useQuery({
    queryKey: ['students', 'duplicate', input],
    queryFn: () => service.checkDuplicate(input as DuplicateCheckInput),
    enabled: Boolean(input?.fullName),
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStudentInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studentKeys.lists });
    },
  });
}

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStudentInput) => service.update(id, input),
    onSuccess: (student: Student) => {
      queryClient.setQueryData(studentKeys.detail(id), student);
      void queryClient.invalidateQueries({ queryKey: studentKeys.lists });
    },
  });
}

export function useTransferStudent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => service.transfer(id, groupId),
    onSuccess: (student: Student) => {
      queryClient.setQueryData(studentKeys.detail(id), student);
      void queryClient.invalidateQueries({ queryKey: studentKeys.lists });
    },
  });
}

export function useGraduateStudent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => service.graduate(id),
    onSuccess: (student: Student) => {
      queryClient.setQueryData(studentKeys.detail(id), student);
      void queryClient.invalidateQueries({ queryKey: studentKeys.lists });
    },
  });
}

export function useSuspendStudent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) => service.suspend(id, reason),
    onSuccess: (student: Student) => {
      queryClient.setQueryData(studentKeys.detail(id), student);
      void queryClient.invalidateQueries({ queryKey: studentKeys.lists });
    },
  });
}
