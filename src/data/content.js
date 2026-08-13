// EDITAR AQUI: troque todo o conteúdo abaixo pelas suas informações reais.

import canecasInicio from '../assets/projects/canecas/canecas-00-inicio.png';
import canecasDashboard from '../assets/projects/canecas/canecas-01-dashboard.png';
import canecasInsumos from '../assets/projects/canecas/canecas-02-insumos.png';
import canecasProdutos from '../assets/projects/canecas/canecas-03-produtos.png';
import canecasPedidos from '../assets/projects/canecas/canecas-04-pedidos.png';
import canecasClientes from '../assets/projects/canecas/canecas-05-clientes.png';
import canecasFornecedores from '../assets/projects/canecas/canecas-06-fornecedores.png';
import canecasSeguranca from '../assets/projects/canecas/canecas-07-seguranca.png';
import canecasRelatorios from '../assets/projects/canecas/canecas-08-relatorios.png';
import canecasHistorico from '../assets/projects/canecas/canecas-09-historico.png';

export const about = {
  name: 'Luccas Madia',
  role: 'Desenvolvedor & Consultor de Gestão',
  tagline: 'Desenvolvimento, Administração e Gestão de Projetos',
  bio: 'Texto de apresentação curto sobre você, sua trajetória e o que você faz. Substitua por um resumo real de 2-3 frases.',
  yearsExperience: 3,
  projectsDelivered: 12,
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
      'Sistema desktop de gestão de estoque para uma loja de canecas personalizadas — controle de insumos, produtos, pedidos, clientes, fornecedores e relatórios.',
    stack: ['Python', 'Tkinter/PyQt'],
    images: [
      canecasInicio,
      canecasDashboard,
      canecasInsumos,
      canecasProdutos,
      canecasPedidos,
      canecasClientes,
      canecasFornecedores,
      canecasSeguranca,
      canecasRelatorios,
      canecasHistorico,
    ],
    codeUrl: 'https://github.com/seu-usuario/canecas-da-dri',
  },
  {
    id: 'proj-2',
    title: 'Projeto Dois',
    description: 'Breve descrição do projeto e o problema que ele resolve.',
    stack: ['Vite', 'Tailwind'],
    liveUrl: 'https://example.com',
    codeUrl: 'https://github.com/seu-usuario/projeto-dois',
  },
  {
    id: 'proj-3',
    title: 'Projeto Três',
    description: 'Breve descrição do projeto e o problema que ele resolve.',
    stack: ['Python', 'Django'],
    liveUrl: 'https://example.com',
    codeUrl: 'https://github.com/seu-usuario/projeto-tres',
  },
];

export const skills = [
  {
    category: 'Desenvolvimento',
    items: [
      { name: 'JavaScript', icon: 'FaJs' },
      { name: 'React', icon: 'FaReact' },
      { name: 'Node.js', icon: 'FaNodeJs' },
    ],
  },
  {
    category: 'Gestão',
    items: [
      { name: 'Gestão de Projetos', icon: 'FaTasks' },
      { name: 'Excel Avançado', icon: 'FaFileExcel' },
    ],
  },
  {
    category: 'Ferramentas',
    items: [
      { name: 'Git', icon: 'FaGitAlt' },
      { name: 'Figma', icon: 'FaFigma' },
    ],
  },
];

export const socials = {
  whatsapp: 'https://wa.me/5500000000000',
  linkedin: 'https://linkedin.com/in/seu-usuario',
  github: 'https://github.com/seu-usuario',
};
