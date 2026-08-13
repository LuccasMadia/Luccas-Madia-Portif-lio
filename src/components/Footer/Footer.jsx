import { scrollToSection } from '../../utils/scrollToSection';
import './Footer.css';

function handleClick(event, id) {
  event.preventDefault();
  scrollToSection(id);
}

export function Footer({ name }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {year} {name}. Todos os direitos reservados.
      </p>
      <div className="footer__links">
        <a href="#sobre" onClick={(event) => handleClick(event, 'sobre')}>
          Sobre
        </a>
        <a href="#projetos" onClick={(event) => handleClick(event, 'projetos')}>
          Projetos
        </a>
        <a href="#contato" onClick={(event) => handleClick(event, 'contato')}>
          Contato
        </a>
      </div>
    </footer>
  );
}
