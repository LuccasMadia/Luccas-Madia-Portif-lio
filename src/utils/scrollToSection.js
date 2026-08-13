export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth' });

  if (window.history?.pushState) {
    window.history.pushState(null, '', `#${id}`);
  }
}
