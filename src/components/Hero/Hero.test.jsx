import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

const about = {
  name: 'Luccas Madia',
  company: 'Madia Consultoria',
  heroDescription: 'Descrição de teste.',
};

const services = [
  { id: 's1', title: 'Sites e Sistemas', short: 'Sob medida.', description: 'x', icon: 'FaCode' },
  { id: 's2', title: 'Placas NFC', short: 'Com um toque.', description: 'x', icon: 'MdNfc' },
];

describe('Hero', () => {
  it('shows the company, the signature, the description, the CTAs and the services folder', () => {
    render(<Hero about={about} services={services} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Madia Consultoria' })).toBeInTheDocument();
    expect(screen.getByText('Luccas Madia')).toBeInTheDocument();
    expect(screen.getByText('Descrição de teste.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Fale comigo' })).toHaveAttribute('href', '#contato');
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '#projetos');
    expect(screen.getByRole('button', { name: 'Serviços' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Placas NFC' })).toBeInTheDocument();
    expect(screen.getByText('Com um toque.')).toBeInTheDocument();
  });
});
