import { fireEvent, render, screen } from '@testing-library/react';
import { ServicesFolder } from './ServicesFolder';

const services = [
  { id: 'a', title: 'Sites e Sistemas', short: 'Sob medida.' },
  { id: 'b', title: 'Automação', short: 'Menos tarefa.' },
  { id: 'c', title: 'Google Meu Negócio', short: 'No Google.' },
  { id: 'd', title: 'Placas NFC', short: 'Com um toque.' },
];

describe('ServicesFolder', () => {
  it('keeps one page per service inside the folder', () => {
    render(<ServicesFolder services={services} />);

    services.forEach((service) => {
      expect(screen.getByRole('heading', { name: service.title })).toBeInTheDocument();
      expect(screen.getByText(service.short)).toBeInTheDocument();
    });
  });

  it('shows the art on pages that have one and keeps the short text for the others', () => {
    const withArt = services.map((service, index) => (index === 0 ? { ...service, image: 'sites.webp' } : service));
    const { container } = render(<ServicesFolder services={withArt} />);

    expect(container.querySelectorAll('.services-folder__page-image')).toHaveLength(1);
    expect(container.querySelector('.services-folder__page-image')).toHaveAttribute('src', 'sites.webp');
    expect(screen.queryByText('Sob medida.')).not.toBeInTheDocument();
    expect(screen.getByText('Menos tarefa.')).toBeInTheDocument();
  });

  it('opens and closes with a tap or the keyboard', () => {
    render(<ServicesFolder services={services} />);
    const folder = screen.getByRole('button', { name: 'Serviços' });

    expect(folder).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(folder);
    expect(folder).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(folder, { key: 'Enter' });
    expect(folder).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens on hover when the device has a mouse', () => {
    const original = window.matchMedia;
    window.matchMedia = (query) => ({ matches: query === '(hover: hover)', media: query, addEventListener() {}, removeEventListener() {} });
    try {
      render(<ServicesFolder services={services} />);
      const folder = screen.getByRole('button', { name: 'Serviços' });
      fireEvent.mouseEnter(folder);
      expect(folder).toHaveAttribute('aria-expanded', 'true');
      fireEvent.mouseLeave(folder);
      expect(folder).toHaveAttribute('aria-expanded', 'false');
      expect(screen.getByText('passe o mouse para abrir')).toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });
});
