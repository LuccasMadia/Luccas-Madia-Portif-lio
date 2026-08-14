import { fireEvent, render, screen } from '@testing-library/react';
import { Projects } from './Projects';

const projects = [
  {
    id: 'p1',
    title: 'Projeto A',
    description: 'Descrição A',
    stack: ['React', 'Vite'],
    liveUrl: 'https://example.com/a',
    codeUrl: 'https://github.com/user/a',
  },
  {
    id: 'p2',
    title: 'Projeto B',
    description: 'Descrição B',
    stack: ['Python'],
    liveUrl: 'https://example.com/b',
    codeUrl: 'https://github.com/user/b',
  },
];

describe('Projects', () => {
  it('renders a numbered card for each project with its title', () => {
    render(<Projects projects={projects} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto B' })).toBeInTheDocument();
  });

  it('renders project details and a "Visitar site" link that opens in a new tab', () => {
    render(<Projects projects={[projects[0]]} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
    expect(screen.getByText('Descrição A')).toBeInTheDocument();

    const liveLink = screen.getByRole('link', { name: 'Visitar site' });
    expect(liveLink).toHaveAttribute('href', 'https://example.com/a');
    expect(liveLink).toHaveAttribute('target', '_blank');
    expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer');

    const codeLink = screen.getByRole('link', { name: 'Código' });
    expect(codeLink).toHaveAttribute('href', 'https://github.com/user/a');
  });

  it('does not render "Visitar site" when the project has no liveUrl', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('link', { name: 'Visitar site' })).not.toBeInTheDocument();
  });

  it('renders only the first screenshot as a static thumbnail when the project has images', () => {
    const project = { ...projects[0], images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    expect(screen.getAllByRole('img')).toHaveLength(1);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'a.png');
  });

  it('opens the case study modal from "Ver projeto" when the project has caseStudy entries', () => {
    const project = {
      ...projects[0],
      caseStudy: [{ titulo: 'Tela inicial', imagem: 'inicio.png', descricao: 'Descrição da tela inicial.' }],
    };
    render(<Projects projects={[project]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver projeto' }));

    expect(screen.getByText('Descrição da tela inicial.')).toBeInTheDocument();
  });

  it('opens the case study modal with a carousel when the project only has plain images', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver projeto' }));

    expect(screen.getAllByRole('img').some((img) => img.getAttribute('src') === 'a.png')).toBe(true);
  });
});
