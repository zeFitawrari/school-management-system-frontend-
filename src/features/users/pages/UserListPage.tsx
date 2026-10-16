import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../types/user';

export function UserListPage() {
  const usersQuery = useUsers();

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => row.original.roles.join(', ') || '—',
      },
      {
        accessorKey: 'branchIds',
        header: 'Branches',
        cell: ({ row }) => row.original.branchIds.join(', ') || 'All',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (row.original.status === 'active' ? 'Active' : 'Inactive'),
      },
    ],
    [],
  );

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Users & roles</h1>
        <p className="mt-1 text-muted-foreground">Manage accounts, roles and branch access.</p>
      </div>

      <QueryState
        isLoading={usersQuery.isLoading}
        isError={usersQuery.isError}
        data={usersQuery.data?.items}
        error={usersQuery.error}
        emptyTitle="No users found"
        emptyDescription="Create a user or adjust the filters."
        onRetry={() => void usersQuery.refetch()}
      >
        {(users) => (
          <DataTable
            data={users ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder="Search users"
          />
        )}
      </QueryState>
    </section>
  );
}
