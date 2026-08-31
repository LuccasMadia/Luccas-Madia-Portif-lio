import { fireEvent, render, screen } from '@testing-library/react';
import { NotebookFrame } from './NotebookFrame';

describe('NotebookFrame', () => {
  it('renders the first image with matching src and alt', () => {
    render(<NotebookFrame images={['screenshot.png']} alt="Projeto X" />);

    const img = screen.getByRole('img', { name: 'Projeto X' });
    expect(img).toHaveAttribute('src', 'screenshot.png');
  });

  it('lazy-loads the image', () => {
    render(<NotebookFrame images={['screenshot.png']} alt="Projeto X" />);

    expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('loading', 'lazy');
  });

  it('hides decorative frame parts from assistive tech', () => {
    const { container } = render(<NotebookFrame images={['screenshot.png']} alt="Projeto X" />);

    const decorative = container.querySelectorAll('[aria-hidden="true"]');
    expect(decorative.length).toBeGreaterThan(0);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('shows a gradient placeholder with an accessible name when there are no images', () => {
    render(<NotebookFrame alt="Projeto Sem Imagem" gradientIndex={4} />);

    const placeholder = screen.getByRole('img', { name: 'Projeto Sem Imagem' });
    expect(placeholder.tagName).not.toBe('IMG');
    expect(placeholder).toHaveClass('notebook-frame__screen--gradient-1');
  });

  it('does not render a hover overlay when no title is given', () => {
    const { container } = render(<NotebookFrame images={['screenshot.png']} alt="Projeto X" />);

    expect(container.querySelector('.notebook-frame__overlay')).not.toBeInTheDocument();
  });

  it('renders the title, description and stack in the hover overlay', () => {
    render(
      <NotebookFrame
        images={['screenshot.png']}
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
      <NotebookFrame images={['screenshot.png']} alt="Projeto X" title="Projeto X" description="Descrição." />
    );

    expect(container.querySelector('.notebook-frame__overlay-stack')).not.toBeInTheDocument();
  });

  describe('image navigation', () => {
    const images = ['a.png', 'b.png', 'c.png'];

    it('does not render navigation arrows when there is only one image', () => {
      render(<NotebookFrame images={['a.png']} alt="Projeto X" />);

      expect(screen.queryByRole('button', { name: 'Próxima imagem' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Imagem anterior' })).not.toBeInTheDocument();
    });

    it('does not render navigation arrows when there are no images', () => {
      render(<NotebookFrame alt="Projeto X" />);

      expect(screen.queryByRole('button', { name: 'Próxima imagem' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Imagem anterior' })).not.toBeInTheDocument();
    });

    it('shows the next image when clicking the next arrow, looping from the last back to the first', () => {
      render(<NotebookFrame images={images} alt="Projeto X" />);
      const next = screen.getByRole('button', { name: 'Próxima imagem' });

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'b.png');

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'c.png');

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'a.png');
    });

    it('shows the previous image, looping to the last when clicking previous from the first', () => {
      render(<NotebookFrame images={images} alt="Projeto X" />);

      fireEvent.click(screen.getByRole('button', { name: 'Imagem anterior' }));

      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'c.png');
    });

    it('keeps clicks on the navigation arrows from bubbling up to a wrapping element', () => {
      const handleClick = vi.fn();
      render(
        <div onClick={handleClick}>
          <NotebookFrame images={images} alt="Projeto X" />
        </div>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Próxima imagem' }));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
