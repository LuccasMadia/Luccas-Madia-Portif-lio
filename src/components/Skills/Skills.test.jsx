import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';

describe('Skills', () => {
  it('shows only the technologies band', () => {
    render(<Skills />);

    expect(screen.getByRole('region', { name: 'Tecnologias' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Linguagens e tecnologias utilizadas' })).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByText('projetos entregues')).not.toBeInTheDocument();
  });
});
