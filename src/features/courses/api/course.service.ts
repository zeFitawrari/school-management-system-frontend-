import type { ApiClient } from '@/services/api-client';
import type { ListParams } from '@/types/api';

import type { Course, CreateCourseInput, UpdateCourseInput } from '../types/course';

export function createCoursesService(client: ApiClient) {
  return {
    list: (params?: ListParams) => client.requestList<Course>('/courses', params),
    get: (id: string) => client.get<Course>(`/courses/${id}`),
    create: (input: CreateCourseInput) => client.post<Course>('/courses', input),
    update: (id: string, input: UpdateCourseInput) =>
      client.patch<Course>(`/courses/${id}`, input),
  };
}

export type CoursesService = ReturnType<typeof createCoursesService>;
