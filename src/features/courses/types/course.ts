export type CourseStatus = 'active' | 'inactive' | 'archived';

export type Course = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  branchId: string;
  credits?: number | null;
  status: CourseStatus;
  createdAt: string;
};

export type CreateCourseInput = {
  code: string;
  name: string;
  description?: string;
  branchId: string;
  credits?: number;
  status?: CourseStatus;
};

export type UpdateCourseInput = Partial<Omit<Course, 'id' | 'code' | 'createdAt'>>;
