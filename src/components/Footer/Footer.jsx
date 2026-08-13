import './Footer.css';

export function Footer({ name }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        © {year} {name}. Todos os direitos reservados.
      </p>
      <div className="footer__links">
        <a href="#sobre">Sobre</a>
        <a href="#projetos">Projetos</a>
        <a href="#contato">Contato</a>
      </div>
    </footer>
  );
}
