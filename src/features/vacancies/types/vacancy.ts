export type VacancyStatus = 'open' | 'closed' | 'filled' | 'draft';

export type Vacancy = {
  id: string;
  vacancyNumber: string;
  title: string;
  department?: string;
  branchId: string;
  status: VacancyStatus;
  description?: string;
  createdAt: string;
};

export type CreateVacancyInput = {
  title: string;
  department?: string;
  branchId: string;
  status?: VacancyStatus;
  description?: string;
};

export type UpdateVacancyInput = Partial<Omit<Vacancy, 'id' | 'vacancyNumber' | 'createdAt'>>;
