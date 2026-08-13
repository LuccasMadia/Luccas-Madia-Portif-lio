import { render, screen } from '@testing-library/react';
import { Experience } from './Experience';

const experiences = [
  { id: 'e1', role: 'Cargo A', company: 'Empresa A', period: '2023 — Atual', description: 'Descrição A' },
  { id: 'e2', role: 'Cargo B', company: 'Empresa B', period: '2021 — 2023', description: 'Descrição B' },
];

describe('Experience', () => {
  it('renders one timeline item per experience', () => {
    render(<Experience experiences={experiences} />);

    expect(screen.getByRole('heading', { name: 'Cargo A · Empresa A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cargo B · Empresa B' })).toBeInTheDocument();
    expect(screen.getByText('2023 — Atual')).toBeInTheDocument();
  });
});
