export type StudentStatus = 'active' | 'suspended' | 'graduated' | 'transferred' | 'archived';

export type Student = {
  id: string;
  studentNumber: string;
  fullName: string;
  email?: string;
  phone?: string;
  branchId: string;
  groupId?: string | null;
  status: StudentStatus;
  packageIds: string[];
  guardianIds: string[];
  createdAt: string;
};

export type CreateStudentInput = {
  fullName: string;
  phone?: string;
  email?: string;
  branchId: string;
  groupId?: string | null;
  packageIds?: string[];
  guardianIds?: string[];
};

export type UpdateStudentInput = Partial<Omit<Student, 'id' | 'studentNumber' | 'createdAt'>>;

export type DuplicateCheckInput = {
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
};

export type DuplicateCheckResult = {
  isDuplicate: boolean;
  matchedStudentId?: string;
  matchedStudentName?: string;
};
