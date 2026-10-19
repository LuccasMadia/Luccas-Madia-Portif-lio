import { act, fireEvent, render, screen } from '@testing-library/react';
import { WelcomeIntro, shouldShowIntro } from './WelcomeIntro';

describe('WelcomeIntro', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
  });

  it('writes "Bem-vindo", then fades out and finishes on its own', () => {
    const onLeave = vi.fn();
    const onDone = vi.fn();
    render(<WelcomeIntro onLeave={onLeave} onDone={onDone} />);

    expect(screen.getByRole('img', { name: 'Bem-vindo' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    act(() => vi.advanceTimersByTime(1500)); // espera a fonte (jsdom não carrega fontes)
    act(() => vi.advanceTimersByTime(2800 + 350));
    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(onDone).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(700));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('a click skips straight to the fade', () => {
    const onDone = vi.fn();
    const { container } = render(<WelcomeIntro onDone={onDone} />);

    fireEvent.click(container.firstChild);
    expect(container.firstChild).toHaveClass('welcome-intro--leaving');
    act(() => vi.advanceTimersByTime(700));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('shows only once per visit', () => {
    expect(shouldShowIntro()).toBe(true);
    render(<WelcomeIntro onDone={() => {}} />);
    expect(shouldShowIntro()).toBe(false);
  });

  it('is skipped for people who reduce motion', () => {
    const original = window.matchMedia;
    window.matchMedia = (query) => ({ matches: query === '(prefers-reduced-motion: reduce)', media: query, addEventListener() {}, removeEventListener() {} });
    try {
      expect(shouldShowIntro()).toBe(false);
    } finally {
      window.matchMedia = original;
    }
  });
});
