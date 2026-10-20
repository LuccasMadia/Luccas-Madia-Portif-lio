import { useCallback, useEffect, useState } from 'react';
import { Header } from '../components/Header/Header';
import { Hero } from '../components/Hero/Hero';
import { Services } from '../components/Services/Services';
import { Projects } from '../components/Projects/Projects';
import { Skills } from '../components/Skills/Skills';
import { Contact } from '../components/Contact/Contact';
import { Footer } from '../components/Footer/Footer';
import { CustomCursor } from '../components/CustomCursor/CustomCursor';
import { WhatsAppButton } from '../components/WhatsAppButton/WhatsAppButton';
import { WelcomeIntro, shouldShowIntro } from '../components/WelcomeIntro/WelcomeIntro';
import { about, services, projects, socials } from '../data/content';

export function Home() {
  // quem chega por um link com #secao vai direto ao conteúdo, sem a abertura
  const [showIntro, setShowIntro] = useState(() => !window.location.hash && shouldShowIntro());
  const [heroReady, setHeroReady] = useState(!showIntro);
  const startHero = useCallback(() => setHeroReady(true), []);
  const finishIntro = useCallback(() => setShowIntro(false), []);

  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <>
      {showIntro && <WelcomeIntro onLeave={startHero} onDone={finishIntro} />}
      <CustomCursor />
      <Header name={about.name} />
      <main>
        <Hero about={about} services={services} ready={heroReady} />
        <Services services={services} />
        <Projects projects={projects} />
        <Skills />
        <Contact socials={socials} />
      </main>
      <Footer name={about.name} />
      <WhatsAppButton href={socials.whatsapp} />
    </>
  );
}
