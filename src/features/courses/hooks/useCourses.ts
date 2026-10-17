import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createCoursesService } from '../api/course.service';
import { courseKeys } from '../api/course.keys';
import type { CreateCourseInput, Course, UpdateCourseInput } from '../types/course';

const service = createCoursesService(api);

export function useCourses(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: courseKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function useCourse(id: string | undefined) {
  return useQuery({
    queryKey: id ? courseKeys.detail(id) : ['courses', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCourseInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCourseInput }) =>
      service.update(id, input),
    onSuccess: (course: Course) => {
      queryClient.setQueryData(courseKeys.detail(course.id), course);
      void queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
