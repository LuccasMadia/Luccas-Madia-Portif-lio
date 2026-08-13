import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders a link for every nav section', () => {
    render(<Header name="Luccas Madia" />);

    ['Sobre', 'Serviços', 'Experiências', 'Projetos', 'Habilidades', 'Contato'].forEach((label) => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });

  it('toggles the mobile menu when the hamburger button is clicked', () => {
    render(<Header name="Luccas Madia" />);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu when a nav link is clicked', () => {
    render(<Header name="Luccas Madia" />);
    const toggle = screen.getByRole('button', { name: 'Abrir menu' });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('link', { name: 'Projetos' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});
