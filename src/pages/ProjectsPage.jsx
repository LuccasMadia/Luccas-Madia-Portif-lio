import { useMemo, useState } from 'react';
import { Footer } from '../components/Footer/Footer';
import { CustomCursor } from '../components/CustomCursor/CustomCursor';
import { WhatsAppButton } from '../components/WhatsAppButton/WhatsAppButton';
import { ProjectsFilterBar } from '../components/Projects/ProjectsFilterBar';
import { ProjectsGrid } from '../components/Projects/ProjectsGrid';
import { about, projects, socials } from '../data/content';
import '../components/Projects/Projects.css';
import './ProjectsPage.css';

const CATEGORY_ORDER = ['Landing page', 'Site institucional', 'E-commerce', 'Sistemas'];

export function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeStacks, setActiveStacks] = useState([]);

  const categories = useMemo(() => {
    const present = new Set(projects.map((project) => project.category));
    return CATEGORY_ORDER.filter((category) => present.has(category));
  }, []);
  const stacks = useMemo(() => [...new Set(projects.flatMap((project) => project.stack))], []);

  const toggleCategory = (category) => {
    if (category === null) {
      setActiveCategories([]);
      return;
    }
    setActiveCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  };

  const toggleStack = (tech) => {
    if (tech === null) {
      setActiveStacks([]);
      return;
    }
    setActiveStacks((current) =>
      current.includes(tech) ? current.filter((item) => item !== tech) : [...current, tech]
    );
  };

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesSearch =
        !term || project.title.toLowerCase().includes(term) || project.description.toLowerCase().includes(term);
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(project.category);
      const matchesStack = activeStacks.length === 0 || activeStacks.some((tech) => project.stack.includes(tech));
      return matchesSearch && matchesCategory && matchesStack;
    });
  }, [search, activeCategories, activeStacks]);

  return (
    <>
      <CustomCursor />
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
          <ProjectsFilterBar
            search={search}
            onSearchChange={setSearch}
            categories={categories}
            activeCategories={activeCategories}
            onToggleCategory={toggleCategory}
            stacks={stacks}
            activeStacks={activeStacks}
            onToggleStack={toggleStack}
          />
          <ProjectsGrid projects={filteredProjects} />
        </section>
      </main>
      <Footer name={about.name} />
      <WhatsAppButton href={socials.whatsapp} />
    </>
  );
}
