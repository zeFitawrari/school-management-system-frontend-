export type TutorStatus = 'active' | 'inactive' | 'archived';

export type Tutor = {
  id: string;
  tutorNumber: string;
  fullName: string;
  email?: string;
  phone?: string;
  branchId: string;
  status: TutorStatus;
  subjects: string[];
  hireDate?: string;
  createdAt: string;
};

export type CreateTutorInput = {
  fullName: string;
  email?: string;
  phone?: string;
  branchId: string;
  subjects?: string[];
};

export type UpdateTutorInput = Partial<Omit<Tutor, 'id' | 'tutorNumber' | 'createdAt'>>;
