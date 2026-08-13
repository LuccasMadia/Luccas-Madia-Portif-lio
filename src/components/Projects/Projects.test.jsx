import { render, screen } from '@testing-library/react';
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
];

describe('Projects', () => {
  it('renders project details and links that open in a new tab', () => {
    render(<Projects projects={projects} />);

    expect(screen.getByRole('heading', { name: 'Projeto A' })).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();

    const liveLink = screen.getByRole('link', { name: 'Ver projeto' });
    expect(liveLink).toHaveAttribute('href', 'https://example.com/a');
    expect(liveLink).toHaveAttribute('target', '_blank');
    expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer');

    const codeLink = screen.getByRole('link', { name: 'Código' });
    expect(codeLink).toHaveAttribute('href', 'https://github.com/user/a');
  });
});
