import { render, screen, waitFor } from '@testing-library/react';
import { Hero } from './Hero';

const about = {
  name: 'Luccas Madia',
  tagline: 'Dev',
  bio: 'Bio de teste.',
};

describe('Hero', () => {
  it('renders the name, bio and CTAs', async () => {
    render(<Hero about={about} />);

    expect(screen.getByRole('heading', { name: 'Luccas Madia' })).toBeInTheDocument();
    expect(screen.getByText('Bio de teste.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '#projetos');
    expect(screen.getByRole('link', { name: 'Fale comigo' })).toHaveAttribute('href', '#contato');

    await waitFor(() => {
      expect(screen.getByText('Dev', { exact: false })).toBeInTheDocument();
    });
  });
});
