import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { App } from '@/app/App';

describe('App', () => {
  it('boots and renders the landing route', async () => {
    render(<App />);

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('Welcome');
  });
});
