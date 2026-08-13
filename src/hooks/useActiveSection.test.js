import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from './useActiveSection';

class IntersectionObserverStub {
  constructor(callback) {
    this.callback = callback;
    IntersectionObserverStub.instances.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
IntersectionObserverStub.instances = [];

describe('useActiveSection', () => {
  beforeEach(() => {
    IntersectionObserverStub.instances = [];
    global.IntersectionObserver = IntersectionObserverStub;
    document.body.innerHTML = '<div id="sobre"></div><div id="projetos"></div>';
  });

  it('defaults to the first section id', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'projetos']));
    expect(result.current).toBe('sobre');
  });

  it('updates to the section reported as intersecting', () => {
    const { result } = renderHook(() => useActiveSection(['sobre', 'projetos']));
    const observerInstance = IntersectionObserverStub.instances[0];

    act(() => {
      observerInstance.callback([
        { isIntersecting: true, target: document.getElementById('projetos') },
      ]);
    });

    expect(result.current).toBe('projetos');
  });
});
