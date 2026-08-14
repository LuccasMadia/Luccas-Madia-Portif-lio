import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { Services } from './components/Services/Services';
import { Projects } from './components/Projects/Projects';
import { Skills } from './components/Skills/Skills';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { CustomCursor } from './components/CustomCursor/CustomCursor';
import CursorGrid from './components/CursorGrid/CursorGrid';
import { about, services, projects, skills, socials } from './data/content';

function App() {
  return (
    <>
      <CursorGrid color="#2dd4bf" />
      <CustomCursor />
      <Header name={about.name} />
      <main>
        <Hero about={about} />
        <Services services={services} />
        <Projects projects={projects} />
        <Skills skills={skills} about={about} />
        <Contact socials={socials} />
      </main>
      <Footer name={about.name} />
    </>
  );
}

export default App;
