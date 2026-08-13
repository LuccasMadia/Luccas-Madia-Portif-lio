import { act, render, screen } from '@testing-library/react';
import { ProjectCarousel } from './ProjectCarousel';

describe('ProjectCarousel', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first image and one dot per image', () => {
    render(<ProjectCarousel images={['a.png', 'b.png', 'c.png']} alt="Projeto" />);

    expect(screen.getByRole('img')).toHaveAttribute('src', 'a.png');
    expect(document.querySelectorAll('.project-carousel__dot')).toHaveLength(3);
  });

  it('advances to the next image after the interval elapses', () => {
    vi.useFakeTimers();
    render(<ProjectCarousel images={['a.png', 'b.png']} alt="Projeto" interval={1000} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole('img')).toHaveAttribute('src', 'b.png');
  });

  it('does not render dots for a single image', () => {
    render(<ProjectCarousel images={['a.png']} alt="Projeto" />);
    expect(document.querySelectorAll('.project-carousel__dot')).toHaveLength(0);
  });
});
