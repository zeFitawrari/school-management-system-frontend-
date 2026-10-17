import { z } from 'zod';

import type { Group, GroupStatus, CreateGroupInput, UpdateGroupInput } from '../types/group';

export const groupSchema = z.object({
  code: z.string().min(1, 'Group code is required.'),
  name: z.string().min(2, 'Group name must be at least 2 characters.'),
  courseId: z.string().optional(),
  branchId: z.string().min(1, 'Branch is required.'),
  tutorId: z.string().optional(),
  capacity: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const n = Number(val);
        return !Number.isNaN(n) && n > 0 && Number.isInteger(n);
      },
      { message: 'Capacity must be a positive whole number.' },
    )
    .optional(),
  status: z.enum(['active', 'inactive', 'archived'] as const),
});

export type GroupFormData = z.infer<typeof groupSchema>;

export function groupInputFromForm(data: GroupFormData): CreateGroupInput {
  return {
    code: data.code.trim(),
    name: data.name.trim(),
    courseId: data.courseId?.trim() || undefined,
    branchId: data.branchId,
    tutorId: data.tutorId?.trim() || undefined,
    capacity: data.capacity ? Number(data.capacity) : undefined,
    status: data.status as GroupStatus,
  };
}

export function groupFormDataFromGroup(group: Group): GroupFormData {
  return {
    code: group.code,
    name: group.name,
    courseId: group.courseId ?? '',
    branchId: group.branchId,
    tutorId: group.tutorId ?? '',
    capacity: group.capacity?.toString() ?? '',
    status: group.status,
  };
}

export type { UpdateGroupInput };
