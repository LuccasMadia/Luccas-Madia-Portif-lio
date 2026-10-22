import { render, screen } from '@testing-library/react';
import { Services } from '../Services/Services';
import { ServicesFolder } from '../ServicesFolder/ServicesFolder';
import { ServicesFlight } from './ServicesFlight';

const services = [
  { id: 'a', title: 'Sites e Sistemas', short: 'Sob medida.' },
  { id: 'b', title: 'Automação', short: 'Menos tarefa.' },
];

describe('ServicesFlight', () => {
  it('keeps its flying copies out of the accessibility tree and the tab order', () => {
    render(<ServicesFlight services={services} />);
    const stage = document.querySelector('.services-flight');

    expect(stage).toHaveAttribute('aria-hidden', 'true');
    expect(stage).toHaveAttribute('inert');
    expect(stage.querySelectorAll('.services-flight__card')).toHaveLength(2);
    expect(screen.queryByRole('heading', { name: 'Automação' })).not.toBeInTheDocument();
  });

  it('leaves the real cards in place when there is no layout to animate (jsdom)', () => {
    render(
      <>
        <ServicesFolder services={services} />
        <Services services={services} />
        <ServicesFlight services={services} />
      </>,
    );

    document.querySelectorAll('#servicos .service-card').forEach((card) => {
      expect(card.style.visibility).toBe('');
    });
    expect(screen.getAllByRole('link', { name: /Quero saber mais/ })).toHaveLength(2);
  });
});
