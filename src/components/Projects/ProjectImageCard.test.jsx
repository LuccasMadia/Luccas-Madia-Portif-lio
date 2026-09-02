import { fireEvent, render, screen } from '@testing-library/react';
import { ProjectImageCard } from './ProjectImageCard';

describe('ProjectImageCard', () => {
  it('renders the first image with matching src and alt', () => {
    render(<ProjectImageCard images={['screenshot.png']} alt="Projeto X" />);

    const img = screen.getByRole('img', { name: 'Projeto X' });
    expect(img).toHaveAttribute('src', 'screenshot.png');
  });

  it('lazy-loads the image', () => {
    render(<ProjectImageCard images={['screenshot.png']} alt="Projeto X" />);

    expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('loading', 'lazy');
  });

  it('shows a gradient placeholder with an accessible name when there are no images', () => {
    render(<ProjectImageCard alt="Projeto Sem Imagem" gradientIndex={4} />);

    const placeholder = screen.getByRole('img', { name: 'Projeto Sem Imagem' });
    expect(placeholder.tagName).not.toBe('IMG');
    expect(placeholder).toHaveClass('project-image-card__image--gradient-1');
  });

  describe('image navigation', () => {
    const images = ['a.png', 'b.png', 'c.png'];

    it('does not render navigation arrows when there is only one image', () => {
      render(<ProjectImageCard images={['a.png']} alt="Projeto X" />);

      expect(screen.queryByRole('button', { name: 'Próxima imagem' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Imagem anterior' })).not.toBeInTheDocument();
    });

    it('does not render navigation arrows when there are no images', () => {
      render(<ProjectImageCard alt="Projeto X" />);

      expect(screen.queryByRole('button', { name: 'Próxima imagem' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Imagem anterior' })).not.toBeInTheDocument();
    });

    it('shows the next image when clicking the next arrow, looping from the last back to the first', () => {
      render(<ProjectImageCard images={images} alt="Projeto X" />);
      const next = screen.getByRole('button', { name: 'Próxima imagem' });

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'b.png');

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'c.png');

      fireEvent.click(next);
      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'a.png');
    });

    it('shows the previous image, looping to the last when clicking previous from the first', () => {
      render(<ProjectImageCard images={images} alt="Projeto X" />);

      fireEvent.click(screen.getByRole('button', { name: 'Imagem anterior' }));

      expect(screen.getByRole('img', { name: 'Projeto X' })).toHaveAttribute('src', 'c.png');
    });

    it('keeps clicks on the navigation arrows from bubbling up to a wrapping element', () => {
      const handleClick = vi.fn();
      render(
        <div onClick={handleClick}>
          <ProjectImageCard images={images} alt="Projeto X" />
        </div>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Próxima imagem' }));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
