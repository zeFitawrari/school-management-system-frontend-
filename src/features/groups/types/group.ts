export type GroupStatus = 'active' | 'inactive' | 'archived';

export type Group = {
  id: string;
  code: string;
  name: string;
  courseId?: string | null;
  branchId: string;
  tutorId?: string | null;
  capacity?: number | null;
  status: GroupStatus;
  createdAt: string;
};

export type CreateGroupInput = {
  code: string;
  name: string;
  courseId?: string;
  branchId: string;
  tutorId?: string;
  capacity?: number;
  status?: GroupStatus;
};

export type UpdateGroupInput = Partial<Omit<Group, 'id' | 'code' | 'createdAt'>>;
