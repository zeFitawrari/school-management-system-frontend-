import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services';
import { useBranchStore } from '@/stores/branch.store';
import { createPackagesService } from '../api/package.service';
import { packageKeys } from '../api/package.keys';
import type {
  CreatePackageInput,
  Package,
  UpdatePackageInput,
} from '../types/package';

const service = createPackagesService(api);

export function usePackages(params?: Parameters<typeof service.list>[0]) {
  const activeBranchId = useBranchStore((state) => state.activeBranchId);

  return useQuery({
    queryKey: packageKeys.list({ ...params, branchId: activeBranchId ?? undefined }),
    queryFn: () => service.list(params),
  });
}

export function usePackage(id: string | undefined) {
  return useQuery({
    queryKey: id ? packageKeys.detail(id) : ['packages', 'detail', 'none'],
    queryFn: () => service.get(id as string),
    enabled: Boolean(id),
  });
}

export function useCreatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePackageInput) => service.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: packageKeys.all });
    },
  });
}

export function useUpdatePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePackageInput }) =>
      service.update(id, input),
    onSuccess: (pkg: Package) => {
      queryClient.setQueryData(packageKeys.detail(pkg.id), pkg);
      void queryClient.invalidateQueries({ queryKey: packageKeys.all });
    },
  });
}
