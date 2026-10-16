import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DataTable } from '@/components/ui/data-table';

describe('DataTable', () => {
  it('renders rows, sorts, paginates and filters', async () => {
    userEvent.setup();

    render(
      <DataTable
        data={[
          { name: 'Bereket', group: 'G2' },
          { name: 'Abebe', group: 'G1' },
        ]}
        columns={[
          { accessorKey: 'name', header: 'Name' },
          { accessorKey: 'group', header: 'Group' },
        ]}
        enableGlobalFilter
      />,
    );

    expect(screen.getByText('Bereket')).toBeInTheDocument();
    expect(screen.getByText('Abebe')).toBeInTheDocument();

    await userEvent.type(screen.getByRole('searchbox'), 'Abe');
    expect(screen.queryByText('Bereket')).not.toBeInTheDocument();
    expect(screen.getByText('Abebe')).toBeInTheDocument();
  });
});
