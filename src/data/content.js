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
  bio: 'Desenvolvo sites e sistemas sob medida, com foco em automatizar processos e simplificar a rotina de pequenas e médias empresas. Uno experiência em desenvolvimento a uma visão de gestão, entregando soluções que funcionam bem e geram resultado real para o negócio.',
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
    caseStudy: [
      {
        titulo: 'Tela inicial',
        imagem: canecasInicio,
        descricao:
          'Painel inicial com acesso rápido a todos os módulos do sistema — dashboard, insumos, produtos, pedidos, clientes, fornecedores, relatórios e histórico.',
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
          'Controle de entradas e saídas de materiais — canecas em branco, tintas, embalagens — com o estoque sempre atualizado automaticamente.',
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
          'Registro e acompanhamento de pedidos por status — pendente, em produção, entregue ou cancelado — com abertura de novo pedido, calendário de entregas e QR code individual para rastrear cada encomenda.',
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
