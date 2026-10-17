export type AcademicYearStatus = 'draft' | 'active' | 'archived';

export type AcademicYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  branchId: string;
  status: AcademicYearStatus;
  isCurrent: boolean;
  createdAt: string;
};

export type CreateAcademicYearInput = {
  name: string;
  startDate: string;
  endDate: string;
  branchId: string;
  status?: AcademicYearStatus;
  isCurrent?: boolean;
};

export type UpdateAcademicYearInput = Partial<
  Omit<AcademicYear, 'id' | 'name' | 'createdAt'>
>;
