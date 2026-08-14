import { useState } from 'react';
import logoMark from '../../assets/brand/logo-mark.png';
import { useActiveSection } from '../../hooks/useActiveSection';
import { scrollToSection } from '../../utils/scrollToSection';
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

  const handleNavClick = (event, id) => {
    event.preventDefault();
    scrollToSection(id);
    closeMenu();
  };

  return (
    <header className="header">
      <div className="header__inner">
        <a href="#sobre" className="header__logo" onClick={(event) => handleNavClick(event, 'sobre')}>
          <img src={logoMark} alt={name} className="header__logo-image" />
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
              onClick={(event) => handleNavClick(event, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
