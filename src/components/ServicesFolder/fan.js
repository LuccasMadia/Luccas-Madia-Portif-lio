// Posição de cada folha: guardada na pasta e aberta em leque. O celular usa um leque mais fechado.
// Fica fora do componente porque a animação de rolagem (ServicesFlight) parte dessas mesmas posições.
export const FAN = [
  { closed: { x: -54, y: 4, rotate: -4 }, open: { x: -196, y: -62, rotate: -8 } },
  { closed: { x: -18, y: 0, rotate: -1 }, open: { x: -66, y: -104, rotate: -2 } },
  { closed: { x: 18, y: 1, rotate: 1.5 }, open: { x: 66, y: -104, rotate: 2 } },
  { closed: { x: 54, y: 3, rotate: 4 }, open: { x: 196, y: -62, rotate: 8 } },
];
export const NARROW_QUERY = '(max-width: 520px)';
export const NARROW_SCALE = 0.62;
