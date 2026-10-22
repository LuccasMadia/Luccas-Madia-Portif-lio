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
// Suavidade do scrub: quanto maior, mais a animação "chega atrasada" e mais calma fica.
const SCRUB = 1.2;
// Tempos da timeline (em unidades dela, a rolagem é que dá a velocidade real):
// as folhas saem da pasta até RISE, com a abertura parada na tela; depois a página volta a rolar,
// a pilha fica pronta STACK_DONE depois disso e cada cópia sai dela a partir de SPREAD_AT.
const RISE = 2;
const STACK_DONE = 1.3;
const SPREAD_AT = 1.75;
const SPREAD_STAGGER = 0.08;
const SPREAD_DURATION = 1.2;
// Os cartões chegam ao lugar quando o centro da grade passa desta altura da tela.
const LAND_AT = 0.42;

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

// Ao rolar, as folhas saem da pasta da abertura (com a tela parada), descem junto com a página e se
// juntam no meio da seção Serviços, e depois se separam até o cartão de cada uma. São cópias dos
// cartões numa camada por cima da página; os cartões reais ficam guardando o lugar e aparecem no fim.
// Com "reduzir movimento", ou sem layout (testes no jsdom), nada disso roda e os cartões ficam no lugar.
export function ServicesFlight({ services }) {
  const stage = useRef(null);
  const flying = services.slice(0, FAN.length);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const hero = document.getElementById('sobre');
        const box = hero?.querySelector('.services-folder__box');
        const front = box?.querySelector('.services-folder__front');
        const pages = gsap.utils.toArray('.services-folder__page').slice(0, FAN.length);
        const section = document.getElementById('servicos');
        const grid = section?.querySelector('.services__grid');
        const layer = stage.current;
        const clones = gsap.utils.toArray('.services-flight__card', layer);
        const cards = grid ? gsap.utils.toArray('.service-card', grid).slice(0, clones.length) : [];
        const count = clones.length;
        if (!box || !front || !grid?.offsetWidth || pages.length < count || cards.length < count) return undefined;

        // As medidas são feitas com o layout "solto" (sem a pausa da abertura), e a camada das cópias
        // desce junto com a página durante a pausa (hold): assim as coordenadas dela batem com esse layout.
        let folder;
        let hold = 0;
        let startAt = 0;
        let geometry = [];
        const fallTotal = SPREAD_AT + (count - 1) * SPREAD_STAGGER + SPREAD_DURATION;

        // de onde cada folha sai: guardada ou em leque, conforme a pasta estiver ao começar a rolagem
        const placePages = () => {
          const scale = window.matchMedia(NARROW_QUERY).matches ? NARROW_SCALE : 1;
          const open = box.getAttribute('aria-expanded') === 'true';
          geometry.forEach((spot, index) => {
            const fan = open ? FAN[index].open : FAN[index].closed;
            const pageTop = folder.top + pages[index].offsetTop + fan.y;
            // fração da folha que aparece acima da frente da pasta; o resto sai de trás dela ao subir
            const shown = gsap.utils.clamp(0, 1, (folder.frontTop - pageTop) / folder.pageH);
            Object.assign(spot, {
              x: folder.cx + fan.x * scale - spot.card.cx,
              y: pageTop + folder.pageH / 2 - spot.card.cy,
              rotate: fan.rotate,
              hidden: (1 - shown) * 100,
              rise: folder.pageH * (1 - shown) + 12,
              fan: RISE_FAN[index] * scale,
            });
          });
        };

        const measure = () => {
          const where = measureAt(box);
          const top = where.cy - where.h / 2;
          folder = { cx: where.cx, top, frontTop: top + where.h + 1 - front.offsetHeight, pageH: pages[0].offsetHeight };
          startAt = Math.max(0, where.cy - window.innerHeight * 0.6);
          const middle = measureAt(grid);
          const end = measureAt(section);
          layer.style.height = `${end.cy + end.h / 2}px`;

          // a pausa dura a mesma fração da rolagem que a subida ocupa na timeline
          const fallScroll = middle.cy - window.innerHeight * LAND_AT - startAt;
          hold = Math.round((fallScroll * RISE) / fallTotal);
          // a pilha se forma no meio da tela no momento em que fica pronta (sem passar do centro da grade)
          const stackScroll = startAt + (fallScroll + hold) * ((RISE + STACK_DONE) / (RISE + fallTotal));
          const stackY = Math.min(middle.cy, stackScroll - hold + window.innerHeight * 0.5);

          geometry = clones.map((clone, index) => {
            const card = measureAt(cards[index]);
            clone.style.left = `${card.cx - card.w / 2}px`;
            clone.style.top = `${card.cy - card.h / 2}px`;
            clone.style.width = `${card.w}px`;
            return {
              card,
              scale: pages[index].offsetWidth / card.w,
              stackX: middle.cx - card.cx + index * 3,
              stackY: stackY - card.cy - index * 4,
            };
          });
          placePages();
        };

        measure();

        // quem aparece em cada momento sai do progresso da timeline (não de tweens dentro dela),
        // para ficar certo mesmo quando a página abre já rolada depois dos Serviços
        const show = (progress) => {
          const inFlight = progress > 0 && progress < 1;
          clones.forEach((clone) => (clone.style.visibility = inFlight ? 'visible' : 'hidden'));
          pages.forEach((page) => (page.style.visibility = progress > 0 ? 'hidden' : ''));
          cards.forEach((card) => (card.style.visibility = progress < 1 ? 'hidden' : ''));
        };

        // a abertura fica presa na tela enquanto as folhas saem da pasta; a camada das cópias desce
        // junto com a rolagem nesse trecho, para a pasta e as folhas não se desencontrarem
        ScrollTrigger.create({
          trigger: hero,
          // mede aqui: o ScrollTrigger já desfez a pausa e o layout está solto
          start: () => {
            measure();
            return startAt;
          },
          end: () => `+=${hold}`,
          pin: true,
          onUpdate: (self) => (layer.style.transform = `translateY(${self.progress * hold}px)`),
          onRefresh: (self) => (layer.style.transform = `translateY(${self.progress * hold}px)`),
        });

        // uma timeline só para a viagem toda, para a saída e a descida nunca brigarem pelo mesmo cartão
        const rises = [];
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          onUpdate: () => show(tl.progress()),
          scrollTrigger: {
            trigger: hero,
            start: () => startAt,
            endTrigger: grid,
            end: `center ${LAND_AT * 100}%`,
            scrub: SCRUB,
            invalidateOnRefresh: true,
            // a pasta pode estar aberta (hover ou toque) quando a rolagem começa: parte de onde as folhas estão
            onEnter: () => {
              placePages();
              rises.forEach((tween) => tween.invalidate());
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
              duration: RISE,
              ease: 'power1.out',
            },
          );
          rises.push(rise);
          tl.add(rise, 0);
          tl.to(
            clone,
            { x: () => at().stackX, y: () => at().stackY, scale: STACK_SCALE, rotation: STACK_ROT[index], duration: STACK_DONE },
            RISE,
          );
          tl.to(
            clone,
            { x: 0, y: 0, scale: 1, rotation: 0, duration: SPREAD_DURATION, ease: 'power3.inOut' },
            RISE + SPREAD_AT + index * SPREAD_STAGGER,
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
          observer.disconnect();
          grid.removeEventListener('scroll', later);
          refresh.kill();
          [...pages, ...clones, ...cards].forEach((el) => (el.style.visibility = ''));
          layer.style.transform = '';
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
