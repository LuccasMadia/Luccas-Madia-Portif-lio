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

import rangoHero from '../assets/projects/rango-do-bicho/rango-00-hero.png';
import rangoProdutos from '../assets/projects/rango-do-bicho/rango-01-produtos.png';
import rangoHistoria from '../assets/projects/rango-do-bicho/rango-02-historia.png';
import rango03 from '../assets/projects/rango-do-bicho/rango-03.png';
import rango04 from '../assets/projects/rango-do-bicho/rango-04.png';
import rango05 from '../assets/projects/rango-do-bicho/rango-05.png';
import rango06 from '../assets/projects/rango-do-bicho/rango-06.png';
import rango07 from '../assets/projects/rango-do-bicho/rango-07.png';
import rango08 from '../assets/projects/rango-do-bicho/rango-08.png';
import rango09 from '../assets/projects/rango-do-bicho/rango-09.png';
import rango10 from '../assets/projects/rango-do-bicho/rango-10.png';
import rango11 from '../assets/projects/rango-do-bicho/rango-11.png';
import rango12 from '../assets/projects/rango-do-bicho/rango-12.png';

import popyHero from '../assets/projects/popy/popy-00-hero.png';
import popy01 from '../assets/projects/popy/popy-01.png';
import popy02 from '../assets/projects/popy/popy-02.png';
import popy03 from '../assets/projects/popy/popy-03.png';
import popy04 from '../assets/projects/popy/popy-04.png';
import popy05 from '../assets/projects/popy/popy-05.png';

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
    caseStudy: [
      {
        titulo: 'Tela inicial',
        imagem: canecasInicio,
        descricao:
          'Painel inicial com acesso rápido a todos os módulos do sistema: dashboard, insumos, produtos, pedidos, clientes, fornecedores, relatórios e histórico.',
      },
      {
        titulo: 'Dashboard',
        imagem: canecasDashboard,
        descricao:
          'Resumo do dia com alertas de estoque baixo, para a Dri saber exatamente o que precisa repor antes de fechar um pedido.',
      },
      {
        titulo: 'Insumos',
        imagem: canecasInsumos,
        descricao:
          'Controle de entradas e saídas de materiais (canecas em branco, tintas, embalagens), com o estoque sempre atualizado automaticamente.',
      },
      {
        titulo: 'Produtos',
        imagem: canecasProdutos,
        descricao:
          'Cadastro dos produtos finais com suas receitas de produção, mostrando quanto de cada insumo é consumido por unidade.',
      },
      {
        titulo: 'Pedidos',
        imagem: canecasPedidos,
        descricao:
          'Registro e acompanhamento de pedidos por status (pendente, em produção, entregue ou cancelado), com abertura de novo pedido, calendário de entregas e QR code individual para rastrear cada encomenda.',
      },
      {
        titulo: 'Clientes',
        imagem: canecasClientes,
        descricao: 'Cadastro e histórico de clientes, para saber quem comprou o quê e quando.',
      },
      {
        titulo: 'Fornecedores',
        imagem: canecasFornecedores,
        descricao: 'Cadastro dos fornecedores de insumos, centralizando contatos e origem dos materiais.',
      },
      {
        titulo: 'Segurança por módulo',
        imagem: canecasSeguranca,
        descricao:
          'Senha específica em abas sensíveis, restringindo o acesso a informações financeiras e de estoque.',
      },
      {
        titulo: 'Relatórios',
        imagem: canecasRelatorios,
        descricao:
          'Relatórios de pedidos, estoque de insumos e vendas por produto, com filtro por período e exportação em CSV.',
      },
      {
        titulo: 'Histórico',
        imagem: canecasHistorico,
        descricao: 'Registro de todas as ações realizadas no sistema, com opção de reverter erros.',
      },
    ],
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
    images: [
      rangoHero,
      rangoProdutos,
      rangoHistoria,
      rango03,
      rango04,
      rango05,
      rango06,
      rango07,
      rango08,
      rango09,
      rango10,
      rango11,
      rango12,
    ],
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
    images: [popyHero, popy01, popy02, popy03, popy04, popy05],
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
  linkedin: 'https://linkedin.com/in/LuccasMadia',
  github: 'https://github.com/LuccasMadia',
  instagram: 'https://www.instagram.com/madia.consultoria/',
};
