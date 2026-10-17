import { z } from 'zod';

import type {
  Curriculum,
  CurriculumStatus,
  CreateCurriculumInput,
  UpdateCurriculumInput,
} from '../types/curriculum';

export const curriculumSchema = z.object({
  name: z.string().min(2, 'Curriculum name must be at least 2 characters.'),
  courseId: z.string().min(1, 'Course is required.'),
  branchId: z.string().min(1, 'Branch is required.'),
  academicYearId: z.string().optional(),
  description: z.string().optional(),
  order: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const n = Number(val);
        return !Number.isNaN(n) && n >= 0 && Number.isInteger(n);
      },
      { message: 'Order must be a whole number.' },
    )
    .optional(),
  status: z.enum(['active', 'inactive', 'archived'] as const),
});

export type CurriculumFormData = z.infer<typeof curriculumSchema>;

export function curriculumInputFromForm(
  data: CurriculumFormData,
): CreateCurriculumInput {
  return {
    name: data.name.trim(),
    courseId: data.courseId,
    branchId: data.branchId,
    academicYearId: data.academicYearId?.trim() || undefined,
    description: data.description?.trim() || undefined,
    order: data.order ? Number(data.order) : undefined,
    status: data.status as CurriculumStatus,
  };
}

export function curriculumFormDataFromCurriculum(
  curriculum: Curriculum,
): CurriculumFormData {
  return {
    name: curriculum.name,
    courseId: curriculum.courseId,
    branchId: curriculum.branchId,
    academicYearId: curriculum.academicYearId ?? '',
    description: curriculum.description ?? '',
    order: curriculum.order?.toString() ?? '',
    status: curriculum.status,
  };
}

export type { UpdateCurriculumInput };
