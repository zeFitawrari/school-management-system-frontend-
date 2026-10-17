export type CurriculumStatus = 'active' | 'inactive' | 'archived';

export type Curriculum = {
  id: string;
  name: string;
  courseId: string;
  branchId: string;
  academicYearId?: string | null;
  description?: string | null;
  order?: number | null;
  status: CurriculumStatus;
  createdAt: string;
};

export type CreateCurriculumInput = {
  name: string;
  courseId: string;
  branchId: string;
  academicYearId?: string;
  description?: string;
  order?: number;
  status?: CurriculumStatus;
};

export type UpdateCurriculumInput = Partial<
  Omit<Curriculum, 'id' | 'createdAt'>
>;
