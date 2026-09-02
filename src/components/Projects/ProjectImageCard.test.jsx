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

  it('renders a muted, non-looping video when a video is provided, ignoring images', () => {
    const { container } = render(
      <ProjectImageCard video="demo.webm" images={['screenshot.png']} alt="Projeto X" />
    );

    const video = container.querySelector('video');
    expect(video).toHaveAttribute('src', 'demo.webm');
    expect(video).not.toHaveAttribute('loop');
    expect(video.muted).toBe(true);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a play button that starts playback and hides itself once playing', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);
    const video = container.querySelector('video');

    const playButton = screen.getByRole('button', { name: 'Reproduzir vídeo de Projeto X' });
    fireEvent.click(playButton);
    fireEvent.play(video);

    expect(screen.queryByRole('button', { name: 'Reproduzir vídeo de Projeto X' })).not.toBeInTheDocument();
  });

  it('shows the play button again once the video is paused', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);
    const video = container.querySelector('video');

    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir vídeo de Projeto X' }));
    fireEvent.play(video);
    fireEvent.click(video);
    fireEvent.pause(video);

    expect(screen.getByRole('button', { name: 'Reproduzir vídeo de Projeto X' })).toBeInTheDocument();
  });

  it('shows the play button again and resets to the start once the video ends', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);
    const video = container.querySelector('video');

    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir vídeo de Projeto X' }));
    fireEvent.play(video);
    fireEvent.ended(video);

    expect(screen.getByRole('button', { name: 'Reproduzir vídeo de Projeto X' })).toBeInTheDocument();
    expect(video.currentTime).toBe(0);
  });

  it('shows a progress bar and a 0:00 / 0:00 time label before metadata loads', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);

    expect(container.querySelector('.project-image-card__progress')).toBeInTheDocument();
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument();
  });

  it('seeks to the clicked position on the progress bar', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);
    const video = container.querySelector('video');
    Object.defineProperty(video, 'duration', { value: 100, configurable: true });
    const progressBar = container.querySelector('.project-image-card__progress');
    progressBar.getBoundingClientRect = () => ({ left: 0, width: 200 });

    fireEvent.pointerDown(progressBar, { clientX: 100, pointerId: 1 });

    expect(video.currentTime).toBe(50);
  });

  it('keeps seeking while dragging across the progress bar, and stops on pointer up', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);
    const video = container.querySelector('video');
    Object.defineProperty(video, 'duration', { value: 100, configurable: true });
    const progressBar = container.querySelector('.project-image-card__progress');
    progressBar.getBoundingClientRect = () => ({ left: 0, width: 200 });

    fireEvent.pointerDown(progressBar, { clientX: 20, pointerId: 1 });
    expect(video.currentTime).toBe(10);

    fireEvent.pointerMove(progressBar, { clientX: 160, pointerId: 1 });
    expect(video.currentTime).toBe(80);

    fireEvent.pointerUp(progressBar, { clientX: 160, pointerId: 1 });
    fireEvent.pointerMove(progressBar, { clientX: 0, pointerId: 1 });
    expect(video.currentTime).toBe(80);
  });

  it('seeks forward and backward 5s with the arrow keys', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);
    const video = container.querySelector('video');
    Object.defineProperty(video, 'duration', { value: 100, configurable: true });
    video.currentTime = 10;
    const progressBar = container.querySelector('.project-image-card__progress');

    fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
    expect(video.currentTime).toBe(15);

    fireEvent.keyDown(progressBar, { key: 'ArrowLeft' });
    fireEvent.keyDown(progressBar, { key: 'ArrowLeft' });
    expect(video.currentTime).toBe(5);
  });

  it('cycles the playback speed on each click of the speed button', () => {
    const { container } = render(<ProjectImageCard video="demo.webm" alt="Projeto X" />);
    const video = container.querySelector('video');

    const speedButton = screen.getByRole('button', { name: 'Velocidade do vídeo: 1x' });
    expect(speedButton).toHaveTextContent('1x');

    fireEvent.click(speedButton);
    expect(screen.getByRole('button', { name: 'Velocidade do vídeo: 1.25x' })).toHaveTextContent('1.25x');
    expect(video.playbackRate).toBe(1.25);

    fireEvent.click(screen.getByRole('button', { name: 'Velocidade do vídeo: 1.25x' }));
    expect(screen.getByRole('button', { name: 'Velocidade do vídeo: 1.5x' })).toHaveTextContent('1.5x');
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
