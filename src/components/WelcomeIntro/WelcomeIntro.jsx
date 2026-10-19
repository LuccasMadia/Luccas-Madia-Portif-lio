import { useEffect, useState } from 'react';
import './WelcomeIntro.css';

const SEEN_KEY = 'madia.introSeen';
const WRITE_MS = 2800;
const HOLD_MS = 350;
const FADE_MS = 700;
const FONT_WAIT_MS = 1500;

function alreadySeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // sem sessionStorage (navegação privada etc.): a abertura volta na próxima carga
  }
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Tela de abertura: "Bem-vindo" escrito à mão no centro; depois some de vez e libera o site.
// Aparece uma vez por visita (sessionStorage), um clique pula e quem reduz animações não vê.
export function shouldShowIntro() {
  return !alreadySeen() && !prefersReducedMotion();
}

// onLeave: a abertura começou a sumir (o site já pode entrar por baixo); onDone: sumiu de vez.
export function WelcomeIntro({ onLeave, onDone }) {
  const [writing, setWriting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    markSeen();
    document.body.style.overflow = 'hidden';
    // só começa a escrever com a Great Vibes carregada, senão a palavra aparece em outra letra
    let active = true;
    const start = () => active && setWriting(true);
    const fallback = setTimeout(start, FONT_WAIT_MS);
    document.fonts?.load("140px 'Great Vibes'").then(start, start);
    return () => {
      active = false;
      clearTimeout(fallback);
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!writing) return undefined;
    const leaveTimer = setTimeout(() => setLeaving(true), WRITE_MS + HOLD_MS);
    return () => clearTimeout(leaveTimer);
  }, [writing]);

  useEffect(() => {
    if (!leaving) return undefined;
    onLeave?.();
    const doneTimer = setTimeout(onDone, FADE_MS);
    return () => clearTimeout(doneTimer);
  }, [leaving, onLeave, onDone]);

  return (
    <div
      className={`welcome-intro${writing ? ' welcome-intro--writing' : ''}${leaving ? ' welcome-intro--leaving' : ''}`}
      style={{ '--write-ms': `${WRITE_MS}ms`, '--fade-ms': `${FADE_MS}ms` }}
      role="presentation"
      onClick={() => setLeaving(true)}
    >
      <svg className="welcome-intro__word" viewBox="0 0 640 200" role="img" aria-label="Bem-vindo">
        <defs>
          <linearGradient id="welcome-intro-edge" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.96" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id="welcome-intro-sweep">
            <rect className="welcome-intro__sweep" x="0" y="-40" width="680" height="280" fill="url(#welcome-intro-edge)" />
          </mask>
          {/* a "caneta": traço grosso que percorre o desenho das letras e revela o preenchimento */}
          <mask id="welcome-intro-pen">
            <g mask="url(#welcome-intro-sweep)">
              <text className="welcome-intro__pen" x="320" y="140" textAnchor="middle">Bem-vindo</text>
            </g>
          </mask>
        </defs>
        <text className="welcome-intro__ink" x="320" y="140" textAnchor="middle" mask="url(#welcome-intro-pen)">
          Bem-vindo
        </text>
      </svg>
    </div>
  );
}
