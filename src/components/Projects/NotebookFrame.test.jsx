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
});
