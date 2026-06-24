/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LandingPage } from "../types";

export const TEMPLATE_PRESETS: Record<string, LandingPage> = {
  apple_layon: {
    id: "preset_layon_devs",
    name: "Layon Devs",
    userId: "anonymous",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompt: "Crie uma landing page estilo Apple com história de canvas procedural e bento grid de tecnologia.",
    metadata: {
      title: "Layon Devs | Inteligências que escalam o futuro",
      description: "Construindo inteligências que escalam o futuro. IA, automação e sistemas escaláveis.",
      primaryFont: "Inter",
      vibe: "tech",
      palette: {
        background: "#000000",
        text: "#ffffff",
        accent: "#0071E3",
        secondary: "#1D1D1F"
      }
    },
    sections: [
      {
        id: "hero",
        type: "hero",
        badge: "LAYON DEVS",
        title: "Construindo inteligências que escalam o futuro",
        subtitle: "Scroll para descobrir",
        description: "IA, automação e sistemas elásticos ultra-escaláveis que redefinem indústrias.",
        alignment: "center",
        mediaType: "canvas_particles",
        buttons: [
          { text: "Começar Agora", variant: "primary", actionType: "scroll_to_cta" },
          { text: "Conhecer Mais", variant: "outline", actionType: "link", actionValue: "#vision" }
        ]
      },
      {
        id: "vision",
        type: "vision",
        badge: "VISÃO",
        title: "Não criamos sistemas. Criamos cérebros digitais.",
        subtitle: "A forma definitiva de cognição empresarial",
        description: "Em um mundo onde a velocidade define o vencedor, construímos inteligências artificiais que pensam, aprendem e evoluem com o seu negócio — transformando complexidade em vantagem competitiva absoluta.",
        alignment: "center",
        mediaType: "neural_brain"
      },
      {
        id: "tech_spec",
        type: "technology",
        badge: "TECNOLOGIA",
        title: "O que nos move.",
        description: "Soluções modulares projetadas para desempenho milimétrico e estabilidade resiliente.",
        alignment: "left",
        mediaType: "geometric_matrix",
        items: [
          { id: "it_1", title: "Inteligência Artificial", description: "Modelos treinados sob medida para o DNA do seu negócio. LLMs, visão computacional, NLP — tudo integrado.", icon: "Check" },
          { id: "it_2", title: "Automação Inteligente", description: "Fluxos que eliminam o trabalho repetitivo e liberam sua equipe para o que realmente importa: criar valor.", icon: "Zap" },
          { id: "it_3", title: "Sistemas Escaláveis", description: "Arquiteturas cloud-native projetadas para crescer junto com você: do MVP ao bilhão de requisições.", icon: "Server" }
        ]
      },
      {
        id: "power_flow",
        type: "power",
        badge: "FOCO",
        title: "Automatize. Escale. Domine.",
        description: "Cada processo otimizado é uma vantagem competitiva conquistada.",
        alignment: "center",
        items: [
          { id: "p1", title: "Automatize", description: "Deixe os agentes cuidarem do micro." },
          { id: "p2", title: "Escale", description: "Crie milhares de fluxos independentes sem overhead." },
          { id: "p3", title: "Domine", description: "Posicione-se à frente de toda e qualquer competição." }
        ]
      },
      {
        id: "saas_interactive",
        type: "product",
        badge: "PLATAFORMA",
        title: "O ecossistema que move empresas.",
        subtitle: "Cockpit SaaS Interativo",
        description: "Monitore agentes, analise relatórios gerenciais e controle workflows em tempo real através de um painel integrado de próxima geração.",
        alignment: "center",
        mediaType: "mockup_saas"
      },
      {
        id: "numbers_grid",
        type: "numbers",
        badge: "MÉTRICAS",
        title: "Nosso impacto em números reais.",
        description: "Desempenho elástico, retorno sobre investimento e projetos maduros ao redor do globo.",
        alignment: "center",
        items: [
          { id: "num_1", title: "Projetos entregues", price: "500+" },
          { id: "num_2", title: "Requisições processadas", price: "40M+" },
          { id: "num_3", title: "Uptime garantido", price: "99.9%" },
          { id: "num_4", title: "ROI médio", price: "12×" }
        ]
      },
      {
        id: "pricing_studio",
        type: "pricing",
        badge: "LICENCIAMENTO",
        title: "Escolha o tamanho do seu cérebro artificial.",
        description: "Cancele ou mude de plano instantaneamente sem burocracias contratuais.",
        alignment: "center",
        items: [
          { id: "pr_1", title: "Aceleradora", description: "Para empresas construindo suas primeiras automações e landing pages inteligentes.", price: "$149", badge: "RECOMENDADO", features: ["Até 5 Canvas ativos", "Geração assistida", "Suporte no Discord", "SSL Grátis"] },
          { id: "pr_2", title: "Enterprise", description: "Para marcas globais que demandam CDN customizada e agentes cognitivos de alta escala.", price: "Custom", features: ["Canvas Ilimitados", "Suporte VIP dedicado", "Consultoria exclusiva Layon Devs", "Painéis Whitelabel"] }
        ]
      },
      {
        id: "cta_studio",
        type: "cta",
        badge: "PRÓXIMO PASSO",
        title: "O futuro não espera.",
        subtitle: "Resposta em menos de 24h",
        description: "Enquanto você lê isso, seus concorrentes estão automatizando. Entre em contato e comece a transformação hoje.",
        alignment: "center",
        buttons: [
          { text: "Começar Agora", variant: "primary", actionType: "contact_modal" }
        ]
      }
    ]
  },
  cyber_neon: {
    id: "preset_cyber",
    name: "Cyber Brain",
    userId: "anonymous",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompt: "Plataforma cyberpunk com contraste neon roxo, foco em agentes autônomos e dark theme militar.",
    metadata: {
      title: "Cyber Brain Corp",
      description: "Operações Cognitivas Criptografadas",
      primaryFont: "Outfit",
      vibe: "brutalist",
      palette: {
        background: "#02010a",
        text: "#f1f1ff",
        accent: "#d946ef",
        secondary: "#120224"
      }
    },
    sections: [
      {
        id: "hero",
        type: "hero",
        badge: "SECURITY PROTOCOL V.09",
        title: "Célula Cognitiva Síncrona",
        subtitle: "Agentes operacionais no submundo dos dados",
        description: "Executores elásticos rodando comandos assíncronos e criptografia militar de alta velocidade.",
        alignment: "left",
        mediaType: "canvas_particles",
        buttons: [
          { text: "Descriptografar Acesso", variant: "primary", actionType: "link" }
        ]
      },
      {
        id: "neural",
        type: "vision",
        badge: "COGNITIVE OVERLAY",
        title: "O Software é Primitivo.",
        subtitle: "A Consciência de Máquina Inteligente é o Norte.",
        description: "Agrupamos neurônios digitais efêmeros para calcular riscos de mercado antes de seus concorrentes imaginarem.",
        alignment: "center",
        mediaType: "neural_brain"
      },
      {
        id: "spec",
        type: "technology",
        badge: "MATRIX ENGINE",
        title: "Bento de Capacidades Operativas",
        alignment: "left",
        mediaType: "geometric_matrix",
        items: [
          { id: "it_1", title: "Invasão Silenciosa de SEO", description: "Indexamos seu site no topo com táticas orgânicas e redação de alto padrão.", icon: "Globe" },
          { id: "it_2", title: "Carga Crítica de API", description: "Milissegundos significam milhões de dólares. Otimizado a nível de assembly.", icon: "Cpu" }
        ]
      },
      {
        id: "cta",
        type: "cta",
        badge: "JOIN REVOLUTION",
        title: "Controle as engrenagens inteligentes.",
        alignment: "center",
        buttons: [
          { text: "Iniciar Conexão", variant: "primary", actionType: "contact_modal" }
        ]
      }
    ]
  },
  warm_studio: {
    id: "preset_warm",
    name: "Warm Craft House",
    userId: "anonymous",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prompt: "Estilo estúdio editorial aconchegante, tons de terracota, minimalismo suave e tipografia clássica.",
    metadata: {
      title: "Craft & Logic Studio",
      description: "Trabalho manual integrado com precisão algorítmica",
      primaryFont: "Playfair Display",
      vibe: "warm",
      palette: {
        background: "#faf6f0",
        text: "#1c1917",
        accent: "#c2410c",
        secondary: "#eddcd2"
      }
    },
    sections: [
      {
        id: "hero",
        type: "hero",
        badge: "DESIGNED WORKPLACE",
        title: "A Alma do Algoritmo",
        subtitle: "Estética calorosa, engenharia precisa",
        description: "Criamos identidades que contam histórias. Acreditamos que a inteligência artificial não deve ser fria ou distante, mas sim uma aliada calorosa da criatividade humana.",
        alignment: "center",
        mediaType: "avatar_grid",
        buttons: [
          { text: "Conhecer nossa história", variant: "primary", actionType: "link" }
        ]
      },
      {
        id: "curators",
        type: "vision",
        badge: "EDITORIAL STATEMENT",
        title: "Belo. Simples. Eterno.",
        subtitle: "Por menos ruído visual e mais conexão real.",
        description: "Cada parágrafo do seu site é planejado por nosso estúdio com refinamento tipográfico digno de livros de design.",
        alignment: "center",
        mediaType: "none"
      },
      {
        id: "skills",
        type: "technology",
        badge: "SKILLS",
        title: "Nossa Caixa de Ferramentas",
        alignment: "left",
        items: [
          { id: "sk_1", title: "Branding Cognitivo", description: "Definição de tons de voz, slogans e logotipos refinados em tempo recorde.", icon: "Sparkles" },
          { id: "sk_2", title: "SEO Editorial", description: "Artigos profundos que educam e convertem leitores em defensores da marca.", icon: "Layers" }
        ]
      }
    ]
  }
};
