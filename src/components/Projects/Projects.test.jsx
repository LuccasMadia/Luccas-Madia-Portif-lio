import { fireEvent, render, screen, within } from '@testing-library/react';
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

  it('only puts the first 5 projects in the card stack, even when more are passed', () => {
    const manyProjects = [
      ...projects,
      { id: 'p3', title: 'Projeto C', description: 'Descrição C', stack: ['Node'] },
      { id: 'p4', title: 'Projeto D', description: 'Descrição D', stack: ['Go'] },
      { id: 'p5', title: 'Projeto E', description: 'Descrição E', stack: ['Rust'] },
      { id: 'p6', title: 'Projeto F', description: 'Descrição F', stack: ['Java'] },
    ];
    render(<Projects projects={manyProjects} />);

    const stack = within(screen.getByRole('region', { name: 'Projetos' }));
    ['Projeto A', 'Projeto B', 'Projeto C', 'Projeto D', 'Projeto E'].forEach((title) =>
      expect(stack.getByText(title)).toBeInTheDocument(),
    );
    expect(screen.queryByText('Projeto F')).not.toBeInTheDocument();
  });

  it('shows the number and title of the project at the front of the stack', () => {
    render(<Projects projects={projects} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Projeto B' })).not.toBeInTheDocument();
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

  it('uses the first image as the cover of the project card', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    expect(screen.getByRole('img', { name: 'Tela do projeto Projeto A' })).toHaveAttribute('src', 'a.png');
  });

  it('shows the card without a picture when the project has no images or case study', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('img', { name: 'Tela do projeto Projeto A' })).not.toBeInTheDocument();
  });

  it('opens the site in a new tab when clicking the front card of a project that only has a liveUrl', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<Projects projects={[projects[0]]} />);

    fireEvent.click(within(screen.getByRole('region', { name: 'Projetos' })).getByText('Projeto A'));

    expect(open).toHaveBeenCalledWith('https://example.com/a', '_blank', 'noopener,noreferrer');
    open.mockRestore();
  });

  it('opens the case study modal when clicking the front card of a project with case study entries', () => {
    const project = {
      ...projects[0],
      caseStudy: [{ titulo: 'Tela inicial', imagem: 'inicio.png', descricao: 'Descrição da tela inicial.' }],
    };
    render(<Projects projects={[project]} />);

    fireEvent.click(screen.getByRole('img', { name: 'Tela do projeto Projeto A' }));

    expect(screen.getByText('Descrição da tela inicial.')).toBeInTheDocument();
  });

  it('opens the case study modal from the "Ver projeto" button when the project only has plain images', () => {
    const project = { ...projects[0], liveUrl: undefined, images: ['a.png', 'b.png'] };
    render(<Projects projects={[project]} />);

    fireEvent.click(screen.getByRole('button', { name: 'Ver projeto' }));

    expect(document.querySelector('.case-study-modal')).toBeInTheDocument();
  });

  it('is not wrapped in a link or button when the project has neither a liveUrl nor a case study', () => {
    const project = { ...projects[0], liveUrl: undefined };
    render(<Projects projects={[project]} />);

    expect(screen.queryByRole('link', { name: /visitar site/i })).not.toBeInTheDocument();
    expect(document.querySelector('.project-image-trigger')).not.toBeInTheDocument();
  });
});
