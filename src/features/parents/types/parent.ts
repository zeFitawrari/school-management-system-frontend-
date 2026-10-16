import type { Student } from '@/features/students';

export type ParentStatus = 'active' | 'inactive';

export type Parent = {
  id: string;
  parentNumber: string;
  fullName: string;
  email?: string;
  phone?: string;
  branchId: string;
  status: ParentStatus;
  children: Student[];
  createdAt: string;
};

export type CreateParentInput = {
  fullName: string;
  email?: string;
  phone?: string;
  branchId: string;
};

export type UpdateParentInput = Partial<Omit<Parent, 'id' | 'createdAt'>>;

export type LinkChildInput = {
  studentId: string;
};

export type LinkChildResult = {
  parent: Parent;
};
