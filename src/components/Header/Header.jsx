import { useState } from 'react';
import { useActiveSection } from '../../hooks/useActiveSection';
import './Header.css';

const NAV_ITEMS = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'contato', label: 'Contato' },
];

export function Header({ name }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useActiveSection(NAV_ITEMS.map((item) => item.id));

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#sobre" className="header__logo">
          {name}
        </a>
        <button
          type="button"
          className="header__toggle"
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`header__link ${activeId === item.id ? 'header__link--active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
