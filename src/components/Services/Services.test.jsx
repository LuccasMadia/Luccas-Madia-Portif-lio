import { render, screen } from '@testing-library/react';
import { Services } from './Services';

const services = [
  { id: 's1', title: 'Serviço 1', description: 'Descrição 1', icon: 'FaCode' },
  { id: 's2', title: 'Serviço 2', description: 'Descrição 2', icon: 'FaRobot' },
];

describe('Services', () => {
  it('renders a card for each service', () => {
    render(<Services services={services} />);

    expect(screen.getByRole('heading', { name: 'Serviço 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Serviço 2' })).toBeInTheDocument();
    expect(screen.getByText('Descrição 1')).toBeInTheDocument();
    expect(screen.getByText('Descrição 2')).toBeInTheDocument();
  });
});
