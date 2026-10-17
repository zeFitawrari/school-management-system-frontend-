export type PackageStatus = 'active' | 'inactive' | 'archived';

export type Package = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  branchId: string;
  price?: number | null;
  durationWeeks?: number | null;
  status: PackageStatus;
  createdAt: string;
};

export type CreatePackageInput = {
  code: string;
  name: string;
  description?: string;
  branchId: string;
  price?: number;
  durationWeeks?: number;
  status?: PackageStatus;
};

export type UpdatePackageInput = Partial<Omit<Package, 'id' | 'code' | 'createdAt'>>;
