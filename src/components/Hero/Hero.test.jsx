import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

const about = {
  name: 'Luccas Madia',
  company: 'Madia Consultoria',
  heroDescription: 'Descrição de teste.',
};

const services = [
  { id: 's1', title: 'Sites e Sistemas', description: 'Sob medida.', icon: 'FaCode' },
  { id: 's2', title: 'Placas NFC', description: 'Com um toque.', icon: 'MdNfc' },
];

describe('Hero', () => {
  it('shows the company, the signature, the description, the CTAs and a card per service', () => {
    render(<Hero about={about} services={services} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Madia Consultoria' })).toBeInTheDocument();
    expect(screen.getByText('Luccas Madia')).toBeInTheDocument();
    expect(screen.getByText('Descrição de teste.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Fale comigo' })).toHaveAttribute('href', '#contato');
    expect(screen.getByRole('link', { name: 'Ver projetos' })).toHaveAttribute('href', '#projetos');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('heading', { level: 2, name: 'Placas NFC' })).toBeInTheDocument();
    expect(screen.getByText('Com um toque.')).toBeInTheDocument();
  });
});
