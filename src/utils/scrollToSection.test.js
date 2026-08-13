import { scrollToSection } from './scrollToSection';

describe('scrollToSection', () => {
  it('scrolls the element with the given id into view smoothly', () => {
    const el = document.createElement('div');
    el.id = 'target';
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    scrollToSection('target');

    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(el);
  });

  it('does nothing when no element matches the id', () => {
    expect(() => scrollToSection('does-not-exist')).not.toThrow();
  });
});
