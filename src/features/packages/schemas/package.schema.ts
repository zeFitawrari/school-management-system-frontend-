import { z } from 'zod';

import type {
  Package,
  PackageStatus,
  CreatePackageInput,
  UpdatePackageInput,
} from '../types/package';

export const packageSchema = z.object({
  code: z.string().min(1, 'Package code is required.'),
  name: z.string().min(2, 'Package name must be at least 2 characters.'),
  description: z.string().optional(),
  branchId: z.string().min(1, 'Branch is required.'),
  price: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const n = Number(val);
        return !Number.isNaN(n) && n >= 0;
      },
      { message: 'Price must be a non-negative number.' },
    )
    .optional(),
  durationWeeks: z
    .string()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const n = Number(val);
        return !Number.isNaN(n) && n > 0 && Number.isInteger(n);
      },
      { message: 'Duration must be a positive whole number.' },
    )
    .optional(),
  status: z.enum(['active', 'inactive', 'archived'] as const),
});

export type PackageFormData = z.infer<typeof packageSchema>;

export function packageInputFromForm(data: PackageFormData): CreatePackageInput {
  return {
    code: data.code.trim(),
    name: data.name.trim(),
    description: data.description?.trim() || undefined,
    branchId: data.branchId,
    price: data.price ? Number(data.price) : undefined,
    durationWeeks: data.durationWeeks ? Number(data.durationWeeks) : undefined,
    status: data.status as PackageStatus,
  };
}

export function packageFormDataFromPackage(pkg: Package): PackageFormData {
  return {
    code: pkg.code,
    name: pkg.name,
    description: pkg.description ?? '',
    branchId: pkg.branchId,
    price: pkg.price?.toString() ?? '',
    durationWeeks: pkg.durationWeeks?.toString() ?? '',
    status: pkg.status,
  };
}

export type { UpdatePackageInput };
