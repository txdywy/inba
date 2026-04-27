import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App shell', () => {
  it('renders the NBA Live Hub headline and main landmark', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /playoff race tightens/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});