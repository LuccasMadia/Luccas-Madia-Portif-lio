import '@testing-library/jest-dom';

class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = IntersectionObserverMock;
  global.IntersectionObserver = IntersectionObserverMock;
}

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (callback) => setTimeout(() => callback(Date.now()), 16);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
}
