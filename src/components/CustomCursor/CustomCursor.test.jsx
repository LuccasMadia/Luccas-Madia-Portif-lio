import { render, screen, fireEvent } from '@testing-library/react';
import { CustomCursor } from './CustomCursor';

function mockMatchMedia(matches) {
  window.matchMedia = () => ({
    matches,
    media: '',
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

describe('CustomCursor', () => {
  it('does not render on touch devices', () => {
    mockMatchMedia(true);
    render(<CustomCursor />);
    expect(screen.queryByTestId('custom-cursor')).not.toBeInTheDocument();
  });

  it('follows the mouse position on desktop', () => {
    mockMatchMedia(false);
    render(<CustomCursor />);
    const cursor = screen.getByTestId('custom-cursor');

    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });

    expect(cursor.style.transform).toBe('translate(120px, 80px)');
  });
});
