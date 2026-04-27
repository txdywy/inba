import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('renders the NBA Live Hub headline and main landmark', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /playoff picture taking shape/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^standings$/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByText(/bracket tree, momentum cards, and star watch/i)).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('switches the standings rail between conferences', () => {
    render(<App />);

    const standingsSection = screen.getByRole('heading', { name: /^standings$/i, level: 2 }).closest('section');
    expect(standingsSection).not.toBeNull();

    const standingsScope = within(standingsSection as HTMLElement);
    expect(standingsScope.getByRole('tabpanel', { name: /east standings/i })).toBeInTheDocument();
    expect(standingsScope.queryAllByText(/detroit pistons/i).length).toBeGreaterThan(0);
    expect(standingsScope.queryAllByText(/oklahoma city thunder/i)).toHaveLength(0);

    fireEvent.click(standingsScope.getByRole('tab', { name: /west/i }));

    expect(standingsScope.getByRole('tabpanel', { name: /west standings/i })).toBeInTheDocument();
    expect(standingsScope.queryAllByText(/oklahoma city thunder/i).length).toBeGreaterThan(0);
    expect(standingsScope.queryAllByText(/detroit pistons/i)).toHaveLength(0);
  });
});
