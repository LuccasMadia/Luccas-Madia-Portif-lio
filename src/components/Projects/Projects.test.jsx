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
  it('renders a notebook screen for each project with an accessible name', () => {
    render(<Projects projects={projects} />);

    expect(screen.getByRole('img', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Projeto B' })).toBeInTheDocument();
  });

  it('shows a gradient placeholder screen even when the project has images (images disabled for now)', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    const placeholder = screen.getByRole('img', { name: 'Projeto A' });
    expect(placeholder.tagName).not.toBe('IMG');
  });

  it('shows a gradient placeholder screen when the project has no images or case study', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    const placeholder = screen.getByRole('img', { name: 'Projeto A' });
    expect(placeholder.tagName).not.toBe('IMG');
  });

  it('opens the site in a new tab when clicking a project that only has a liveUrl', () => {
    render(<Projects projects={[projects[0]]} />);

    const link = screen.getByRole('link', { name: /projeto a/i });
    expect(link).toHaveAttribute('href', 'https://example.com/a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('opens the case study modal when clicking a project with case study entries, even if it also has a liveUrl', () => {
    const project = {
      ...projects[0],
      caseStudy: [{ titulo: 'Tela inicial', imagem: 'inicio.png', descricao: 'Descrição da tela inicial.' }],
    };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('link', { name: /projeto a/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /projeto a/i }));

    expect(screen.getByText('Descrição da tela inicial.')).toBeInTheDocument();
  });

  it('opens the case study modal with a carousel when clicking a project that only has plain images', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    fireEvent.click(screen.getByRole('button', { name: /projeto a/i }));

    expect(screen.getAllByRole('img').some((img) => img.getAttribute('src') === 'a.png')).toBe(true);
  });

  it('is not clickable when the project has neither a liveUrl nor a case study', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
