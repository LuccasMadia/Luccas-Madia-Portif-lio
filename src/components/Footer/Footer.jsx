import { scrollToSection } from '../../utils/scrollToSection';
import './Footer.css';

function handleClick(event, id, isHome) {
  if (!isHome) return;
  event.preventDefault();
  scrollToSection(id);
}

export function Footer({ name }) {
  const year = new Date().getFullYear();
  const isHome = typeof window !== 'undefined' && window.location.pathname === '/';

  return (
    <footer className="footer">
      <p>
        © {year} {name}. Todos os direitos reservados.
      </p>
      <div className="footer__links">
        <a href={isHome ? '#sobre' : '/#sobre'} onClick={(event) => handleClick(event, 'sobre', isHome)}>
          Sobre
        </a>
        <a href={isHome ? '#projetos' : '/#projetos'} onClick={(event) => handleClick(event, 'projetos', isHome)}>
          Projetos
        </a>
        <a href={isHome ? '#contato' : '/#contato'} onClick={(event) => handleClick(event, 'contato', isHome)}>
          Contato
        </a>
      </div>
    </footer>
  );
}
