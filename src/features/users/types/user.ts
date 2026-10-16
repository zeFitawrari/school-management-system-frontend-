import type { AuthUser } from '@/services/auth.service';

export type UserStatus = 'active' | 'inactive' | 'locked';

export type User = AuthUser & {
  status: UserStatus;
};

export type CreateUserInput = {
  fullName: string;
  email: string;
  roles: string[];
  branchIds: string[];
  password?: string;
};

export type UpdateUserInput = Partial<Omit<User, 'id' | 'email'>> & {
  email?: string;
};
