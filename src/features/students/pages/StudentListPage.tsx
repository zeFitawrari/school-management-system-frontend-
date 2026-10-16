import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';

import { Link } from 'react-router-dom';

import { QueryState } from '@/components/feedback/QueryState';
import { DataTable } from '@/components/ui/data-table';
import { useStudents } from '../hooks/useStudents';
import type { Student } from '../types/student';

export function StudentListPage() {
  const studentsQuery = useStudents();

  const columns = useMemo<ColumnDef<Student, unknown>[]>(
    () => [
      {
        accessorKey: 'studentNumber',
        header: 'Student no.',
      },
      {
        accessorKey: 'fullName',
        header: 'Name',
        cell: ({ row }) => (
          <Link className="text-primary hover:underline" to={`/app/students/${row.original.id}`}>
            {row.original.fullName}
          </Link>
        ),
      },
      {
        accessorKey: 'groupId',
        header: 'Group',
        cell: ({ row }) => row.original.groupId ?? '—',
      },
      {
        accessorKey: 'packageIds',
        header: 'Packages',
        cell: ({ row }) => row.original.packageIds.join(', ') || '—',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
    ],
    [],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Students</h1>
          <p className="mt-1 text-muted-foreground">Directory, status and enrollment overview.</p>
        </div>
        <Link
          to="/app/students/new"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-800"
        >
          Register student
        </Link>
      </div>

      <QueryState
        isLoading={studentsQuery.isLoading}
        isError={studentsQuery.isError}
        data={studentsQuery.data?.items}
        error={studentsQuery.error}
        emptyTitle="No students found"
        emptyDescription="Register a student or adjust the filters."
        onRetry={() => void studentsQuery.refetch()}
      >
        {(students) => (
          <DataTable
            data={students ?? []}
            columns={columns}
            enableGlobalFilter
            searchPlaceholder="Search students"
          />
        )}
      </QueryState>
    </section>
  );
}
