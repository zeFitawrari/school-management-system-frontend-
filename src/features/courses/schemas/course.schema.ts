import { z } from 'zod';

import type {
  Course,
  CourseStatus,
  CreateCourseInput,
  UpdateCourseInput,
} from '../types/course';

export const courseSchema = z.object({
  code: z.string().min(1, 'Course code is required.'),
  name: z.string().min(2, 'Course name must be at least 2 characters.'),
  description: z.string().optional(),
  branchId: z.string().min(1, 'Branch is required.'),
  credits: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const n = Number(val);
        return !Number.isNaN(n) && n > 0 && Number.isInteger(n);
      },
      { message: 'Credits must be a positive whole number.' },
    )
    .optional(),
  status: z.enum(['active', 'inactive', 'archived'] as const),
});

export type CourseFormData = z.infer<typeof courseSchema>;

export function courseInputFromForm(data: CourseFormData): CreateCourseInput {
  return {
    code: data.code.trim(),
    name: data.name.trim(),
    description: data.description?.trim() || undefined,
    branchId: data.branchId,
    credits: data.credits ? Number(data.credits) : undefined,
    status: data.status as CourseStatus,
  };
}

export function courseFormDataFromCourse(course: Course): CourseFormData {
  return {
    code: course.code,
    name: course.name,
    description: course.description ?? '',
    branchId: course.branchId,
    credits: course.credits?.toString() ?? '',
    status: course.status,
  };
}

export type { UpdateCourseInput };
