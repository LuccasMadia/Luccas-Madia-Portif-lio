import { useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FAN, NARROW_QUERY, NARROW_SCALE } from '../ServicesFolder/fan';
import { ServiceCard } from '../Services/Services';
import './ServicesFlight.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Abertura em leque ao sair pela boca da pasta e o giro de cada folha na pilha do meio.
const RISE_FAN = [-70, -24, 24, 70];
const STACK_ROT = [-7, 4, -3, 6];
const STACK_SCALE = 0.85;
// Momentos da timeline: a pilha fica pronta em STACK_DONE e cada cópia sai dela a partir de SPREAD_AT.
const STACK_DONE = 1.85;
const SPREAD_AT = 2.2;
const SPREAD_STAGGER = 0.06;
const SPREAD_DURATION = 1.1;

// Centro e tamanho do elemento na página, descontando o deslocamento das entradas do framer-motion
// (translate nos ancestrais) e o zoom do hover no próprio cartão, para medir sempre o lugar de repouso.
function measureAt(el) {
  const rect = el.getBoundingClientRect();
  let dx = 0;
  let dy = 0;
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    const transform = getComputedStyle(node).transform;
    if (transform && transform !== 'none') {
      const matrix = new DOMMatrixReadOnly(transform);
      dx += matrix.m41;
      dy += matrix.m42;
    }
  }
  return {
    cx: rect.left + rect.width / 2 + window.scrollX - dx,
    cy: rect.top + rect.height / 2 + window.scrollY - dy,
    w: el.offsetWidth,
    h: el.offsetHeight,
  };
}

// Ao rolar, as folhas saem da pasta da abertura, descem e se juntam no meio da seção Serviços,
// e depois se separam até o cartão de cada uma. São cópias dos cartões numa camada por cima da
// página; os cartões reais ficam guardando o lugar (sem pulo de layout) e aparecem no fim.
// Com "reduzir movimento", ou sem layout (testes no jsdom), nada disso roda e os cartões ficam no lugar.
export function ServicesFlight({ services }) {
  const stage = useRef(null);
  const flying = services.slice(0, FAN.length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const box = document.querySelector('.services-folder__box');
        const front = box?.querySelector('.services-folder__front');
        const pages = gsap.utils.toArray('.services-folder__page');
        const section = document.getElementById('servicos');
        const grid = section?.querySelector('.services__grid');
        const cards = grid ? gsap.utils.toArray('.service-card', grid) : [];
        const clones = gsap.utils.toArray('.services-flight__card', stage.current);
        const count = clones.length;
        if (!box || !front || !grid?.offsetWidth || pages.length < count || cards.length < count) return undefined;

        let geometry = [];
        let startAt = 0;
        const measure = () => {
          const scale = window.matchMedia(NARROW_QUERY).matches ? NARROW_SCALE : 1;
          const open = box.getAttribute('aria-expanded') === 'true';
          const folder = measureAt(box);
          const boxTop = folder.cy - folder.h / 2;
          const frontTop = boxTop + folder.h + 1 - front.offsetHeight;
          const middle = measureAt(grid);
          const end = measureAt(section);
          stage.current.style.height = `${end.cy + end.h / 2}px`;
          startAt = Math.max(0, folder.cy - window.innerHeight * 0.6);
          // a pilha se forma no meio da tela no momento em que fica pronta (sem passar do centro da grade)
          const endAt = middle.cy - window.innerHeight * 0.55;
          const total = SPREAD_AT + (count - 1) * SPREAD_STAGGER + SPREAD_DURATION;
          const stackScroll = startAt + (endAt - startAt) * (STACK_DONE / total);
          const stackY = Math.min(middle.cy, stackScroll + window.innerHeight * 0.5);

          geometry = clones.map((clone, index) => {
            const page = pages[index];
            const spot = open ? FAN[index].open : FAN[index].closed;
            const card = measureAt(cards[index]);
            const pageTop = boxTop + page.offsetTop + spot.y;
            // fração da folha que aparece acima da frente da pasta; o resto sai de trás dela ao subir
            const shown = gsap.utils.clamp(0, 1, (frontTop - pageTop) / page.offsetHeight);
            clone.style.left = `${card.cx - card.w / 2}px`;
            clone.style.top = `${card.cy - card.h / 2}px`;
            clone.style.width = `${card.w}px`;
            return {
              x: folder.cx + spot.x * scale - card.cx,
              y: pageTop + page.offsetHeight / 2 - card.cy,
              rotate: spot.rotate,
              scale: page.offsetWidth / card.w,
              hidden: (1 - shown) * 100,
              rise: page.offsetHeight * (1 - shown) + 12,
              fan: RISE_FAN[index] * scale,
              stackX: middle.cx - card.cx + index * 3,
              stackY: stackY - card.cy - index * 4,
            };
          });
        };
        measure();
        ScrollTrigger.addEventListener('refreshInit', measure);

        // quem aparece em cada momento sai do progresso da timeline (não de tweens dentro dela),
        // para ficar certo mesmo quando a página abre já rolada depois dos Serviços
        const swapped = [...pages.slice(0, count), ...clones, ...cards.slice(0, count)];
        const show = (progress) => {
          const inFlight = progress > 0 && progress < 1;
          clones.forEach((clone) => (clone.style.visibility = inFlight ? 'visible' : 'hidden'));
          pages.slice(0, count).forEach((page) => (page.style.visibility = progress > 0 ? 'hidden' : ''));
          cards.slice(0, count).forEach((card) => (card.style.visibility = progress < 1 ? 'hidden' : ''));
        };

        const motions = [];
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          onUpdate: () => show(tl.progress()),
          scrollTrigger: {
            trigger: box,
            start: () => startAt,
            endTrigger: grid,
            end: 'center 55%',
            scrub: 0.6,
            invalidateOnRefresh: true,
            // a pasta pode estar aberta (hover ou toque) quando a rolagem começa: parte de onde as folhas estão
            onEnter: () => {
              measure();
              motions.forEach((tween) => tween.invalidate());
            },
          },
        });

        clones.forEach((clone, index) => {
          const at = () => geometry[index];
          const rise = gsap.fromTo(
            clone,
            {
              x: () => at().x,
              y: () => at().y,
              scale: () => at().scale,
              rotation: () => at().rotate,
              clipPath: () => `inset(0% 0% ${at().hidden}% 0%)`,
            },
            {
              x: () => at().x + at().fan,
              y: () => at().y - at().rise,
              rotation: () => at().rotate * 2.5,
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.5,
              ease: 'power1.out',
            },
          );
          tl.add(rise, 0);
          motions.push(rise);
          tl.to(
            clone,
            { x: () => at().stackX, y: () => at().stackY, scale: STACK_SCALE, rotation: STACK_ROT[index], duration: STACK_DONE - 0.55 },
            0.55,
          );
          tl.to(
            clone,
            { x: 0, y: 0, scale: 1, rotation: 0, duration: SPREAD_DURATION, ease: 'power3.inOut' },
            SPREAD_AT + index * SPREAD_STAGGER,
          );
        });

        show(tl.progress());

        // remede quando o layout muda sem "resize" (fontes, fim da abertura, carrossel do celular rolado)
        const refresh = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();
        const later = () => refresh.restart(true);
        const observer = new ResizeObserver(later);
        observer.observe(document.body);
        grid.addEventListener('scroll', later, { passive: true });
        document.fonts?.ready.then(later);

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure);
          observer.disconnect();
          grid.removeEventListener('scroll', later);
          refresh.kill();
          swapped.forEach((el) => (el.style.visibility = ''));
        };
      });
    },
    { dependencies: [services] },
  );

  return createPortal(
    <div className="services-flight" ref={stage} aria-hidden="true" inert>
      {flying.map((service) => (
        <div key={service.id} className="services-flight__card">
          <ServiceCard service={service} loading="eager" />
        </div>
      ))}
    </div>,
    document.body,
  );
}
