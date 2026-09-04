import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { CustomCursor } from '../components/CustomCursor/CustomCursor';
import { WhatsAppButton } from '../components/WhatsAppButton/WhatsAppButton';
import { ProjectsStack } from '../components/Projects/ProjectsStack';
import { about, projects, socials } from '../data/content';
import '../components/Projects/Projects.css';
import './ProjectsPage.css';

export function ProjectsPage() {
  return (
    <>
      <CustomCursor />
      <Header name={about.name} />
      <main>
        <section className="projects projects-page">
          <a href="/" className="projects-page__back">
            ← Voltar
          </a>
          <div className="projects__heading">
            <div>
              <p className="section-label">Portfólio</p>
              <h1 className="section-title">Todos os projetos</h1>
            </div>
          </div>
          <p className="projects__note">
            Alguns projetos não estão listados aqui por serem sistemas internos de empresas (como controle de
            agendamento de exames, controle de férias, entre outros) que lidam com informações sensíveis e por isso
            não podem ser exibidos publicamente.
          </p>
          <ProjectsStack projects={projects} />
        </section>
      </main>
      <Footer name={about.name} />
      <WhatsAppButton href={socials.whatsapp} />
    </>
  );
}
