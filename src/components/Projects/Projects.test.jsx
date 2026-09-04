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
  it('renders a "Ver mais projetos" link pointing to the dedicated projects page', () => {
    render(<Projects projects={projects} />);

    const link = screen.getByRole('link', { name: 'Ver mais projetos' });
    expect(link).toHaveAttribute('href', '/projetos');
  });

  it('only renders the first 5 projects, even when more are passed', () => {
    const manyProjects = [
      ...projects,
      { id: 'p3', title: 'Projeto C', description: 'Descrição C', stack: ['Node'] },
      { id: 'p4', title: 'Projeto D', description: 'Descrição D', stack: ['Go'] },
      { id: 'p5', title: 'Projeto E', description: 'Descrição E', stack: ['Rust'] },
      { id: 'p6', title: 'Projeto F', description: 'Descrição F', stack: ['Java'] },
    ];
    render(<Projects projects={manyProjects} />);

    expect(screen.getByRole('heading', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto B' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto C' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto D' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto E' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Projeto F' })).not.toBeInTheDocument();
  });

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

    const codeLink = screen.getByRole('link', { name: 'Ver código no GitHub' });
    expect(codeLink).toHaveAttribute('href', 'https://github.com/user/a');
  });

  it('renders a pending GitHub icon when the project has no codeUrl yet', () => {
    const project = { ...projects[0], codeUrl: undefined };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('link', { name: 'Ver código no GitHub' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Código em breve')).toBeInTheDocument();
  });

  it('does not render "Visitar site" when the project has no liveUrl', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('link', { name: 'Visitar site' })).not.toBeInTheDocument();
  });

  it('shows the first image as the visual cover when the project has images', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    expect(screen.getByRole('img', { name: 'Projeto A' })).toHaveAttribute('src', 'a.png');
  });

  it('shows a gradient placeholder when the project has no images or case study', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    const placeholder = screen.getByRole('img', { name: 'Projeto A' });
    expect(placeholder.tagName).not.toBe('IMG');
  });

  it('opens the site in a new tab when clicking the visual of a project that only has a liveUrl', () => {
    render(<Projects projects={[projects[0]]} />);

    const links = screen.getAllByRole('link', { name: /visitar site de projeto a/i });
    expect(links[0]).toHaveAttribute('href', 'https://example.com/a');
  });

  it('opens the case study modal when clicking the visual of a project with case study entries', () => {
    const project = {
      ...projects[0],
      caseStudy: [{ titulo: 'Tela inicial', imagem: 'inicio.png', descricao: 'Descrição da tela inicial.' }],
    };
    render(<Projects projects={[project]} />);

    fireEvent.click(screen.getByRole('button', { name: /ver projeto projeto a/i }));

    expect(screen.getByText('Descrição da tela inicial.')).toBeInTheDocument();
  });

  it('opens the case study modal with a carousel when clicking a project that only has plain images', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    fireEvent.click(screen.getByRole('button', { name: /ver projeto projeto a/i }));

    expect(screen.getAllByRole('img').some((img) => img.getAttribute('src') === 'a.png')).toBe(true);
  });

  it('is not wrapped in a link or button when the project has neither a liveUrl nor a case study', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('link', { name: /visitar site/i })).not.toBeInTheDocument();
    expect(document.querySelector('.project-image-trigger')).not.toBeInTheDocument();
  });

  describe('image navigation', () => {
    it('cycles through a project own images using its internal arrows without opening the case study modal', () => {
      const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
      render(<Projects projects={[project]} />);

      fireEvent.click(screen.getByRole('button', { name: 'Próxima imagem' }));

      expect(screen.getByRole('img', { name: 'Projeto A' })).toHaveAttribute('src', 'b.png');
      expect(document.querySelector('.case-study-modal')).not.toBeInTheDocument();
    });

    it('keeps each project image gallery independent from the others', () => {
      const projectA = { ...projects[0], liveUrl: undefined, images: ['a1.png', 'a2.png'] };
      const projectB = { ...projects[1], liveUrl: undefined, images: ['b1.png', 'b2.png'] };
      render(<Projects projects={[projectA, projectB]} />);

      const [cardA, cardB] = screen.getAllByRole('button', { name: 'Próxima imagem' });
      fireEvent.click(cardA);

      expect(screen.getByRole('img', { name: 'Projeto A' })).toHaveAttribute('src', 'a2.png');
      expect(screen.getByRole('img', { name: 'Projeto B' })).toHaveAttribute('src', 'b1.png');

      fireEvent.click(cardB);
      expect(screen.getByRole('img', { name: 'Projeto B' })).toHaveAttribute('src', 'b2.png');
    });
  });
});
