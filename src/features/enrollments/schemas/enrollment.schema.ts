import { z } from 'zod';

import type {
  Enrollment,
  CreateEnrollmentInput,
  EnrollmentStatus,
  UpdateEnrollmentInput,
} from '../types/enrollment';

export const enrollmentSchema = z.object({
  studentId: z.string().min(1, 'Student is required.'),
  groupId: z.string().min(1, 'Group is required.'),
  branchId: z.string().min(1, 'Branch is required.'),
  academicYearId: z.string().optional(),
  status: z.enum(['active', 'completed', 'dropped', 'archived'] as const),
});

export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export function enrollmentInputFromForm(
  data: EnrollmentFormData,
): CreateEnrollmentInput {
  return {
    studentId: data.studentId.trim(),
    groupId: data.groupId.trim(),
    branchId: data.branchId,
    academicYearId: data.academicYearId?.trim() || undefined,
    status: data.status as EnrollmentStatus,
  };
}

export function enrollmentFormDataFromEnrollment(
  enrollment: Enrollment,
): EnrollmentFormData {
  return {
    studentId: enrollment.studentId,
    groupId: enrollment.groupId,
    branchId: enrollment.branchId,
    academicYearId: enrollment.academicYearId ?? '',
    status: enrollment.status,
  };
}

export type { UpdateEnrollmentInput };
