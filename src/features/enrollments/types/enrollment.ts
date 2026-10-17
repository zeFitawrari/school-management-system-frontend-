export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'archived';

export type Enrollment = {
  id: string;
  enrollmentNumber: string;
  studentId: string;
  groupId: string;
  branchId: string;
  academicYearId?: string | null;
  status: EnrollmentStatus;
  enrolledAt: string;
  createdAt: string;
};

export type CreateEnrollmentInput = {
  studentId: string;
  groupId: string;
  branchId: string;
  academicYearId?: string;
  status?: EnrollmentStatus;
};

export type UpdateEnrollmentInput = Partial<Omit<Enrollment, 'id' | 'enrollmentNumber' | 'createdAt'>>;
