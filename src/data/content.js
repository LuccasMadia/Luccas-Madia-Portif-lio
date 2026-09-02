// EDITAR AQUI: troque todo o conteúdo abaixo pelas suas informações reais.

import canecasDemo from '../assets/projects/canecas/canecas-demo.webm';

export const about = {
  name: 'Luccas Madia',
  role: 'Desenvolvedor & Consultor de Gestão',
  tagline: 'Desenvolvimento, Administração e Gestão de Projetos',
  bio: 'Desenvolvo sites e sistemas sob medida, com foco em automatizar processos e simplificar a rotina de pequenas e médias empresas. Uno experiência em desenvolvimento a uma visão de gestão, entregando soluções que funcionam bem e geram resultado real para o negócio.',
  projectsDelivered:6,
};

export const services = [
  {
    id: 'web-dev',
    title: 'Desenvolvimento Web',
    description: 'Criação de sites e aplicações web modernas, responsivas e performáticas.',
    icon: 'FaCode',
  },
  {
    id: 'consulting',
    title: 'Consultoria em Gestão',
    description: 'Análise e otimização de processos administrativos e de negócio.',
    icon: 'FaChartLine',
  },
  {
    id: 'automation',
    title: 'Automação de Processos',
    description: 'Automatização de tarefas repetitivas para ganho de eficiência.',
    icon: 'FaRobot',
  },
  {
    id: 'support',
    title: 'Suporte Administrativo',
    description: 'Apoio na organização e gestão administrativa de projetos e equipes.',
    icon: 'FaClipboardList',
  },
];

export const projects = [
  {
    id: 'proj-1',
    title: 'Canecas da Dri',
    description:
      'Sistema desktop de gestão de estoque para uma loja de canecas personalizadas, com controle de insumos, produtos, pedidos, clientes, fornecedores e relatórios.',
    stack: ['Python', 'Tkinter/PyQt'],
    status: 'Em funcionamento',
    video: canecasDemo,
    codeUrl: 'https://github.com/seu-usuario/canecas-da-dri',
  },
  {
    id: 'proj-2',
    title: 'Rango do Bicho',
    description:
      'Site institucional e catálogo de produtos para uma casa de ração de bairro, com vitrine de produtos filtrável por categoria, carrinho e pedido direto via WhatsApp.',
    stack: ['Next.js', 'Banco de Dados'],
    status: 'Em desenvolvimento',
    liveUrl: 'https://rango-do-bicho-site.vercel.app/',
    codeUrl: 'https://github.com/LuccasMadia/Rango-do-bicho-site.git',
  },
  {
    id: 'proj-3',
    title: 'Popy',
    description:
      'Landing page para uma marca de sucos naturais captar parceiros comerciais, com apresentação dos sabores, diferenciais da marca e formulário de contato, usando imagens de produto geradas por IA.',
    stack: ['Next.js', 'Geração de imagens com IA'],
    status: 'Em desenvolvimento',
    liveUrl: 'https://popy-ladinpage.vercel.app/',
    codeUrl: 'https://github.com/LuccasMadia/Popy-Ladinpage.git',
  },
];

export const skills = [
  {
    category: 'Gestão',
    items: [
      { name: 'Gestão de Projetos', icon: 'FaTasks' },
      { name: 'Excel Avançado', icon: 'FaFileExcel' },
      { name: 'Power BI', icon: 'FaChartBar' },
    ],
  },
  {
    category: 'Ferramentas',
    items: [
      { name: 'Git', icon: 'FaGitAlt' },
      { name: 'Figma', icon: 'FaFigma' },
      { name: 'Notion', icon: 'SiNotion' },
    ],
  },
];

export const socials = {
  whatsapp: 'https://wa.me/5567998746300',
  linkedin: 'https://www.linkedin.com/in/luccas-madia-b0229739b',
  github: 'https://github.com/LuccasMadia',
  instagram: 'https://www.instagram.com/madia.consultoria/',
};
