import { render, screen } from '@testing-library/react';
import { NotebookFrame } from './NotebookFrame';

describe('NotebookFrame', () => {
  it('renders the given image with matching src and alt', () => {
    render(<NotebookFrame src="screenshot.png" alt="Projeto X" />);

    const img = screen.getByRole('img', { name: 'Projeto X' });
    expect(img).toHaveAttribute('src', 'screenshot.png');
  });

  it('lazy-loads the image', () => {
    render(<NotebookFrame src="screenshot.png" alt="Projeto X" />);

    expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('loading', 'lazy');
  });

  it('hides decorative frame parts from assistive tech', () => {
    const { container } = render(<NotebookFrame src="screenshot.png" alt="Projeto X" />);

    const decorative = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorative.length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('shows a gradient placeholder with an accessible name when there is no src', () => {
    render(<NotebookFrame alt="Projeto Sem Imagem" gradientIndex={4} />);

    const placeholder = screen.getByRole('img', { name: 'Projeto Sem Imagem' });
    expect(placeholder.tagName).not.toBe('IMG');
    expect(placeholder).toHaveClass('notebook-frame__screen--gradient-1');
  });

  it('does not render a hover overlay when no title is given', () => {
    const { container } = render(<NotebookFrame src="screenshot.png" alt="Projeto X" />);

    expect(container.querySelector('.notebook-frame__overlay')).not.toBeInTheDocument();
  });

  it('renders the title, description and stack in the hover overlay', () => {
    render(
      <NotebookFrame
        src="screenshot.png"
        alt="Projeto X"
        title="Projeto X"
        description="Uma breve descrição do projeto."
        stack={['React', 'Vite']}
      />
    );

    expect(screen.getByText('Projeto X', { selector: '.notebook-frame__overlay-title' })).toBeInTheDocument();
    expect(screen.getByText('Uma breve descrição do projeto.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vite')).toBeInTheDocument();
  });

  it('omits the stack list when no stack is given', () => {
    const { container } = render(
      <NotebookFrame src="screenshot.png" alt="Projeto X" title="Projeto X" description="Descrição." />
    );

    expect(container.querySelector('.notebook-frame__overlay-stack')).not.toBeInTheDocument();
  });
});
