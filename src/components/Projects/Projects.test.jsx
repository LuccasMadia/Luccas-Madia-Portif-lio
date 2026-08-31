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
  {
    id: 'p3',
    title: 'Projeto C',
    description: 'Descrição C',
    stack: ['Node'],
    liveUrl: 'https://example.com/c',
    codeUrl: 'https://github.com/user/c',
  },
];

describe('Projects', () => {
  it('shows only the first project notebook initially', () => {
    render(<Projects projects={projects} />);

    expect(screen.getByRole('img', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Projeto B' })).not.toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Projeto C' })).not.toBeInTheDocument();
  });

  it('shows the first image as the notebook cover when the project has images', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    expect(screen.getByRole('img', { name: 'Projeto A' })).toHaveAttribute('src', 'a.png');
  });

  it('shows the first case study image as the notebook cover when the project has no plain images', () => {
    const project = {
      ...projects[0],
      liveUrl: undefined,
      caseStudy: [{ titulo: 'Tela inicial', imagem: 'inicio.png', descricao: 'Descrição da tela inicial.' }],
    };
    render(<Projects projects={[project]} />);

    expect(screen.getByRole('img', { name: 'Projeto A' })).toHaveAttribute('src', 'inicio.png');
  });

  it('shows a gradient placeholder screen when the project has no images or case study', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    const placeholder = screen.getByRole('img', { name: 'Projeto A' });
    expect(placeholder.tagName).not.toBe('IMG');
  });

  it('includes the active project title, description and stack for the hover overlay', () => {
    render(<Projects projects={[projects[0]]} />);

    expect(screen.getByText('Descrição A')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
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

  describe('carousel navigation', () => {
    it('shows the next project when clicking the next arrow, looping from the last back to the first', () => {
      render(<Projects projects={projects} />);
      const next = screen.getByRole('button', { name: 'Próximo projeto' });

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto B' })).toBeInTheDocument();

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto C' })).toBeInTheDocument();

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto A' })).toBeInTheDocument();
    });

    it('shows the previous project when clicking the previous arrow, looping from the first back to the last', () => {
      render(<Projects projects={projects} />);

      fireEvent.click(screen.getByRole('button', { name: 'Projeto anterior' }));

      expect(screen.getByRole('img', { name: 'Projeto C' })).toBeInTheDocument();
    });

    it('jumps directly to a project by clicking its dot', () => {
      render(<Projects projects={projects} />);

      fireEvent.click(screen.getByRole('button', { name: 'Ir para o projeto Projeto C' }));

      expect(screen.getByRole('img', { name: 'Projeto C' })).toBeInTheDocument();
    });

    it('marks the dot of the active project as current', () => {
      render(<Projects projects={projects} />);

      expect(screen.getByRole('button', { name: 'Ir para o projeto Projeto A' })).toHaveAttribute(
        'aria-current',
        'true'
      );

      fireEvent.click(screen.getByRole('button', { name: 'Próximo projeto' }));

      expect(screen.getByRole('button', { name: 'Ir para o projeto Projeto B' })).toHaveAttribute(
        'aria-current',
        'true'
      );
    });

    it('hides the arrows and dots when there is only one project', () => {
      render(<Projects projects={[projects[0]]} />);

      expect(screen.queryByRole('button', { name: 'Próximo projeto' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Projeto anterior' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /ir para o projeto/i })).not.toBeInTheDocument();
    });
  });
});
