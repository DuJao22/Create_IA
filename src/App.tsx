import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Paintbrush, 
  Sliders, 
  Layers, 
  Eye, 
  Code as CodeIcon,
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Copy, 
  Download, 
  ExternalLink,
  Check, 
  Play,
  RotateCw,
  Terminal,
  Video,
  ListFilter,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Info,
  Maximize2,
  Minimize2,
  Send,
  Activity,
  Settings,
  Database,
  Key,
  GripVertical
} from "lucide-react";

import PreviewFrame from "./components/PreviewFrame";
import { LandingPage as TLandingPage, Section as TSection, SectionItem as TSectionItem } from "./types";
import { TEMPLATE_PRESETS } from "./components/Presets";
import { generateReactTailwindCode } from "./utils/codeGenerator";

// Types and definition definitions inline for strict type-checking
interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

interface StatItem {
  id: string;
  val: string;
  label: string;
}

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
}

interface SectionItem {
  id: string;
  label: string;
  icon: string;
  on: boolean;
}

interface StylePreset {
  id: string;
  name: string;
  desc: string;
  bg: string;
  fg: string;
  ac: string;
  sec: string;
  gradient: string;
}

const PRESET_STYLES: StylePreset[] = [
  { 
    id: "cinema", 
    name: "Cinema", 
    desc: "Apple-dark ultra-premium", 
    bg: "#000000", 
    fg: "#ffffff", 
    ac: "#0071E3", 
    sec: "#111118", 
    gradient: "linear-gradient(135deg, #000 0%, #111 50%, #003a7d 100%)" 
  },
  { 
    id: "neon", 
    name: "Neon Cyber", 
    desc: "Futurista com acentos vibrantes", 
    bg: "#050510", 
    fg: "#e0e0ff", 
    ac: "#7c5cfc", 
    sec: "#111122", 
    gradient: "linear-gradient(135deg, #050510 0%, #1a0530 100%)" 
  },
  { 
    id: "light", 
    name: "Clean Light", 
    desc: "Branco minimalista e limpo", 
    bg: "#ffffff", 
    fg: "#111111", 
    ac: "#0071E3", 
    sec: "#f5f5f7", 
    gradient: "linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%)" 
  },
  { 
    id: "aurora", 
    name: "Aurora", 
    desc: "Efeito místico com gradientes", 
    bg: "#030814", 
    fg: "#e8f0ff", 
    ac: "#00d4aa", 
    sec: "#0d1527", 
    gradient: "linear-gradient(135deg, #030814 0%, #0d2040 50%, #00463a 100%)" 
  },
  { 
    id: "sand", 
    name: "Editorial", 
    desc: "Serif premium em tom creme", 
    bg: "#f7f4ef", 
    fg: "#1a1a1a", 
    ac: "#c05c2b", 
    sec: "#ede8e0", 
    gradient: "linear-gradient(135deg, #f7f4ef 0%, #ede8e0 100%)" 
  },
  { 
    id: "matrix", 
    name: "Matrix", 
    desc: "Verde terminal clássico", 
    bg: "#000a00", 
    fg: "#00ff41", 
    ac: "#00ff41", 
    sec: "#001500", 
    gradient: "linear-gradient(135deg, #000a00 0%, #001500 100%)" 
  }
];

const SCROLL_MODES = [
  { id: "scrub", icon: "🎬", name: "Scrub", desc: "Vídeo avança/recua com o scroll" },
  { id: "parallax", icon: "🌊", name: "Parallax", desc: "Vídeo flutua com profundidade" },
  { id: "pin", icon: "📌", name: "Pinado", desc: "Hero fica fixo até rolar a seção" },
  { id: "ambient", icon: "🌌", name: "Ambiente", desc: "Vídeo toca livremente em loop" },
  { id: "reveal", icon: "✨", name: "Reveal", desc: "Máscara circular revela com scroll" },
  { id: "zoom", icon: "🔭", name: "Zoom", desc: "Zoom proporcional sincronizado ao scroll" }
];

export default function App() {
  // Tabs: content | design | video | sections
  const [activeTab, setActiveTab] = useState<"content" | "design" | "video" | "sections">("content");
  
  // Responsive Device View state
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Core Content State
  const [brandName, setBrandName] = useState("Layon Devs");
  const [headline, setHeadline] = useState("Construindo inteligências que escalam o futuro");
  const [subheadline, setSubheadline] = useState("IA, automação e sistemas robustos baseados em agentes que habilitam o domínio operacional do amanhã.");
  const [about, setAbout] = useState("Somos uma consultoria inovadora dedicada ao desenvolvimento de ecossistemas robóticos e mentes digitais sob demanda. Implementamos algoritmos elásticos que aprendem e escalam 24/7.");
  const [ctaText, setCtaText] = useState("Começar agora");
  const [ctaLink, setCtaLink] = useState("#contato");
  const [aiContext, setAiContext] = useState("Tom: cinematográfico, premium, técnico de alta convicção. Público: CTOs, Founders e líderes de engenharia. Setor: SaaS / IA / automação avançada.");

  // Lists Section
  const [features, setFeatures] = useState<FeatureItem[]>([
    { id: "f1", icon: "🧠", title: "IA Sob Medida", desc: "Modelos personalizados integrados especificamente ao core do seu negócio." },
    { id: "f2", icon: "⚡", title: "Automação Total", desc: "workflows e pipelines operacionais que trabalham sozinhos sem overhead." },
    { id: "f3", icon: "📈", title: "Escala Infinita", desc: "Arquiteturas robustas projetadas para aguentar bilhões de requests com facilidade." },
    { id: "f4", icon: "🔐", title: "Segura & Privada", desc: "Criptografia avançada protegendo dados e ativos digitais em tempo real." }
  ]);

  const [stats, setStats] = useState<StatItem[]>([
    { id: "s1", val: "500+", label: "Projetos entregues" },
    { id: "s2", val: "40M+", label: "Requisições processadas" },
    { id: "s3", val: "99.9%", label: "Uptime garantido" },
    { id: "s4", val: "12×", label: "Retorno (ROI) médio" }
  ]);

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([
    { id: "t1", quote: "A equipe da Layon Devs redesenhou nossa esteira inteligente. Reduzimos custos operacionais em 60% e automatizamos relatórios em segundos.", author: "Ana Silva", role: "CEO, TechStart" }
  ]);

  const [sections, setSections] = useState<SectionItem[]>([
    { id: "hero", label: "Hero (Vídeo/Canvas)", icon: "🎬", on: true },
    { id: "vision", label: "Visão / Storytelling", icon: "👁", on: true },
    { id: "features", label: "Nossos Diferenciais", icon: "✨", on: true },
    { id: "stats", label: "Métricas / Números", icon: "📊", on: true },
    { id: "tech", label: "Tecnologia & Sistemas", icon: "⚙️", on: true },
    { id: "power", label: "Palavras de Poder", icon: "⚡", on: true },
    { id: "products", label: "Módulo SaaS interativo", icon: "📦", on: false },
    { id: "testimonials", label: "Depoimentos", icon: "💬", on: true },
    { id: "cta", label: "Hero CTA Final", icon: "🎯", on: true },
    { id: "footer", label: "Rodapé (Footer)", icon: "⬇️", on: true }
  ]);

  // Design Customization State
  const [selectedStyle, setSelectedStyle] = useState<string>("cinema");
  const [bgColor, setBgColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [accentColor, setAccentColor] = useState("#0071E3");
  const [fontDisplay, setFontDisplay] = useState("Inter");
  const [fontBody, setFontBody] = useState("'Manrope'");
  const [borderRadius, setBorderRadius] = useState<number>(14);
  const [blurIntensity, setBlurIntensity] = useState<number>(20);
  const [density, setDensity] = useState<"spacious" | "balanced" | "dense">("balanced");

  // Video State
  const [videoSrc, setVideoSrc] = useState<string | null>("https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41481-large.mp4");
  const [videoType, setVideoType] = useState<"file" | "url">("url");
  const [videoUrlInput, setVideoUrlInput] = useState("https://pin.it/L5hQnXmm9");
  const [videoFileName, setVideoFileName] = useState("Pinterest (Clique em Aplicar)");
  const [scrollMode, setScrollMode] = useState("scrub");
  const [videoOpacity, setVideoOpacity] = useState<number>(70);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(40);
  const [videoFilter, setVideoFilter] = useState("none");
  const [heroHeight, setHeroHeight] = useState("100vh");
  const [videoMultiSection, setVideoMultiSection] = useState(true);

  // Sections Animations State
  const [animStyle, setAnimStyle] = useState("fade-up");
  const [animSpeed, setAnimSpeed] = useState<number>(0.8);
  const [scrubType, setScrubType] = useState("parallax");

  // Diagnostic HUD States for real-time video sync tracking
  const [isDiagnosticHudOpen, setIsDiagnosticHudOpen] = useState(true);
  const [diagnosticScrollY, setDiagnosticScrollY] = useState(0);
  const [diagnosticMaxScroll, setDiagnosticMaxScroll] = useState(1);
  const [diagnosticVideoTime, setDiagnosticVideoTime] = useState(0);
  const [diagnosticVideoDuration, setDiagnosticVideoDuration] = useState(0);
  const [diagnosticVideoPaused, setDiagnosticVideoPaused] = useState(true);
  const [diagnosticVideoStatus, setDiagnosticVideoStatus] = useState("Procurando vídeo");
  const [pastedIdeaInput, setPastedIdeaInput] = useState("");
  const [isSuggestingContent, setIsSuggestingContent] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  // Dictionary for section titles, subtitles, badges, descriptions, alignments and media
  const [sectionHeadings, setSectionHeadings] = useState<Record<string, { title: string; subtitle?: string; badge?: string; description?: string; alignment?: "left" | "center" | "right"; mediaType?: "canvas_particles" | "neural_brain" | "geometric_matrix" | "mockup_saas" | "avatar_grid" | "none" }>>({
    hero: { title: "Construindo inteligências que escalam o futuro", subtitle: "Scroll para descobrir", badge: "PORTAL COGNITIVO", description: "IA, automação e sistemas elásticos ultra-escaláveis que redefinem indústrias.", alignment: "center", mediaType: "canvas_particles" },
    vision: { title: "Não criamos sistemas. Criamos cérebros digitais.", subtitle: "Cultura de Performance", badge: "MANIFESTO OPERACIONAL", description: "Buscamos o refinamento absoluto focado na experiência cinematográfica.", alignment: "center", mediaType: "neural_brain" },
    features: { title: "Nossos Diferenciais", subtitle: "DIFERENCIAIS DA OPERAÇÃO", badge: "DIFERENCIAIS", description: "Soluções projetadas para desempenho milimétrico.", alignment: "center", mediaType: "none" },
    stats: { title: "Métricas / Números", subtitle: "RESULTADOS CONSOLIDADOS", badge: "MÉTRICAS", description: "Retorno real sobre o investimento em infraestrutura.", alignment: "center", mediaType: "none" },
    tech: { title: "Tecnologia & Sistemas", subtitle: "NOSSA CAIXA DE FERRAMENTAS", badge: "TECNOLOGIA", description: "Tecnologias de ponta focadas em resiliência de alto nível.", alignment: "left", mediaType: "geometric_matrix" },
    power: { title: "Palavras de Poder", subtitle: "DIRETRIZES DE VALOR", badge: "FOCO", description: "Valores fundamentais guiando cada deploy.", alignment: "center", mediaType: "none" },
    products: { title: "Módulo SaaS interativo", subtitle: "Cockpit SaaS Interativo", badge: "PLATAFORMA", description: "Monitore agentes, analise relatórios e controle fluxos em tempo real.", alignment: "center", mediaType: "mockup_saas" },
    testimonials: { title: "Depoimentos", subtitle: "FEEDBACK DOS PARCEIROS", badge: "TESTEMUNHOS", description: "O que dizem sobre nosso comprometimento operacional.", alignment: "center", mediaType: "none" },
    cta: { title: "O futuro não espera.", subtitle: "Resposta em menos de 24h", badge: "PRÓXIMO PASSO", description: "Enquanto você lê isso, seus concorrentes estão se automatizando.", alignment: "center", mediaType: "none" },
    footer: { title: "Rodapé (Footer)", badge: "FOOTER", alignment: "center", mediaType: "none" }
  });

  // Output State
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"react" | "html">("react");
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Pronto para gerar sua landing page.");
  const [statusType, setStatusType] = useState<"ok" | "loading" | "error" | "idle">("ok");
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [logsList, setLogsList] = useState<string[]>([]);
  const [historyProjects, setHistoryProjects] = useState<Array<{ name: string; html: string; date: string }>>([]);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);

  // Drag and Drop Editor State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [selectedEditorSectionId, setSelectedEditorSectionId] = useState<string | null>("hero");

  // ════════ CONFIGURAÇÕES DE API E SEGUROS SQLite Cloud ════════
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [sqliteConnectionString, setSqliteConnectionString] = useState("");
  const [sqliteHost, setSqliteHost] = useState("");
  const [sqliteApiKey, setSqliteApiKey] = useState("");
  const [sqliteDbName, setSqliteDbName] = useState("");
  const [sqliteEnabled, setSqliteEnabled] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [dbTestMessage, setDbTestMessage] = useState<{ text: string, type: "success" | "error" | "" }>({ text: "", type: "" });
  const [isTestingDb, setIsTestingDb] = useState(false);

  const parseAndApplyConnectionString = (connStr: string) => {
    try {
      const trimmed = connStr.trim();
      if (!trimmed) return;

      let urlString = trimmed;
      if (!urlString.includes("://")) {
        urlString = "sqlitecloud://" + urlString;
      }

      const url = new URL(urlString);
      const host = url.host;
      const dbname = url.pathname.replace(/^\//, '') || "landing_pages.db";
      const apikey = url.searchParams.get("apikey") || "";

      setSqliteHost(host);
      setSqliteDbName(dbname);
      setSqliteApiKey(apikey);

      localStorage.setItem("layon_sqlite_host", host);
      localStorage.setItem("layon_sqlite_dbname", dbname);
      localStorage.setItem("layon_sqlite_apikey", apikey);
    } catch (err) {
      console.error("Erro ao analisar string de conexão SQLite Cloud:", err);
    }
  };

  // Initialize and load configuration parameters
  useEffect(() => {
    const key = localStorage.getItem("layon_gemini_api_key") || "";
    const connStr = localStorage.getItem("layon_sqlite_connstring") || "";
    const host = localStorage.getItem("layon_sqlite_host") || "";
    const apikey = localStorage.getItem("layon_sqlite_apikey") || "";
    const dbname = localStorage.getItem("layon_sqlite_dbname") || "";
    const enabled = localStorage.getItem("layon_sqlite_enabled") === "true";
    
    setGeminiApiKey(key);
    setSqliteConnectionString(connStr);
    setSqliteHost(host);
    setSqliteApiKey(apikey);
    setSqliteDbName(dbname);
    setSqliteEnabled(enabled);
  }, []);

  // Helper to retrieve active configuration headers
  const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const savedKey = localStorage.getItem("layon_gemini_api_key");
    const savedHost = localStorage.getItem("layon_sqlite_host");
    const savedApikey = localStorage.getItem("layon_sqlite_apikey");
    const savedDbname = localStorage.getItem("layon_sqlite_dbname");
    const savedEnabled = localStorage.getItem("layon_sqlite_enabled") === "true";

    if (savedKey) {
      headers["X-Gemini-Api-Key"] = savedKey;
    }
    if (savedEnabled && savedHost && savedApikey && savedDbname) {
      headers["X-Sqlite-Cloud-Host"] = savedHost;
      headers["X-Sqlite-Cloud-Apikey"] = savedApikey;
      headers["X-Sqlite-Cloud-Dbname"] = savedDbname;
    }
    return headers;
  };

  // Helper function to call Gemini API directly from browser if hosted on a static server like Vercel
  const callGeminiClientSide = async (
    prompt: string,
    systemInstruction?: string,
    responseSchema?: any,
    responseMimeType?: string
  ): Promise<string> => {
    const apiKey = geminiApiKey || localStorage.getItem("layon_gemini_api_key") || "";
    if (!apiKey) {
      throw new Error(
        "Chave de API do Gemini não configurada localmente. Como o servidor Express não está rodando diretamente no Vercel (hospedagem estática), você deve clicar na engrenagem no topo para configurar e salvar sua chave da API do Gemini."
      );
    }

    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"];
    let lastError: any = null;

    for (const model of models) {
      try {
        addLog(`[Vercel Fallback] Tentando chamar o modelo direct-client ${model}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const requestBody: any = {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.7
          }
        };

        if (systemInstruction) {
          requestBody.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        if (responseMimeType) {
          requestBody.generationConfig.responseMimeType = responseMimeType;
        }

        if (responseSchema) {
          requestBody.generationConfig.responseSchema = responseSchema;
        }

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`API Gemini (${model}) respondeu com status ${res.status}: ${errText}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
        throw new Error("Resposta recebida sem bloco de texto válido.");
      } catch (err: any) {
        console.warn(`Tentativa com ${model} falhou:`, err.message || err);
        lastError = err;
      }
    }

    throw lastError || new Error("Falha ao contatar API do Gemini diretamente do navegador.");
  };

  // Safe list fetch engine (incorporating local storage fallback and real SQLite Cloud support)
  const loadSavedProjects = async () => {
    const savedHost = localStorage.getItem("layon_sqlite_host");
    const savedApikey = localStorage.getItem("layon_sqlite_apikey");
    const savedDbname = localStorage.getItem("layon_sqlite_dbname");
    const savedEnabled = localStorage.getItem("layon_sqlite_enabled") === "true";

    if (savedEnabled && savedHost && savedApikey && savedDbname) {
      try {
        const res = await fetch("/api/projects?userId=anonymous", {
          method: "GET",
          headers: {
            "X-Sqlite-Cloud-Host": savedHost,
            "X-Sqlite-Cloud-Apikey": savedApikey,
            "X-Sqlite-Cloud-Dbname": savedDbname
          }
        });
        if (res.ok) {
          const data = await res.json();
          setHistoryProjects(data);
          addLog(`Histórico carregado do SQLite Cloud (${data.length} páginas sincronizadas).`);
          return;
        } else {
          throw new Error(`Servidor respondeu com código ${res.status}`);
        }
      } catch (err: any) {
        addLog(`Ignorando conexão SQLite Cloud: ${err.message}. Lendo cache local.`);
      }
    }

    const saved = localStorage.getItem("layon_generated_history");
    if (saved) {
      try {
        setHistoryProjects(JSON.parse(saved));
      } catch (err) {
        console.error("Erro interpretando landing pages locais.");
      }
    }
  };

  // Test custom db connection in settings
  const handleTestDatabaseSetting = async () => {
    if (!sqliteHost || !sqliteApiKey || !sqliteDbName) {
      setDbTestMessage({ text: "Complete as credenciais do banco para prosseguir.", type: "error" });
      return;
    }
    setIsTestingDb(true);
    setDbTestMessage({ text: "Contatando SQLite Cloud REST Server...", type: "success" });
    try {
      const res = await fetch("/api/projects?userId=anonymous", {
        method: "GET",
        headers: {
          "X-Sqlite-Cloud-Host": sqliteHost,
          "X-Sqlite-Cloud-Apikey": sqliteApiKey,
          "X-Sqlite-Cloud-Dbname": sqliteDbName
        }
      });
      if (res.ok) {
        setDbTestMessage({ text: "✅ Sincronia perfeita! Conectado e autenticado com SQLite Cloud.", type: "success" });
      } else {
        const errDetails = await res.json().catch(() => ({}));
        throw new Error(errDetails.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setDbTestMessage({ text: `❌ Conexão malsucedida: ${err.message}`, type: "error" });
    } finally {
      setIsTestingDb(false);
    }
  };

  // Delete project physically
  const handleDeleteProject = async (projId: string, idx: number) => {
    if (!window.confirm("Excluir esta landing page? Esta operação é irreversível.")) return;
    
    addLog("Removendo página...");
    const savedHost = localStorage.getItem("layon_sqlite_host");
    const savedApikey = localStorage.getItem("layon_sqlite_apikey");
    const savedDbname = localStorage.getItem("layon_sqlite_dbname");
    const savedEnabled = localStorage.getItem("layon_sqlite_enabled") === "true";

    try {
      const customHeaders: Record<string, string> = {};
      if (savedEnabled && savedHost && savedApikey && savedDbname) {
        customHeaders["X-Sqlite-Cloud-Host"] = savedHost;
        customHeaders["X-Sqlite-Cloud-Apikey"] = savedApikey;
        customHeaders["X-Sqlite-Cloud-Dbname"] = savedDbname;
      }

      await fetch(`/api/projects/${projId || `local_${idx}`}`, {
        method: "DELETE",
        headers: customHeaders
      });
    } catch (err: any) {
      console.warn("Remoção física falhou:", err.message);
    }

    const updated = historyProjects.filter((_, i) => i !== idx);
    setHistoryProjects(updated);
    localStorage.setItem("layon_generated_history", JSON.stringify(updated));
    addLog("Página expurgada com sucesso.");
  };

  // Run initial loading on change config / mount
  useEffect(() => {
    loadSavedProjects();
  }, [sqliteEnabled]);

  // Auto-resolve Pinterest video URL on mount for immediate out-of-the-box support
  useEffect(() => {
    const autoResolveDefault = async () => {
      try {
        const res = await fetch("/api/resolve-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://pin.it/L5hQnXmm9" })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.resolvedUrl) {
            setVideoSrc(data.resolvedUrl);
            setVideoUrlInput("https://pin.it/L5hQnXmm9");
            setVideoFileName("Pinterest Autodetectado");
            addLog("Vídeo default do Pinterest resolvido e configurado com sucesso.");
          }
        }
      } catch (err: any) {
        console.error("Erro no auto-resolvimento do Pinterest:", err);
      }
    };
    autoResolveDefault();
  }, []);

  const addLog = (msg: string) => {
    setLogsList(prev => [...prev, msg]);
  };

  // Preset Applicator
  const selectStylePreset = (styleId: string) => {
    setSelectedStyle(styleId);
    const preset = PRESET_STYLES.find(p => p.id === styleId);
    if (preset) {
      setBgColor(preset.bg);
      setTextColor(preset.fg);
      setAccentColor(preset.ac);
    }
  };

  // Full-Page Template Preset Applicator
  const applyTemplatePreset = (presetId: string) => {
    const preset = TEMPLATE_PRESETS[presetId];
    if (!preset) return;
    
    // Set meta
    if (preset.name) setBrandName(preset.name);
    
    // Extract sections to set copy fields
    const heroSect = preset.sections.find(s => s.type === "hero");
    if (heroSect) {
      if (heroSect.title) setHeadline(heroSect.title);
      if (heroSect.subtitle) setSubheadline(heroSect.subtitle || "");
      if (heroSect.description) setAbout(heroSect.description);
      const firstBtn = heroSect.buttons?.[0];
      if (firstBtn) {
        setCtaText(firstBtn.text);
        setCtaLink(firstBtn.actionValue || "#contact");
      }
    }
    
    // Extract palette and font
    if (preset.metadata.palette) {
      setBgColor(preset.metadata.palette.background);
      setTextColor(preset.metadata.palette.text);
      setAccentColor(preset.metadata.palette.accent);
    }
    
    if (preset.metadata.primaryFont) {
      setFontDisplay(preset.metadata.primaryFont);
    }
    
    if (preset.metadata.vibe) {
      const vibe = preset.metadata.vibe;
      if (vibe === "tech") setSelectedStyle("cinema");
      else if (vibe === "brutalist") setSelectedStyle("neon");
      else if (vibe === "warm") setSelectedStyle("warm");
      else setSelectedStyle("minimalist");
    }
    
    // Extract features
    const featSect = preset.sections.find(s => s.type === "features_grid" || s.type === "technology");
    if (featSect && featSect.items) {
      const mappedFeats = featSect.items.map((it, idx) => ({
        id: it.id || `f_${idx}`,
        icon: it.icon === "Check" ? "✨" : it.icon === "Zap" ? "⚡" : it.icon === "Server" ? "📈" : "✨",
        title: it.title || "Diferencial",
        desc: it.description || ""
      }));
      setFeatures(mappedFeats);
    }
    
    // Extract stats
    const statsSect = preset.sections.find(s => s.type === "numbers");
    if (statsSect && statsSect.items) {
      const mappedStats = statsSect.items.map((it, idx) => ({
        id: it.id || `s_${idx}`,
        val: it.price || "100%",
        label: it.title || "Métrica"
      }));
      setStats(mappedStats);
    }
    
    // Extract testimonials
    const testSect = preset.sections.find(s => (s.type as string) === "testimonials");
    if (testSect && testSect.items) {
      const mappedTest = testSect.items.map((it, idx) => ({
        id: it.id || `t_${idx}`,
        quote: it.description || "",
        author: it.title || "Cliente",
        role: it.badge || "Cargo"
      }));
      setTestimonials(mappedTest);
    }
    
    // Rebuild the sections list keeping the active ones in the order of the preset,
    // and append any remaining sections at the end as disabled.
    const newSections: SectionItem[] = [];
    
    // First, add all sections present in the preset, in their preset order
    preset.sections.forEach(s => {
      let id = "";
      let label = "";
      let icon = "";
      const typeStr = s.type as string;
      
      if (typeStr === "hero") { id = "hero"; label = "Hero (Vídeo/Canvas)"; icon = "🎬"; }
      else if (typeStr === "vision") { id = "vision"; label = "Visão / Storytelling"; icon = "👁"; }
      else if (typeStr === "features_grid" || typeStr === "features") { id = "features"; label = "Nossos Diferenciais"; icon = "✨"; }
      else if (typeStr === "numbers" || typeStr === "stats") { id = "stats"; label = "Métricas / Números"; icon = "📊"; }
      else if (typeStr === "technology" || typeStr === "tech") { id = "tech"; label = "Tecnologia & Sistemas"; icon = "⚙️"; }
      else if (typeStr === "power") { id = "power"; label = "Palavras de Poder"; icon = "⚡"; }
      else if (typeStr === "product") { id = "products"; label = "Módulo SaaS interativo"; icon = "📦"; }
      else if (typeStr === "testimonials") { id = "testimonials"; label = "Depoimentos"; icon = "💬"; }
      else if (typeStr === "cta") { id = "cta"; label = "Hero CTA Final"; icon = "🎯"; }
      else if (typeStr === "footer") { id = "footer"; label = "Rodapé (Footer)"; icon = "⬇️"; }
      
      if (id && !newSections.some(x => x.id === id)) {
        newSections.push({ id, label, icon, on: true });
      }
    });
    
    // Then append any standard sections that were not in the preset (as disabled)
    const standardIds = ["hero", "vision", "features", "stats", "tech", "power", "products", "testimonials", "cta", "footer"];
    const labelsMap: Record<string, string> = {
      hero: "Hero (Vídeo/Canvas)", vision: "Visão / Storytelling", features: "Nossos Diferenciais",
      stats: "Métricas / Números", tech: "Tecnologia & Sistemas", power: "Palavras de Poder",
      products: "Módulo SaaS interativo", testimonials: "Depoimentos", cta: "Hero CTA Final", footer: "Rodapé (Footer)"
    };
    const iconsMap: Record<string, string> = {
      hero: "🎬", vision: "👁", features: "✨", stats: "📊", tech: "⚙️", power: "⚡",
      products: "📦", testimonials: "💬", cta: "🎯", footer: "⬇️"
    };
    
    standardIds.forEach(id => {
      if (!newSections.some(x => x.id === id)) {
        newSections.push({ id, label: labelsMap[id], icon: iconsMap[id], on: false });
      }
    });
    
    setSections(newSections);
    addLog(`Layout carregado: Preset '${preset.name}' aplicado com sucesso.`);
  };

  // Reorder Sections functions
  const moveSection = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    const reordered = [...sections];
    const item = reordered[index];
    reordered[index] = reordered[nextIndex];
    reordered[nextIndex] = item;
    setSections(reordered);
  };

  const toggleSectionOn = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, on: !s.on } : s));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const reordered = [...sections];
    const itemToMove = reordered[draggedIndex];
    
    // Remove from original index
    reordered.splice(draggedIndex, 1);
    // Insert at target index
    reordered.splice(index, 0, itemToMove);
    
    setSections(reordered);
    addLog(`Seção '${itemToMove.label}' reordenada por arrastar e soltar.`);
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Dyn lists triggers
  const addFeature = () => {
    if (features.length >= 6) return;
    const icons = ["✨", "🛡️", "🔥", "💎", "🔋", "🎯"];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    setFeatures([...features, { id: "feat_" + Date.now(), icon: randomIcon, title: "Novo diferencial", desc: "Explique o diferencial de forma curta e assertiva." }]);
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const addStat = () => {
    setStats([...stats, { id: "stat_" + Date.now(), val: "100%", label: "Métrica de sucesso" }]);
  };

  const removeStat = (id: string) => {
    setStats(stats.filter(s => s.id !== id));
  };

  const addTestimonial = () => {
    setTestimonials([...testimonials, { id: "test_" + Date.now(), quote: "Escreva o feedback sincero e poderoso que o cliente deu.", author: "Nome do Cliente", role: "Cargo, Empresa" }]);
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  // Video Demo Loader
  const loadDemoVideo = (url: string) => {
    setVideoSrc(url);
    setVideoType("url");
    setVideoUrlInput(url);
    setVideoFileName("Demonstração Abstrata");
    addLog("Vídeo demonstrativo carregado na URL.");
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ObjectUrl = URL.createObjectURL(file);
      setVideoSrc(ObjectUrl);
      setVideoType("file");
      setVideoFileName(file.name);
      addLog(`Vídeo local configurado: ${file.name}`);
    }
  };

  const applyUrlVideo = async () => {
    const url = videoUrlInput.trim();
    if (!url) return;

    addLog(`Analisando URL de vídeo: "${url}"`);
    setStatusMessage("Carregando vídeo...");
    setStatusType("loading");

    if (url.includes("pin.it") || url.includes("pinterest.com") || url.includes("pinimg.com")) {
      addLog("Detectado link do Pinterest. Solicitando extração do fluxo .mp4...");
      try {
        const res = await fetch("/api/resolve-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url })
        });
        if (!res.ok) {
          throw new Error(`Servidor retornou código HTTP ${res.status}`);
        }
        const data = await res.json();
        if (data.success && data.resolvedUrl) {
          setVideoSrc(data.resolvedUrl);
          setVideoType("url");
          setVideoUrlInput(data.resolvedUrl);
          setVideoFileName("Pinterest Resolvido");
          addLog(`Sucesso! Link de vídeo indexado: ${data.resolvedUrl}`);
          setStatusMessage("Vídeo do Pinterest resolvido e configurado com sucesso!");
          setStatusType("ok");
        } else {
          addLog(`Aviso do resolvedor: ${data.message || "Não foi possível extrair .mp4"}`);
          setVideoSrc(url);
          setVideoType("url");
          setVideoFileName("URL Direta");
          setStatusMessage("Link do Pinterest configurado.");
          setStatusType("ok");
        }
      } catch (err: any) {
        addLog(`Erro ao resolver vídeo: ${err.message}. Usando como URL direta.`);
        setVideoSrc(url);
        setVideoType("url");
        setVideoFileName("URL Direta");
        setStatusMessage("URL configurada.");
        setStatusType("ok");
      }
    } else {
      setVideoSrc(url);
      setVideoType("url");
      setVideoFileName("URL Direta");
      addLog("URL de vídeo configurada com sucesso.");
      setStatusMessage("Vídeo configurado.");
      setStatusType("ok");
    }
  };

  // Prompt Builders
  const buildSystemPrompt = () => {
    const isScrubMode = scrollMode === "scrub";

    return `You are Gemini-Design-Engine, an elite frontend developer and visual designer famous for creating world-class single-page websites. You build experiences reminiscent of Apple, Stripe, and Vercel.

MISSIONS & SKILLS ACTIVATED:
1. High-Luxury Styling: Clean, elegant spacing, beautiful absolute black contrast, glowing cards with frosted border indicators, and spectacular negative space.
2. Canvas design & Algorithmic Art: If no heavy video is provided, implement a beautiful, performant HTML5 canvas animation running on background (e.g. neural line systems, drifting star arrays).
3. Smooth kinetic scrolling: Every section has staggered slide revelations via GSAP.
4. Custom immersive cursors with mix-blend-mode:difference.
5. Absolute responsiveness: Looks spectacular on ultra-wide desktop monitor down to fine smartphones.

YOUR PARADIGM:
Generate a complete, fully operational, single-file HTML landing page based on the parameters. No incomplete mockups. Return ONLY the complete HTML. Do NOT wrap inside markdown fences. Start directly with <!DOCTYPE html> and end with </html>.

HTML TECHNICAL SPECS:
- Embedded CSS and javascript (GSAP, ScrollTrigger, and ScrollToPlugin CDNs are mandatory!). Include GSAP, ScrollTrigger, and ScrollToPlugin via standard unpkg/cdnjs links.
- Custom aesthetic system matching exactly:
  * Background: ${bgColor}
  * Main Text: ${textColor}
  * Highlight Accent: ${accentColor}
  * Primary font style for titles: ${fontDisplay}
  * Standard body font style: ${fontBody}
  * Border radius scale for buttons/cards: ${borderRadius}px
  * Frosted blur filter level: ${blurIntensity}px
  * Padding structure density: ${density}
- GSAP Entry transitions: ${animStyle} style running at scale Speed: ${animSpeed}s.
- Scroll Scrub type configured is: ${scrubType}.

${videoSrc ? `
- BACKGROUND VIDEO IMPLEMENTATION DETAILS:
  * Video URL: "${videoSrc}"
  * Opacity: ${videoOpacity}%, blur/filter: "${videoFilter}", overlaid by an elegant dark veil of opacity: ${overlayOpacity}%
  * Selected Scroll/Playback Sync Mode: "${scrollMode}"
  * MULTIPLE SECTIONS INTEGRATION (${videoMultiSection ? "ENABLED" : "DISABLED"}):
    ${videoMultiSection ? `
    * KEY VISUAL EFFECT: The background video MUST NOT be contained only in the #hero section. It MUST be placed in a global container with 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; z-index: -20; pointer-events: none;' behind the entire page.
    * Let all/multiple landing page sections (Hero, Vision/About, Features, Stats, etc.) have semi-transparent backgrounds (e.g. background: rgba(0,0,0,0.2) or semi-translucent styling with backdrop-filter glassmorphism), thereby showing the beautiful fixed background video across multiple sections as the user scrolls down!
    * This creates a stellar cohesive visual story where a single video spans behind multiple sections dynamically!
    ` : `
    * KEY VISUAL EFFECT: Keep the video confined inside the Hero section (#hero) only. Subsequent sections should have fully solid/opaque backgrounds matching "${bgColor}" that cover the video.
    `}
  
  ${isScrubMode ? `
    * CRITICAL FOR "scrub" MODE: The background video MUST NOT play freely on its own and MUST NOT have the "autoplay" or "loop" attributes. Set preload="auto", muted, playsinline.
    * You MUST write a GSAP ScrollTrigger script that pauses the video initially and animates the video's 'currentTime' property directly in sync with the user's scroll.
    * ${videoMultiSection ? `
      * Since MULTIPLE SECTIONS INTEGRATION is ENABLED, setup the ScrollTrigger using the entire document scroll trigger (e.g., trigger: "body", start: "top top", end: "bottom bottom", scrub: true) so that the video frames scrub continuously as the user scrolls through ALL sections. Do NOT pin the #hero, just let the scrolling page scrub the video smoothly!
      ` : `
      * Setup the ScrollTrigger using the Hero section (#hero) as the trigger.
      * Set start: "top top", end: "bottom top" (or end: "+=1500" for a generous scroll frame progression), scrub: 1 (or true), and pin: true on the #hero. Pinning is vital so the user scrubs through the video frames while the screen remains fixed in place, creating a premium Apple-style interactive scrolling effect.
      `}
    * Always enclose the GSAP animation inside a 'loadedmetadata' or 'canplaythrough' event listener or load guard because 'video.duration' is NaN until the video headers have loaded:
      
      const video = document.querySelector("#background-video");
      if (video) {
          video.pause();
          const initScrollVideo = () => {
            gsap.to(video, {
              currentTime: video.duration || 5,
              ease: "none",
              scrollTrigger: {
                trigger: "${videoMultiSection ? "body" : "#hero"}",
                start: "top top",
                end: "${videoMultiSection ? "bottom bottom" : "bottom top"}",
                scrub: 0.5,
                ${videoMultiSection ? "" : "pin: true,"}
                invalidateOnRefresh: true
              }
            });
          };
          if (video.readyState >= 1) {
            initScrollVideo();
          } else {
            video.addEventListener("loadedmetadata", initScrollVideo);
          }
      }
  ` : `
    * For other scrollModes (ambient or parallax):
      ${videoMultiSection ? `
      * Ambient: Let it play, loop, autoplay globally in position:fixed.
      * Parallax: Apply a GSAP ScrollTrigger with y: "-15%" (or scroll Trigger on body) to scroll the backdrop video slowly inside its fixed container.
      ` : `
      * Local ambient/parallax confined inside the hero container.
      `}
  `}
` : `
- Since NO background video is supplied, you MUST embed a spectacular Canvas procedural artwork inside the Hero section (e.g., interactive particle net, neural connection web, or custom vector nodes) running responsive code on requestAnimationFrame
`}

IMPORTANT: Never include purple defaults, generic shadows, or ugly grid margins. Use premium, authentic, and highly refined design layouts with standard humbles labels.`;
  };

  const buildUserPrompt = () => {
    const listDescriptions = {
      hero: `HERO: Viewport height "${heroHeight}". Showcase brand name "${brandName}", main headline "${headline}" and subtitle description "${subheadline}". Direct CTA button labeled "${ctaText}" scrolling to ${ctaLink}. Include a pulsing scrolling indicator.`,
      vision: `VISION: Generous typography. About block: "${about}". Render text characters using splitting fade-in effects during scrollTrigger.`,
      features: `FEATURES: A grid representing these core highlights:\n${features.map(f => ` - [${f.icon}] ${f.title}: ${f.desc}`).join("\n")}`,
      stats: `STATS/METRICAS: Immersive count-up animation for these metrics:\n${stats.map(s => ` - ${s.val}: ${s.label}`).join("\n")}`,
      tech: `TECH: High-tech minimalist structural showcase. Show modular cards containing animated svg blueprints and technical descriptions for Cloud, Elastic Scale, and Neural AI.`,
      power: `POWER WORDS: Renders massive, high-contrast display text blocks sequentially fading under skew transformations: "Automatize", "Escale", "Domine" with description "Cada processo otimizado é uma vantagem competitiva conquistada." using accent color "${accentColor}".`,
      products: `MÓDULO SAAS COCKPIT: Render a interactive preview of a dashboard console containing mockup graph lines representing core compute, latency indicators, and bot registries.`,
      testimonials: `TESTIMONIALS: Testimonial review slider containing:\n${testimonials.map(t => ` - "${t.quote}" by ${t.author} (${t.role})`).join("\n")}`,
      cta: `CTA FINAL: Premium footer banner inside radial light aura of color "${accentColor}". Core tagline: "O futuro não espera. Enquanto você lê isso, seus concorrentes estão automatizando. Entre em contato e comece a transformação hoje.". CTA action button: "${ctaText}" linking to "${ctaLink}".`,
      footer: `FOOTER: Minimalist copyright layout displaying brand "${brandName}" alongside layout links: Privacidade, Termos, Contato.`
    };

    const orderedDesc = sections
      .filter(s => s.on)
      .map(s => listDescriptions[s.id as keyof typeof listDescriptions])
      .join("\n\n");

    return `Create the absolute premium landing page for:
Product Brand: "${brandName}"
Aesthetic Directive: "${aiContext}"

Order layout outline required:
${orderedDesc}

Compile the HTML code with absolute perfection. Ready, set, go!`;
  };

  const buildLandingPageObject = (): TLandingPage => {
    return {
      id: "active-preview",
      name: brandName,
      userId: "anonymous",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      prompt: pastedIdeaInput || "Geração procedural",
      metadata: {
        title: brandName + " | " + (sectionHeadings.hero?.title || headline),
        description: (sectionHeadings.hero?.subtitle || subheadline) || about,
        primaryFont: fontDisplay.replace(/['"]/g, "") as any,
        vibe: (selectedStyle === "cinema" ? "tech" : selectedStyle === "neon" ? "brutalist" : "minimalist") as any,
        palette: {
          background: bgColor,
          text: textColor,
          accent: accentColor,
          secondary: selectedStyle === "cinema" ? "#111118" : selectedStyle === "neon" ? "#111122" : "#eeeeee",
        }
      },
      sections: sections.filter(s => s.on).map(s => {
        const sectItems: TSectionItem[] = [];
        if (s.id === "features") {
          features.forEach(f => sectItems.push({ id: f.id, title: f.title, description: f.desc, icon: "Sparkles" }));
        } else if (s.id === "stats") {
          stats.forEach(st => sectItems.push({ id: st.id, title: st.label, price: st.val }));
        } else if (s.id === "tech") {
          sectItems.push({ id: "t1", title: "Integração Contínua", description: "Deploy automatizado do seu portal em segundos.", icon: "Cpu" });
          sectItems.push({ id: "t2", title: "Pipelines Confiáveis", description: "Sincronização ininterrupta de mídias de vídeo.", icon: "Activity" });
          sectItems.push({ id: "t3", title: "Nuvem Distribuída", description: "Hospedagem em servidores globais elásticos.", icon: "Server" });
          sectItems.push({ id: "t4", title: "Suporte 24/7", description: "Equipe técnica dedicada à operação em produção.", icon: "Check" });
        } else if (s.id === "power") {
          sectItems.push({ id: "p1", title: "AUTOMATIZE", description: "Coloque workflows operando sob piloto automático inteligente imediatamente." });
          sectItems.push({ id: "p2", title: "OTIMIZE", description: "Refine latências, custos e métricas usando inteligência cognitiva." });
          sectItems.push({ id: "p3", title: "ESCALE", description: "Domine o volume infinito de demandas do mercado digital moderno." });
        } else if (s.id === "testimonials") {
          testimonials.forEach(t => sectItems.push({ id: t.id, title: t.author, description: t.quote, badge: t.role }));
        }

        const custom = sectionHeadings[s.id] || {};

        return {
          id: s.id,
          type: (s.id === "features" ? "features_grid" : s.id === "tech" ? "technology" : s.id === "products" ? "product" : s.id) as any,
          title: s.id === "hero" ? headline : (custom.title || s.label),
          subtitle: s.id === "hero" ? subheadline : (custom.subtitle || ""),
          badge: s.id === "hero" ? "PORTAL COGNITIVO" : (custom.badge || s.label.toUpperCase()),
          description: s.id === "hero" ? about : (custom.description || ""),
          alignment: custom.alignment || "center",
          mediaType: custom.mediaType || (s.id === "hero" ? "canvas_particles" : s.id === "vision" ? "neural_brain" : s.id === "products" ? "mockup_saas" : "none"),
          items: sectItems.length > 0 ? sectItems : undefined,
          buttons: s.id === "hero" || s.id === "cta" ? [{ text: ctaText, variant: "primary", actionType: "scroll_to_cta", actionValue: ctaLink }] : []
        };
      })
    };
  };

  // Launch Gemini HTML Generation via express endpoint
  const handleGenerateHtmlPage = async () => {
    setIsGenerating(true);
    setStatusMessage("Gerando portal de vendas com Gemini...");
    setStatusType("loading");
    setLogsList([]);
    
    addLog("Coletando diretrizes visuais e de conteúdo...");
    addLog(`Estilo selecionado: ${selectedStyle} | Modo de Scroll: ${scrollMode}`);
    if (videoSrc) {
      addLog(`Vídeo ativo: ${videoType === "file" ? "Upload Local" : "URL Remota"}`);
    } else {
      addLog("Sem vídeo de fundo. Ativando motor de Arte Canvas Procedural...");
    }

    addLog("Construindo instruções de design e prompt de contexto...");
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt();

    addLog("Enviando requisição ao canal Gemini no Node.js...");

    try {
      const customHeaders = getHeaders();
      let data;
      try {
        const res = await fetch("/api/generate-html", {
          method: "POST",
          headers: customHeaders,
          body: JSON.stringify({ systemPrompt, userPrompt })
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Erro de servidor: Código HTTP ${res.status}`);
        }

        // Test if response is JSON (Vercel redirects might return index.html)
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Resposta do servidor não está em formato JSON.");
        }
        data = await res.json();
      } catch (apiErr: any) {
        addLog(`[Vercel/Static Mode] API do servidor falhou: ${apiErr.message}. Acionando fallback de geração direta do navegador...`);
        const responseText = await callGeminiClientSide(userPrompt, systemPrompt);
        
        let cleanedHtml = responseText
          .replace(/^```html\s*/i, "")
          .replace(/^```\s*/, "")
          .replace(/```\s*$/, "")
          .trim();

        if (!cleanedHtml.startsWith("<!DOCTYPE") && !cleanedHtml.startsWith("<html")) {
          const match = cleanedHtml.match(/(<!DOCTYPE[\s\S]*)/i);
          if (match) cleanedHtml = match[1];
        }

        data = { html: cleanedHtml };
      }

      addLog("Página compilada recebida com sucesso! Higienizando tags de encapsulamento...");
      
      const cleanHtml = data.html;
      setGeneratedHtml(cleanHtml);
      
      const pageTitle = brandName + " — " + new Date().toLocaleTimeString();
      const pageDate = new Date().toLocaleDateString();

      // Update local history
      const newHistoryItem = {
        name: pageTitle,
        html: cleanHtml,
        date: pageDate
      };
      
      const extendedHistory = [newHistoryItem, ...historyProjects.slice(0, 9)];
      setHistoryProjects(extendedHistory);
      localStorage.setItem("layon_generated_history", JSON.stringify(extendedHistory));

      // Dual persistence back up on active server/cloud database
      try {
        await fetch("/api/projects", {
          method: "POST",
          headers: customHeaders,
          body: JSON.stringify({
            name: pageTitle,
            html: cleanHtml,
            date: pageDate,
            userId: "anonymous"
          })
        });
        addLog("Página persistida fisicamente no bando de dados.");
      } catch (saveErr: any) {
        console.warn("Persistência em background falhou:", saveErr.message);
      }

      addLog(`Portfólio registrado! Tamanho total: ${(cleanHtml.length / 1024).toFixed(1)} KB`);
      setStatusMessage("Landing page gerada na velocidade da luz!");
      setStatusType("ok");

      // Reload cloud/local projects to guarantee perfectly synchronized list
      loadSavedProjects();

      // Set arbitrary safe token calculation for aesthetics of developer console
      setTokenCount(Math.floor(cleanHtml.length / 4.1));

    } catch (err: any) {
      console.error("Erro na geração:", err);
      addLog(`Erro crítico constatado: ${err.message}`);
      setStatusMessage(`Ocorreu um erro: ${err.message}`);
      setStatusType("error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Render HTML in the iframe as state changes
  useEffect(() => {
    if (generatedHtml && iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(generatedHtml);
        doc.close();
      }
    }
  }, [generatedHtml, device]);

  // Diagnostic HUD listener: real-time telemetry extraction from visualizer iframe
  useEffect(() => {
    let active = true;
    let timerId: any = null;

    const updateDiagnostics = () => {
      if (!active) return;
      
      try {
        const iframe = iframeRef.current;
        if (iframe) {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            // Find video element inside the iframe environment
            const video = doc.querySelector("video") || doc.querySelector("#background-video");
            
            // Scroll info
            const win = iframe.contentWindow;
            if (win) {
              const scrollY = win.scrollY || 0;
              const docHeight = doc.documentElement.scrollHeight || doc.body.scrollHeight || 1;
              const winHeight = win.innerHeight || 1;
              const maxS = docHeight - winHeight;
              
              setDiagnosticScrollY(scrollY);
              setDiagnosticMaxScroll(maxS > 0 ? maxS : 1);
            }

            if (video instanceof HTMLVideoElement) {
              setDiagnosticVideoTime(video.currentTime || 0);
              setDiagnosticVideoDuration(video.duration || 5);
              setDiagnosticVideoPaused(video.paused);
              
              if (video.readyState === 0) {
                setDiagnosticVideoStatus("Sem Metadados");
              } else if (video.readyState === 1) {
                setDiagnosticVideoStatus("Carregando cabeçalho");
              } else if (video.readyState === 2) {
                setDiagnosticVideoStatus("Carregando frames");
              } else if (video.readyState >= 3) {
                // Diagnose synchrony
                // In scrub mode, video currentTime correlates exactly to scrollProgress * duration
                const win = iframe.contentWindow;
                if (win) {
                  const scrollY = win.scrollY || 0;
                  const docHeight = doc.documentElement.scrollHeight || 1;
                  const winHeight = win.innerHeight || 1;
                  const maxS = docHeight - winHeight;
                  const scrollProgress = maxS > 0 ? scrollY / maxS : 0;
                  const expectedTime = scrollProgress * (video.duration || 5);
                  const difference = Math.abs(video.currentTime - expectedTime);
                  
                  if (scrollMode === "scrub") {
                    if (difference < 0.18) {
                      setDiagnosticVideoStatus("Sincronia Perfeita ✓");
                    } else if (difference < 0.6) {
                      setDiagnosticVideoStatus("Ajustando Inércia...");
                    } else {
                      setDiagnosticVideoStatus("Sincronizando GSAP 🔄");
                    }
                  } else {
                    setDiagnosticVideoStatus("Modo Ambiente Livre 🚀");
                  }
                }
              }
            } else {
              setDiagnosticVideoStatus("Vídeo não encontrado");
              setDiagnosticVideoTime(0);
              setDiagnosticVideoDuration(0);
            }
          }
        }
      } catch (err) {
        // Safe swallow frame load transient errors
      }

      if (active) {
        timerId = setTimeout(updateDiagnostics, 80);
      }
    };

    if (generatedHtml) {
      updateDiagnostics();
    } else {
      setDiagnosticVideoStatus("Aguardando Geração");
    }

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [generatedHtml, device, scrollMode]);

  // Suggest Content by AI Idea ("Colar Ideia")
  const handleSuggestContent = async () => {
    const idea = pastedIdeaInput.trim();
    if (!idea) {
      alert("Por favor, digite ou cole uma ideia primeiro.");
      return;
    }

    setIsSuggestingContent(true);
    addLog(`Enviando sugestão de ideia ao Gemini: "${idea.slice(0, 45)}..."`);
    setStatusMessage("IA está estruturando o conteúdo da página...");
    setStatusType("loading");

    try {
      const customHeaders = getHeaders();
      let data;
      try {
        const res = await fetch("/api/suggest-content", {
          method: "POST",
          headers: customHeaders,
          body: JSON.stringify({ idea })
        });

        if (!res.ok) {
          throw new Error(`Código de erro HTTP ${res.status}`);
        }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("Resposta do servidor não é um JSON válido.");
        }

        data = await res.json();
      } catch (apiErr: any) {
        addLog(`[Vercel/Static Mode] API de sugestão falhou: ${apiErr.message}. Iniciando processamento local direto no seu navegador...`);
        
        const clientResponseSchema = {
          type: "OBJECT",
          properties: {
            brandName: { type: "STRING", description: "Nome elegante do negócio" },
            headline: { type: "STRING", description: "Título magnético principal" },
            subheadline: { type: "STRING", description: "Subtítulo de apoio da Hero" },
            about: { type: "STRING", description: "Parágrafo institucional/Parágrafo sobre" },
            ctaText: { type: "STRING", description: "Texto de ação do botão principal" },
            ctaLink: { type: "STRING", description: "Link de ação (geralmente #contato)" },
            aiContext: { type: "STRING", description: "Descrição do tom e do público direcionados ao Gemini" },
            features: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  icon: { type: "STRING", description: "Ícone CamelCase do Lucide válido (ex: Brain, Cpu, Sparkles, Layers, Activity, Zap, Shield, Globe)" },
                  title: { type: "STRING" },
                  desc: { type: "STRING" }
                },
                required: ["id", "icon", "title", "desc"]
              }
            },
            stats: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  val: { type: "STRING" },
                  label: { type: "STRING" }
                },
                required: ["id", "val", "label"]
              }
            },
            testimonials: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  quote: { type: "STRING" },
                  author: { type: "STRING" },
                  role: { type: "STRING" }
                },
                required: ["id", "quote", "author", "role"]
              }
            }
          },
          required: ["brandName", "headline", "subheadline", "about", "ctaText", "ctaLink", "aiContext", "features", "stats", "testimonials"]
        };

        const suggestSystemInstruction = `Você é um Copywriter e Diretor Criativo Senior da Apple ou Stripe.
Sua missão é pegar a ideia bruta fornecida pelo usuário e estruturar o conteúdo de uma Landing Page cinematográfica e de altíssimo luxo corporativo.
A resposta DEVE obrigatoriamente estar em formato JSON estrito, compatível com as propriedades do objeto Schema do Layout.
Forneça textos em Português do Brasil (pt-BR), com tom altamente persuasivo, técnico de alta convicção e inspirador.

REGRAS DE CONTEÚDO:
1. brandName: Nome exclusivo, imponente e sofisticado para o negócio (pense em nomes curtos, elegantes, marcantes).
2. headline: Um título de herói extremamente magnético de até 8 a 10 palavras. Nada de frases clichês ("Sua melhor escolha"). Foque no novo paradigma.
3. subheadline: Uma linha de apoio profunda, técnica e envolvente de 15 a 20 palavras que explica o valor real do amanhã.
4. about: Um parágrafo "Quem Somos / Manifesto" impactante e poético sobre o domínio ou solução idealizada.
5. ctaText: O texto do botão de ação principal (ex: "Iniciar jornada", "Construir agora", "Desbloquear acesso", "Falar com Engenheiro").
6. ctaLink: Geralmente "#contato" ou "#cta".
7. aiContext: Uma instrução interna para o motor de layout sobre a identidade da marca, tom do site e público-alvo (para guiar customizações futuras).
8. features: Exatamente 4 características ou diferenciais de grife exclusivos. Cada uma deve ter:
   - id: "f1", "f2", "f3", "f4"
   - icon: Um ícone Lucide válido exatamente em CamelCase (ex: "Brain", "Cpu", "Sparkles", "Layers", "Activity", "Zap", "Shield", "Globe")
   - title: Título curto de até 3 palavras
   - desc: Um parágrafo resumido e inspirador sobre este item
9. stats: Exatamente 4 métricas expressivas e verossímeis condizentes com o setor sugerido. Cada uma deve ter:
   - id: "s1", "s2", "s3", "s4"
   - val: O número ou indicador (ex: "99.8%", "12x", "40M+", "0ms")
   - label: O rótulo explicativo curto
10. testimonials: Exatamente 1 depoimento memorável e envolvente de um cliente fictício de alto relevo. Cada um deve ter:
   - id: "t1"
   - quote: Uma declaração assertiva e detalhada sobre o impacto provocado
   - author: Um nome próprio realista
   - role: Cargo de alto nível (ex: "Director of Product", "Founder", "Chief Executive")`;

        const responseText = await callGeminiClientSide(
          `Construa todo o conteúdo da landing page com base nesta ideia crua do negócio: ${idea}`,
          suggestSystemInstruction,
          clientResponseSchema,
          "application/json"
        );

        const parsed = JSON.parse(responseText.trim());
        data = { success: true, ...parsed };
      }

      if (data && data.success) {
        setBrandName(data.brandName || "Luxury Brand");
        setHeadline(data.headline || "");
        setSubheadline(data.subheadline || "");
        setAbout(data.about || "");
        if (data.ctaText) setCtaText(data.ctaText);
        if (data.ctaLink) setCtaLink(data.ctaLink);
        if (data.aiContext) setAiContext(data.aiContext);
        
        if (data.features && Array.isArray(data.features)) {
          setFeatures(data.features.map((f: any) => ({
            id: f.id || Math.random().toString(),
            icon: f.icon || "Sparkles",
            title: f.title || "Diferencial",
            desc: f.desc || ""
          })));
        }

        if (data.stats && Array.isArray(data.stats)) {
          setStats(data.stats.map((s: any) => ({
            id: s.id || Math.random().toString(),
            val: s.val || "0",
            label: s.label || ""
          })));
        }

        if (data.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials.map((t: any) => ({
            id: t.id || Math.random().toString(),
            quote: t.quote || "",
            author: t.author || "",
            role: t.role || ""
          })));
        }

        addLog(`IA estruturou com sucesso o produto: "${data.brandName}"!`);
        setStatusMessage("Conteúdo estruturado com sucesso! Revise e clique em Gerar.");
        setStatusType("ok");
      } else {
        throw new Error(data.message || "Erro desconhecido na resposta");
      }
    } catch (err: any) {
      console.error(err);
      addLog(`Erro ao estruturar ideia: ${err.message}`);
      setStatusMessage("Erro ao estruturar conteúdo.");
      setStatusType("error");
    } finally {
      setIsSuggestingContent(false);
    }
  };

  // General tools: Copy, Download, Open
  const copyGeneratedCode = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml).then(() => {
      setStatusMessage("HTML copiado com sucesso para a área de transferência!");
      setTimeout(() => setStatusMessage("Landing page pronta."), 3000);
    });
  };

  const downloadGeneratedHtml = () => {
    if (!generatedHtml) return;
    const cleanFileName = brandName.toLowerCase().replace(/\s+/g, "-") + "-landing.html";
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = cleanFileName;
    a.click();
    URL.revokeObjectURL(u);
    setStatusMessage(`Download de ${cleanFileName} iniciado!`);
  };

  const openGeneratedHtmlInTab = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const u = URL.createObjectURL(blob);
    window.open(u, "_blank");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-[#07070a] text-[#e1e1e6] font-sans antialiased">
      
      {/* ════════ SIDEBAR DE CONFIGURAÇÃO DO PORTAL ════════ */}
      <aside className="w-full lg:w-[410px] xl:w-[440px] flex-shrink-0 flex flex-col bg-[#0b0c13] border-b lg:border-b-0 lg:border-r border-zinc-900 h-[650px] lg:h-full overflow-hidden relative z-20">
        
        {/* Header - Brand Identity */}
        <div className="p-5 border-b border-zinc-900 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#7c5cfc] to-[#00d4aa] animate-pulse" />
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-mono">
                LandingGen <span className="px-1.5 py-0.5 bg-[#7c5cfc]/15 text-[#7c5cfc] rounded-md text-[9px] font-bold tracking-widest border border-[#7c5cfc]/20">GEMINI IA</span>
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Settings gear button */}
              <button 
                onClick={() => {
                  setDbTestMessage({ text: "", type: "" });
                  setIsSettingsModalOpen(true);
                }}
                className="p-1 px-1.5 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-[#7c5cfc] transition-all cursor-pointer flex items-center justify-center"
                title="Configurações Globais (Chave API & SQLite Cloud)"
              >
                <Settings size={12} />
              </button>

              {historyProjects.length > 0 && (
                <select 
                  className="bg-zinc-950 text-zinc-400 text-[10px] py-1 px-1.5 rounded border border-zinc-900 max-w-[110px] outline-none font-mono cursor-pointer transition-colors hover:text-white"
                  onChange={(e) => {
                    const idx = parseInt(e.target.value);
                    if (!isNaN(idx) && historyProjects[idx]) {
                      setGeneratedHtml(historyProjects[idx].html);
                      addLog(`Projeto restaurado do histórico: ${historyProjects[idx].name}`);
                    }
                  }}
                >
                  <option value="">Histórico</option>
                  {historyProjects.map((proj, idx) => (
                    <option key={idx} value={idx}>{proj.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Tab Selection Row */}
          <div className="grid grid-cols-4 gap-1 p-0.5 bg-[#030407] rounded-lg border border-zinc-900">
            {[
              { id: "content", label: "Conteúdo", icon: <Layers size={11} /> },
              { id: "design", label: "Design", icon: <Paintbrush size={11} /> },
              { id: "video", label: "Vídeo", icon: <Video size={11} /> },
              { id: "sections", label: "Seções", icon: <ListFilter size={11} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-1 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider flex flex-col items-center gap-1 justify-center transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? "bg-[#0b0c13] text-white shadow" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar scrolling view area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 md:custom-scrollbar">

          {/* TAB 1: CONTENT DESIGN */}
          {activeTab === "content" && (
            <div className="space-y-5 animate-fade-in">
              {/* Premium AI Suggestion Board */}
              <div className="p-4 rounded-xl border border-dashed border-[#7c5cfc]/30 bg-[#7c5cfc]/5 space-y-3.5">
                <div className="flex items-center gap-1.5 text-xs text-[#7c5cfc] font-mono font-extrabold uppercase">
                  <Sparkles size={13} className="animate-pulse" />
                  <span>Colar Ideia (IA Writer)</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Digite ou cole uma ideia bruta sobre o que vende ou resolve o seu negócio. O Gemini estruturará todo o copywriting e métricas do site em Português de forma profissional.
                </p>
                <textarea
                  rows={3}
                  value={pastedIdeaInput}
                  onChange={(e) => setPastedIdeaInput(e.target.value)}
                  placeholder="Ex: Uma assessoria imobiliária de iates de luxo em Florianópolis e iates de competição, com design clean e moderno da Apple..."
                  className="w-full bg-black/50 border border-zinc-900 focus:border-[#7c5cfc] rounded-lg p-2.5 text-xs text-white outline-none transition-all resize-none placeholder-zinc-700 font-sans"
                />
                <button
                  onClick={handleSuggestContent}
                  disabled={isSuggestingContent || !pastedIdeaInput.trim()}
                  className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-[#7c5cfc] to-[#00d4aa] text-white text-xs font-bold font-mono tracking-wider transition-all hover:opacity-95 shadow cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSuggestingContent ? (
                    <>
                      <RotateCw size={12} className="animate-spin" />
                      ESTRUTURANDO PÁGINA...
                    </>
                  ) : (
                    <>
                      <Send size={11} />
                      ESTRUTURAR COPY & MÉTRICAS
                    </>
                  )}
                </button>
              </div>

              {/* Separator line */}
              <div className="border-t border-zinc-900/60 my-2" />

              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🏢 Identidade da Corporação</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nome do Produto / Marca</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-2 px-3 text-xs text-white outline-none transition-all"
                    placeholder="Ex: Layon Devs, NeuralCore..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Tagline Principal (Headline)</label>
                  <textarea
                    rows={2}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-2 px-3 text-xs text-white outline-none transition-all resize-none"
                    placeholder="Frase de impacto inicial..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Subtítulo de Apoio</label>
                  <textarea
                    rows={2}
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-2 px-3 text-xs text-white outline-none transition-all resize-none"
                    placeholder="Aprofunde a proposta de valor..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Sobre / Filosofia Comercial (2 a 4 frases)</label>
                  <textarea
                    rows={3}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-2 px-3 text-xs text-white outline-none transition-all resize-y"
                    placeholder="Explicação conceitual de bastidores..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Texto do CTA</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-2 px-3 text-xs text-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Link de destino do CTA</label>
                    <input
                      type="text"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-2 px-3 text-xs text-white outline-none transition-all animate-none"
                    />
                  </div>
                </div>
              </div>

              {/* Differential Block */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">✨ Diferenciais da Marca (Máx 6)</h3>
                  <button 
                    onClick={addFeature}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-[#00d4aa] uppercase tracking-wider bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 border border-[#00d4aa]/20 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    <Plus size={10} /> Adicionar
                  </button>
                </div>

                <div className="space-y-3">
                  {features.map((f, idx) => (
                    <div key={f.id} className="flex gap-2.5 items-start bg-[#030407] p-3 border border-zinc-900/60 rounded-xl relative group">
                      <input 
                        type="text" 
                        value={f.icon} 
                        onChange={(e) => {
                          const updated = [...features];
                          updated[idx].icon = e.target.value;
                          setFeatures(updated);
                        }}
                        className="w-8 h-8 flex-shrink-0 bg-zinc-950 border border-zinc-900 rounded-lg text-center text-sm focus:border-[#7c5cfc] outline-none"
                      />
                      <div className="flex-1 space-y-1">
                        <input 
                          type="text" 
                          value={f.title} 
                          placeholder="Nome do diferencial"
                          onChange={(e) => {
                            const updated = [...features];
                            updated[idx].title = e.target.value;
                            setFeatures(updated);
                          }}
                          className="w-full bg-transparent border-b border-transparent focus:border-zinc-800 text-xs font-bold text-white outline-none pb-0.5"
                        />
                        <input 
                          type="text" 
                          value={f.desc} 
                          placeholder="Descrição rápida"
                          onChange={(e) => {
                            const updated = [...features];
                            updated[idx].desc = e.target.value;
                            setFeatures(updated);
                          }}
                          className="w-full bg-transparent border-b border-transparent focus:border-zinc-800 text-[10px] text-zinc-400 outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => removeFeature(f.id)}
                        className="text-zinc-600 hover:text-red-400 p-1 rounded-lg hover:bg-red-500/10 cursor-pointer transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Block */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">📊 Métricas e Números</h3>
                  <button 
                    onClick={addStat}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-[#00d4aa] uppercase tracking-wider bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 border border-[#00d4aa]/20 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    <Plus size={10} /> Adicionar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {stats.map((s, idx) => (
                    <div key={s.id} className="bg-[#030407] p-2.5 border border-zinc-900 rounded-xl space-y-1.5 relative group">
                      <div className="flex justify-between items-center">
                        <input 
                          type="text" 
                          value={s.val} 
                          placeholder="Valor (ex: 500+)"
                          onChange={(e) => {
                            const updated = [...stats];
                            updated[idx].val = e.target.value;
                            setStats(updated);
                          }}
                          className="w-2/3 bg-transparent border-b border-transparent focus:border-zinc-800 text-xs font-extrabold text-white outline-none pb-0.5"
                        />
                        <button 
                          onClick={() => removeStat(s.id)}
                          className="text-zinc-600 hover:text-red-400 p-0.5 rounded cursor-pointer transition-colors"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={s.label} 
                        placeholder="Nome (ex: Clientes)"
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx].label = e.target.value;
                          setStats(updated);
                        }}
                        className="w-full bg-transparent border-b border-transparent focus:border-zinc-800 text-[10px] text-zinc-400 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials Block */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">💬 Depoimentos</h3>
                  <button 
                    onClick={addTestimonial}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-[#00d4aa] uppercase tracking-wider bg-[#00d4aa]/10 hover:bg-[#00d4aa]/20 border border-[#00d4aa]/20 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    <Plus size={10} /> Adicionar
                  </button>
                </div>

                <div className="space-y-3 block">
                  {testimonials.map((t, idx) => (
                    <div key={t.id} className="bg-[#030407] p-3 border border-zinc-900 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-bold text-[#7c5cfc] uppercase">Depoimento {idx + 1}</span>
                        <button 
                          onClick={() => removeTestimonial(t.id)}
                          className="text-zinc-600 hover:text-red-400 p-0.5 rounded cursor-pointer transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={t.quote}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[idx].quote = e.target.value;
                          setTestimonials(updated);
                        }}
                        className="w-full bg-[#07070a] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-1.5 px-2.5 text-xs text-zinc-300 outline-none transition-all resize-none"
                        placeholder="Conteúdo do depoimento..."
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={t.author} 
                          placeholder="Autor"
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].author = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full bg-[#07070a] border border-zinc-900 py-1 px-2 text-[10px] text-white rounded outline-none"
                        />
                        <input 
                          type="text" 
                          value={t.role} 
                          placeholder="Cargo, Empresa"
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[idx].role = e.target.value;
                            setTestimonials(updated);
                          }}
                          className="w-full bg-[#07070a] border border-zinc-900 py-1 px-2 text-[10px] text-zinc-400 rounded outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context Block */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🧠 Contexto Extra para Gemini</h3>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Diretrizes Adicionais de Copywriting</label>
                  <textarea
                    rows={3}
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc]/60 rounded-lg py-2 px-3 text-xs text-white outline-none transition-all resize-y font-normal"
                    placeholder="Como deve ser o tom das mensagens, público e objetivos específicos..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL STYLING */}
          {activeTab === "design" && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Presets Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🎨 Estilo Visual Predefinido</h3>
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_STYLES.map(preset => (
                    <div 
                      key={preset.id}
                      onClick={() => selectStylePreset(preset.id)}
                      className={`border rounded-xl p-3 cursor-pointer transition-all ${
                        selectedStyle === preset.id 
                          ? "border-[#7c5cfc] bg-[#7c5cfc]/5 shadow" 
                          : "border-zinc-900 bg-[#030407] hover:border-zinc-800"
                      }`}
                    >
                      <div 
                        className="h-12 w-full rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-zinc-950"
                        style={{ background: preset.gradient }}
                      >
                        <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-white drop-shadow-md">{preset.name}</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-white block truncate">{preset.name}</span>
                      <span className="text-[9px] text-[#6b6b80] block truncate">{preset.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customized Color Swatches */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🎨 Paleta de Cores Customizada</h3>
                  <button 
                    onClick={() => { setSelectedStyle("custom"); }}
                    className="text-[9px] font-bold text-zinc-400 uppercase font-mono tracking-wider border border-zinc-800 px-2 py-0.5 rounded hover:text-white"
                  >
                    Customizar
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white font-bold block">Background</span>
                      <span className="text-[9px] text-zinc-500 font-mono">Fundo principal das seções</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">{bgColor}</span>
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => { setBgColor(e.target.value); setSelectedStyle("custom"); }}
                        className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border border-zinc-800 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white font-bold block">Texto</span>
                      <span className="text-[9px] text-zinc-500 font-mono">Cor do corpo e cabeçalhos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">{textColor}</span>
                      <input 
                        type="color" 
                        value={textColor} 
                        onChange={(e) => { setTextColor(e.target.value); setSelectedStyle("custom"); }}
                        className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border border-zinc-800 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white font-bold block">Destaque (Accent)</span>
                      <span className="text-[9px] text-zinc-500 font-mono">Botões, badges e links especiais</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">{accentColor}</span>
                      <input 
                        type="color" 
                        value={accentColor} 
                        onChange={(e) => { setAccentColor(e.target.value); setSelectedStyle("custom"); }}
                        className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer border border-zinc-800 bg-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography selectors */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🔤 Tipografia</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Fonte Display (Títulos)</label>
                  <select 
                    value={fontDisplay}
                    onChange={(e) => setFontDisplay(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 rounded-lg py-2 px-3 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Inter">Inter — Neutro moderno</option>
                    <option value="'Playfair Display'">Playfair Display — Elegante serif</option>
                    <option value="'Space Grotesk'">Space Grotesk — Tecno geométrico</option>
                    <option value="'DM Sans'">DM Sans — Clean contemporâneo</option>
                    <option value="'Syne'">Syne — Experimental arrojado</option>
                    <option value="'Bebas Neue'">Bebas Neue — Impactante condensado</option>
                    <option value="Manrope">Manrope — Científico e refinado</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Fonte Body (Textos de corpo)</label>
                  <select 
                    value={fontBody}
                    onChange={(e) => setFontBody(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 rounded-lg py-2 px-3 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="'Manrope'">Manrope</option>
                    <option value="Inter">Inter</option>
                    <option value="'DM Sans'">DM Sans</option>
                    <option value="'Source Sans 3'">Source Sans 3</option>
                    <option value="'IBM Plex Sans'">IBM Plex Sans</option>
                  </select>
                </div>
              </div>

              {/* Layout details */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">⚙️ Layout e Densidade</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Arredondamento de Cards</span>
                    <span className="font-mono text-[#7c5cfc]">{borderRadius}px</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={32} 
                    value={borderRadius} 
                    onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                    className="w-full accent-[#7c5cfc] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Intensidade de Glass Blur</span>
                    <span className="font-mono text-[#7c5cfc]">{blurIntensity}px</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={40} 
                    value={blurIntensity} 
                    onChange={(e) => setBlurIntensity(parseInt(e.target.value))}
                    className="w-full accent-[#7c5cfc] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Densidade de Preenchimento</label>
                  <select 
                    value={density}
                    onChange={(e) => setDensity(e.target.value as any)}
                    className="w-full bg-[#030407] border border-zinc-900 rounded-lg py-2 px-3 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="spacious">Espaçoso — Estilo Apple (High White-space)</option>
                    <option value="balanced">Equilibrado e Fluido</option>
                    <option value="dense">Compacto e Informativo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIDEO BACKGROUND CONFIG */}
          {activeTab === "video" && (
            <div className="space-y-5 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🎬 Vídeo de Background</h3>
                
                {/* Upload drag block */}
                <div className="border border-dashed border-zinc-800 hover:border-[#7c5cfc] transition-colors rounded-xl p-6 text-center relative cursor-pointer bg-[#030407]">
                  <Video className="mx-auto text-zinc-500 mb-2" size={24} />
                  <span className="text-xs font-bold text-zinc-300 block">Fazer upload de vídeo</span>
                  <span className="text-[10px] text-zinc-500 block mb-3">Arraste ou clique para carregar arquivo local</span>
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleVideoFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {videoFileName && (
                    <span className="text-[10px] font-bold text-[#00d4aa] border border-[#00d4aa]/20 bg-[#00d4aa]/10 py-1 px-3.5 rounded-full inline-block mt-1 truncate max-w-[200px]">
                      ✓ {videoFileName}
                    </span>
                  )}
                </div>

                <div className="text-center font-mono text-[9px] text-zinc-600">— ou providencie URL direta —</div>

                {/* URL Direct row */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="https://exemplo.b-cdn.net/render.mp4"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      className="flex-1 bg-[#030407] border border-zinc-900 rounded-lg py-2 px-2.5 text-xs text-white font-mono outline-none"
                    />
                    <button 
                      onClick={applyUrlVideo}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>

              {/* Scroll Trigger Sync selection */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🔄 Sincronização de Scroll do Vídeo</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {SCROLL_MODES.map(mode => (
                    <div 
                      key={mode.id}
                      onClick={() => setScrollMode(mode.id)}
                      className={`border rounded-xl p-2.5 cursor-pointer transition-all ${
                        scrollMode === mode.id 
                          ? "border-[#7c5cfc] bg-[#7c5cfc]/5" 
                          : "border-zinc-900 bg-[#030407] hover:border-zinc-855"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white text-xs mb-1">
                        <span>{mode.icon}</span>
                        <span className="truncate">{mode.name}</span>
                      </div>
                      <p className="text-[9px] text-[#6b6b80] leading-snug">{mode.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPACITY AND FILTER SETTINGS */}
              <div className="border-t border-zinc-900 pt-5 space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🎛️ Controles Globais do Player</h3>
                
                <div className="bg-[#7c5cfc]/5 border border-[#7c5cfc]/20 rounded-xl p-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white font-bold block">📽️ Vídeo Multisseção GERAL</span>
                      <span className="text-[9px] text-[#6b6b80] font-mono block">Fixa o vídeo no fundo de todo o site</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={videoMultiSection}
                        onChange={() => setVideoMultiSection(!videoMultiSection)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-450 after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00d4aa] peer-checked:after:bg-white peer-checked:after:border-transparent"></div>
                    </label>
                  </div>
                  <p className="text-[9.5px] text-zinc-400 leading-relaxed">
                    Quando ativo, o seu vídeo de background fica fixo em segundo plano por trás de várias seções da página. As seções ganham um design semitransparente (estilo glassmorphism) criando um visual integrado contínuo deslumbrante!
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Opacidade do Vídeo</span>
                    <span className="font-mono text-[#7c5cfc]">{videoOpacity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={10} 
                    max={100} 
                    value={videoOpacity} 
                    onChange={(e) => setVideoOpacity(parseInt(e.target.value))}
                    className="w-full accent-[#7c5cfc] cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Velo de Sobreposição Escura (Overlay)</span>
                    <span className="font-mono text-[#7c5cfc]">{overlayOpacity}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={90} 
                    value={overlayOpacity} 
                    onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                    className="w-full accent-[#7c5cfc] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Efeito de Filtro Visual</label>
                  <select 
                    value={videoFilter}
                    onChange={(e) => setVideoFilter(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 rounded-lg py-2 px-3 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="none">Nenhum Filtro (Natural)</option>
                    <option value="grayscale(100%)">Preto e Branco Puro</option>
                    <option value="saturate(200%) hue-rotate(200deg)">Tom Azul Futurista (Cyber)</option>
                    <option value="sepia(60%) saturate(150%)">Sépia Quente & Clássico</option>
                    <option value="hue-rotate(120deg) saturate(150%)">Verde Terminal (Matrix)</option>
                    <option value="blur(2px) saturate(120%)">Desfocado (Smooth Blur)</option>
                    <option value="contrast(125%) brightness(85%)">Alto Contraste Cinematográfico</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Altura Ocupada pela Seção Hero</label>
                  <select 
                    value={heroHeight}
                    onChange={(e) => setHeroHeight(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 rounded-lg py-2 px-3 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="100vh">Tela Inteira (100vh — Altíssimo Impacto)</option>
                    <option value="85vh">Corporativo Longo (85vh)</option>
                    <option value="70vh">Médio (70vh)</option>
                  </select>
                </div>
              </div>

              {/* Demo Loop assets */}
              <div className="border-t border-zinc-900 pt-5 space-y-3">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-500 uppercase">🎞️ Vídeos Livres Disponíveis</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => loadDemoVideo("https://www.w3schools.com/html/mov_bbb.mp4")}
                    className="bg-zinc-900/60 hover:bg-zinc-800 text-[10px] py-2 px-2.5 border border-zinc-900 rounded-lg font-bold text-white truncate cursor-pointer transition-colors"
                  >
                    ▶ Abstrato Tecno
                  </button>
                  <button 
                    onClick={() => loadDemoVideo("https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm")}
                    className="bg-zinc-900/60 hover:bg-zinc-800 text-[10px] py-2 px-2.5 border border-zinc-900 rounded-lg font-bold text-white truncate cursor-pointer transition-colors"
                  >
                    ▶ Natureza Macro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT SECTIONS DRILL-DOWN AND ORDERING */}
          {activeTab === "sections" && (
            <div className="space-y-5 animate-fade-in text-left">
              
              {/* SECTION PRESETS / LAYOUT QUICK CHOOSE */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">🎨 Modelos Rápidos</h3>
                <p className="text-[9px] text-zinc-500">Substitua instantaneamente todo o conteúdo por layouts conceituais:</p>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={() => applyTemplatePreset("apple_layon")}
                    className="bg-[#0b0c13] hover:bg-zinc-900 text-[10px] py-1.5 px-2 border border-zinc-850 rounded-lg font-bold text-white transition-colors cursor-pointer text-center truncate"
                  >
                    Layon Pro
                  </button>
                  <button
                    onClick={() => applyTemplatePreset("cyber_neon")}
                    className="bg-[#0b0c13] hover:bg-zinc-900 text-[10px] py-1.5 px-2 border border-zinc-850 rounded-lg font-bold text-[#00d4aa] transition-colors cursor-pointer text-center truncate"
                  >
                    Cyber Neon
                  </button>
                  <button
                    onClick={() => applyTemplatePreset("warm_studio")}
                    className="bg-[#0b0c13] hover:bg-zinc-900 text-[10px] py-1.5 px-2 border border-zinc-850 rounded-lg font-bold text-[#e18b45] transition-colors cursor-pointer text-center truncate"
                  >
                    Studio Quente
                  </button>
                </div>
              </div>

              {/* TACTILE DRAG AND DROP LIST */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">⚡ Editor de Arrastar e Soltar</h3>
                  <span className="text-[9px] text-zinc-500 font-mono">Arraste os cards para ordenar</span>
                </div>
                
                <div className="space-y-1.5 border border-zinc-900/60 p-2 bg-[#030407] rounded-xl max-h-72 overflow-y-auto lg:custom-scrollbar">
                  {sections.map((sec, idx) => {
                    const isDragged = draggedIndex === idx;
                    const isOver = dragOverIndex === idx;
                    const isSelected = selectedEditorSectionId === sec.id;
                    return (
                      <div 
                        key={sec.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        onDragEnd={handleDragEnd}
                        onDragLeave={() => setDragOverIndex(null)}
                        onClick={() => setSelectedEditorSectionId(sec.id)}
                        className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                          isDragged ? "opacity-30 border-dashed border-zinc-800 bg-zinc-900/20" : 
                          isOver ? "border-[#7c5cfc] bg-[#7c5cfc]/10 shadow-[0_0_8px_rgba(124,92,252,0.15)] animate-pulse" :
                          isSelected ? "border-[#00d4aa] bg-[#00d4aa]/5" : "bg-[#0b0c13] border-zinc-900/60 hover:border-zinc-850"
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div className="text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing p-1" title="Arraste para reordenar">
                            <GripVertical size={13} />
                          </div>
                          <input 
                            type="checkbox" 
                            checked={sec.on}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSectionOn(sec.id);
                            }}
                            className="rounded text-[#7c5cfc] focus:ring-[#7c5cfc] cursor-pointer w-3.5 h-3.5"
                          />
                          <span className="text-xs">{sec.icon}</span>
                          <span className={`text-[11px] font-bold tracking-tight ${sec.on ? "text-white" : "text-zinc-650 line-through"}`}>
                            {sec.label}
                          </span>
                        </div>
                        
                        {/* Directional reordering trigger fallbacks */}
                        <div className="flex items-center gap-1">
                          <button 
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(idx, "up");
                            }}
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-500 disabled:opacity-20 cursor-pointer"
                            title="Mover acima"
                          >
                            <ChevronUp size={11} />
                          </button>
                          <button 
                            disabled={idx === sections.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(idx, "down");
                            }}
                            className="p-1 hover:bg-zinc-800 rounded text-zinc-500 disabled:opacity-20 cursor-pointer"
                            title="Mover abaixo"
                          >
                            <ChevronDown size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION PROPERTIES CUSTOMIZER FORM */}
              {selectedEditorSectionId && (
                <div className="border border-zinc-900 p-3 bg-[#030407] rounded-xl space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                    <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>⚙️ Customizar Bloco:</span>
                      <span className="text-[#00d4aa]">{sections.find(s => s.id === selectedEditorSectionId)?.label}</span>
                    </h4>
                    <span className="text-[9px] text-zinc-600 font-mono">id: {selectedEditorSectionId}</span>
                  </div>

                  {/* Alignment and Background type selection */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">Alinhamento</label>
                      <select
                        value={sectionHeadings[selectedEditorSectionId]?.alignment || "center"}
                        onChange={(e) => {
                          const current = sectionHeadings[selectedEditorSectionId] || { title: "" };
                          setSectionHeadings({
                            ...sectionHeadings,
                            [selectedEditorSectionId]: {
                              ...current,
                              alignment: e.target.value as any
                            }
                          });
                        }}
                        className="w-full bg-[#0b0c13] border border-zinc-900 rounded py-1 px-2 text-[10px] text-white outline-none cursor-pointer"
                      >
                        <option value="left">Esquerda</option>
                        <option value="center">Centralizado</option>
                        <option value="right">Direita</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">Efeito de Fundo</label>
                      <select
                        value={sectionHeadings[selectedEditorSectionId]?.mediaType || "none"}
                        onChange={(e) => {
                          const current = sectionHeadings[selectedEditorSectionId] || { title: "" };
                          setSectionHeadings({
                            ...sectionHeadings,
                            [selectedEditorSectionId]: {
                              ...current,
                              mediaType: e.target.value as any
                            }
                          });
                        }}
                        className="w-full bg-[#0b0c13] border border-zinc-900 rounded py-1 px-2 text-[10px] text-white outline-none cursor-pointer"
                      >
                        <option value="none">Nenhum</option>
                        <option value="canvas_particles">Partículas Ativas</option>
                        <option value="neural_brain">Cérebro Cognitivo</option>
                        <option value="geometric_matrix">Matriz Geométrica</option>
                        <option value="mockup_saas">Dashboard SaaS</option>
                        <option value="avatar_grid">Atividade Social (Avatares)</option>
                      </select>
                    </div>
                  </div>

                  {/* Typography customizable fields */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">Título Principal</label>
                      <input
                        type="text"
                        value={selectedEditorSectionId === "hero" ? headline : (sectionHeadings[selectedEditorSectionId]?.title || "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (selectedEditorSectionId === "hero") setHeadline(val);
                          const current = sectionHeadings[selectedEditorSectionId] || { title: "" };
                          setSectionHeadings({
                            ...sectionHeadings,
                            [selectedEditorSectionId]: { ...current, title: val }
                          });
                        }}
                        className="w-full bg-[#0b0c13] border border-zinc-900 rounded py-1 px-2 text-[11px] text-white outline-none"
                        placeholder="Insira o título..."
                      />
                    </div>

                    {selectedEditorSectionId !== "footer" && (
                      <>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">Subtítulo / Linha de Apoio</label>
                          <input
                            type="text"
                            value={selectedEditorSectionId === "hero" ? subheadline : (sectionHeadings[selectedEditorSectionId]?.subtitle || "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (selectedEditorSectionId === "hero") setSubheadline(val);
                              const current = sectionHeadings[selectedEditorSectionId] || { title: "" };
                              setSectionHeadings({
                               ...sectionHeadings,
                               [selectedEditorSectionId]: { ...current, subtitle: val }
                              });
                            }}
                            className="w-full bg-[#0b0c13] border border-zinc-900 rounded py-1 px-2 text-[11px] text-white outline-none"
                            placeholder="Insira o subtítulo..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">Texto do Badge (Tag)</label>
                          <input
                            type="text"
                            value={sectionHeadings[selectedEditorSectionId]?.badge || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const current = sectionHeadings[selectedEditorSectionId] || { title: "" };
                              setSectionHeadings({
                               ...sectionHeadings,
                               [selectedEditorSectionId]: { ...current, badge: val }
                              });
                            }}
                            className="w-full bg-[#0b0c13] border border-zinc-900 rounded py-1 px-2 text-[11px] text-white outline-none"
                            placeholder="Insira a tag de cima..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block font-mono">Parágrafo / Descrição</label>
                          <textarea
                            value={selectedEditorSectionId === "hero" ? about : (sectionHeadings[selectedEditorSectionId]?.description || "")}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (selectedEditorSectionId === "hero") setAbout(val);
                              const current = sectionHeadings[selectedEditorSectionId] || { title: "" };
                              setSectionHeadings({
                               ...sectionHeadings,
                               [selectedEditorSectionId]: { ...current, description: val }
                              });
                            }}
                            rows={2}
                            className="w-full bg-[#0b0c13] border border-zinc-900 rounded py-1 px-2 text-[11px] text-white outline-none resize-none"
                            placeholder="Insira a descrição..."
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* List item dynamic editors */}
                  {selectedEditorSectionId === "features" && (
                    <div className="space-y-2 border-t border-zinc-900 pt-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Itens de Recursos ({features.length}/6)</span>
                        <button
                          onClick={addFeature}
                          className="text-[10px] px-2 py-0.5 bg-[#7c5cfc]/20 text-[#7c5cfc] hover:bg-[#7c5cfc]/30 rounded transition-colors cursor-pointer font-bold"
                        >
                          + Adicionar
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto lg:custom-scrollbar pr-1">
                        {features.map((feat, fIdx) => (
                          <div key={feat.id} className="p-2 bg-zinc-950 rounded border border-zinc-900 space-y-1 text-[10px]">
                            <div className="flex items-center justify-between gap-1">
                              <input
                                type="text"
                                value={feat.title}
                                onChange={(e) => {
                                  const updated = [...features];
                                  updated[fIdx].title = e.target.value;
                                  setFeatures(updated);
                                }}
                                className="bg-black border border-zinc-900 rounded px-1 py-0.5 text-white flex-1 outline-none text-[10px]"
                                placeholder="Título"
                              />
                              <button
                                onClick={() => removeFeature(feat.id)}
                                className="text-red-500 hover:text-red-400 text-[10px] font-mono cursor-pointer px-1"
                              >
                                Excluir
                              </button>
                            </div>
                            <textarea
                              value={feat.desc}
                              onChange={(e) => {
                                const updated = [...features];
                                updated[fIdx].desc = e.target.value;
                                setFeatures(updated);
                              }}
                              rows={1}
                              className="w-full bg-black border border-zinc-900 rounded px-1 py-0.5 text-zinc-400 outline-none text-[9px] resize-none"
                              placeholder="Foco de valor..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEditorSectionId === "stats" && (
                    <div className="space-y-2 border-t border-zinc-900 pt-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#00d4aa] font-mono">Métricas / Stats ({stats.length}/4)</span>
                        <button
                          onClick={addStat}
                          className="text-[10px] px-2 py-0.5 bg-[#00d4aa]/20 text-[#00d4aa] hover:bg-[#00d4aa]/30 rounded transition-colors cursor-pointer font-bold"
                        >
                          + Adicionar
                        </button>
                      </div>
                      <div className="space-y-1 max-h-36 overflow-y-auto lg:custom-scrollbar pr-1">
                        {stats.map((st, sIdx) => (
                          <div key={st.id} className="p-2 bg-zinc-950 rounded border border-zinc-900 space-y-1 text-[10px]">
                            <div className="flex items-center justify-between gap-1">
                              <input
                                type="text"
                                value={st.val}
                                onChange={(e) => {
                                  const updated = [...stats];
                                  updated[sIdx].val = e.target.value;
                                  setStats(updated);
                                }}
                                className="bg-black border border-zinc-900 rounded px-1 py-0.5 text-white w-20 outline-none text-[10px]"
                                placeholder="ex: 14ms"
                              />
                              <input
                                type="text"
                                value={st.label}
                                onChange={(e) => {
                                  const updated = [...stats];
                                  updated[sIdx].label = e.target.value;
                                  setStats(updated);
                                }}
                                className="bg-black border border-zinc-900 rounded px-1 py-0.5 text-zinc-300 flex-1 outline-none text-[10px]"
                                placeholder="Estatística"
                              />
                              <button
                                onClick={() => removeStat(st.id)}
                                className="text-red-500 hover:text-red-400 font-mono text-[10px] cursor-pointer px-1"
                              >
                                Excluir
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedEditorSectionId === "testimonials" && (
                    <div className="space-y-2 border-t border-zinc-900 pt-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400 font-mono">Depoimentos ({testimonials.length}/4)</span>
                        <button
                          onClick={addTestimonial}
                          className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded transition-colors cursor-pointer font-bold"
                        >
                          + Adicionar
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto lg:custom-scrollbar pr-1">
                        {testimonials.map((t, tIdx) => (
                          <div key={t.id} className="p-2 bg-zinc-950 rounded border border-zinc-900 space-y-1 text-[10px]">
                            <div className="flex items-center justify-between gap-1.5">
                              <input
                                type="text"
                                value={t.author}
                                onChange={(e) => {
                                  const updated = [...testimonials];
                                  updated[tIdx].author = e.target.value;
                                  setTestimonials(updated);
                                }}
                                className="bg-black border border-zinc-900 rounded px-1 py-0.5 text-white flex-1 outline-none text-[10px]"
                                placeholder="Autor"
                              />
                              <input
                                type="text"
                                value={t.role}
                                onChange={(e) => {
                                  const updated = [...testimonials];
                                  updated[tIdx].role = e.target.value;
                                  setTestimonials(updated);
                                }}
                                className="bg-black border border-zinc-900 rounded px-1 py-0.5 text-zinc-400 w-24 outline-none text-[9px]"
                                placeholder="Cargo"
                              />
                              <button
                                onClick={() => removeTestimonial(t.id)}
                                className="text-red-500 hover:text-red-400 text-[10px] cursor-pointer"
                              >
                                Excluir
                              </button>
                            </div>
                            <textarea
                              value={t.quote}
                              onChange={(e) => {
                                const updated = [...testimonials];
                                updated[tIdx].quote = e.target.value;
                                setTestimonials(updated);
                              }}
                              rows={1.5}
                              className="w-full bg-black border border-zinc-900 rounded px-1 py-0.5 text-zinc-350 outline-none text-[9px] resize-none"
                              placeholder="Depoimento..."
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* FRAMER MOTION PRESETS SELECTION */}
              <div className="border-t border-zinc-900 pt-4 space-y-3">
                <h3 className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">🎬 Animações Framer Motion</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Efeito de Revelação (Scrolly)</label>
                  <select 
                    value={animStyle}
                    onChange={(e) => setAnimStyle(e.target.value)}
                    className="w-full bg-[#030407] border border-zinc-900 rounded-lg py-1.5 px-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="fade-up">Fade + Slide Up (Efeito Flutuante Tradicional)</option>
                    <option value="fade">Apenas Fade Simples (Limpo)</option>
                    <option value="scale">Ampliar + Revelar (Escala Cinemática)</option>
                    <option value="slide-left">Deslizar da Esquerda</option>
                    <option value="slide-right">Deslizar da Direita</option>
                    <option value="blur-in">Revelação Desfocada (Luxury Blur In)</option>
                    <option value="rotate-in">Rotação Spring Orgânica</option>
                    <option value="flip-y">3D Flip Vertical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Velocidade de Transição</span>
                    <span className="font-mono text-[#7c5cfc]">{animSpeed}s</span>
                  </div>
                  <input 
                    type="range" 
                    min={0.3} 
                    max={2.0} 
                    step={0.1}
                    value={animSpeed} 
                    onChange={(e) => setAnimSpeed(parseFloat(e.target.value))}
                    className="w-full accent-[#7c5cfc] cursor-pointer"
                  />
                </div>
              </div>

              {/* CODE EXPORT & INTEGRATION PANEL - REACT + TAILWIND */}
              <div className="border border-zinc-900 p-3 bg-zinc-950/80 rounded-xl space-y-3.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold tracking-tight text-white uppercase font-mono">⚛️ Exportar (React + Tailwind)</span>
                  </div>
                  <button
                    onClick={() => {
                      const code = generateReactTailwindCode(buildLandingPageObject(), animStyle, animSpeed);
                      navigator.clipboard.writeText(code).then(() => {
                        setIsCopiedCode(true);
                        setTimeout(() => setIsCopiedCode(false), 2000);
                      });
                    }}
                    className="text-[10px] py-1 px-2.5 bg-[#7c5cfc]/20 hover:bg-[#7c5cfc]/35 text-[#7c5cfc] rounded font-mono border border-[#7c5cfc]/10 hover:border-[#7c5cfc]/30 cursor-pointer transition-all font-bold"
                  >
                    {isCopiedCode ? "✓ Copiado!" : "Copiar Código"}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Copie o componente de página completa React 18+ com animações Framer Motion e estilos Tailwind prontos para produção.
                </p>
                <div className="relative rounded-lg overflow-hidden border border-zinc-900 bg-[#020204]">
                  <pre className="text-[9px] text-zinc-500 font-mono p-2.5 h-28 overflow-y-auto lg:custom-scrollbar leading-relaxed">
                    {generateReactTailwindCode(buildLandingPageObject(), animStyle, animSpeed)}
                  </pre>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Generate triggers footer */}
        <div className="p-5 border-t border-zinc-900 bg-[#07070a]/80 flex-shrink-0">
          <button
            onClick={handleGenerateHtmlPage}
            disabled={isGenerating}
            className="w-full relative py-3.5 px-6 rounded-xl font-bold text-white text-xs tracking-wider uppercase bg-gradient-to-r from-[#7c5cfc] to-[#00d4aa] disabled:opacity-50 hover:shadow-lg hover:shadow-[#7c5cfc]/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-250 cursor-pointer disabled:cursor-not-allowed block overflow-hidden"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <RotateCw size={14} className="animate-spin" />
                Gerando portal...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5 font-mono">
                <Sparkles size={14} className="animate-pulse" />
                ✦ GERAR LANDING PAGE COM IA ✦
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ════════ WORKSPACE VISUALIZADOR PRINCIPAL ════════ */}
      <main className="flex-1 flex flex-col min-w-0 lg:overflow-hidden relative h-auto lg:h-full">
        
        {/* Top toolbar */}
        <div className="p-4 bg-[#0a0b12] border-b border-zinc-900 flex flex-wrap items-center justify-between gap-4 relative z-10">
          
          {/* Viewport resizing handles */}
          <div className="flex items-center gap-1 bg-[#030407] p-1.5 rounded-full border border-zinc-900">
            {[
              { id: "desktop", icon: <Monitor size={12} />, title: "Desktop Monitor" },
              { id: "tablet", icon: <Tablet size={12} />, title: "Tablet Viewport" },
              { id: "mobile", icon: <Smartphone size={12} />, title: "Mobile Shield" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setDevice(item.id as any)}
                className={`py-1.5 px-3 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  device === item.id 
                    ? "bg-white text-black font-extrabold shadow" 
                    : "text-zinc-500 hover:text-white"
                }`}
                title={item.title}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.id}</span>
              </button>
            ))}
          </div>

          {/* Canal de Visualização Switcher */}
          <div className="flex items-center gap-1 bg-[#030407] p-1 rounded-full border border-zinc-900">
            {[
              { id: "react", label: "⚛️ React Preview", title: "Preview interativo com Framer Motion (Real-time)" },
              { id: "html", label: "🌐 HTML Produção", title: "Página estática compilada com GSAP" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setPreviewMode(item.id as any)}
                className={`py-1.5 px-3.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  previewMode === item.id 
                    ? "bg-[#7c5cfc] text-white font-extrabold shadow" 
                    : "text-zinc-500 hover:text-white"
                }`}
                title={item.title}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* URL simulated showcase */}
          <div className="flex-1 min-w-[150px] max-w-[320px] bg-[#030407] border border-zinc-900 text-zinc-505 font-mono text-[10px] py-1.5 px-4.5 rounded-full text-center truncate select-none">
            {generatedHtml ? `https://${brandName.toLowerCase().replace(/\s+/g, "")}.vercel.app` : " — aguardando comando de geração por inteligência — "}
          </div>

          {/* Core actions triggers */}
          <div className="flex items-center gap-2">
            <button
              disabled={!generatedHtml}
              onClick={() => setIsFullscreenModal(true)}
              className="py-1.5 px-3.5 bg-zinc-900 hover:bg-[#7c5cfc]/20 hover:border-[#7c5cfc] rounded-lg text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5 uppercase font-mono tracking-wider"
              title="Expandir para Tela Cheia Imersiva"
            >
              <Maximize2 size={11} />
              Expandir Preview
            </button>
            <button
              disabled={!generatedHtml}
              onClick={copyGeneratedCode}
              className="py-1.5 px-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5 uppercase font-mono tracking-wider"
            >
              <Copy size={11} />
              Copiar HTML
            </button>
            <button
              disabled={!generatedHtml}
              onClick={downloadGeneratedHtml}
              className="py-1.5 px-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 hover:text-white disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5 uppercase font-mono tracking-wider"
            >
              <Download size={11} />
              Baixar Código
            </button>
            <button
              disabled={!generatedHtml}
              onClick={openGeneratedHtmlInTab}
              className="py-1.5 px-3.5 bg-zinc-900 hover:bg-[#7c5cfc] hover:border-[#7c5cfc] hover:text-white border border-zinc-800 rounded-lg text-xs font-bold text-zinc-300 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5 uppercase font-mono tracking-wider"
            >
              <ExternalLink size={11} />
              Abrir
            </button>
          </div>
        </div>

        {/* Live Preview Area or Standby state */}
        <div className="flex-1 overflow-auto bg-[#07070a]/70 p-6 flex justify-center items-start lg:custom-scrollbar">
          
          <div className={`transition-all duration-300 ${
            device === "mobile" 
              ? "w-[390px] h-[760px]" 
              : device === "tablet" 
              ? "w-[768px] h-[900px]" 
              : "w-full max-w-[1280px] h-[550px] lg:h-full"
          } rounded-2xl overflow-hidden border border-zinc-900/80 shadow-2xl bg-zinc-950 flex flex-col relative`}>

            {previewMode === "react" ? (
              <div className="flex-1 overflow-y-auto lg:custom-scrollbar select-none text-left bg-[#050510] relative">
                <PreviewFrame 
                  page={buildLandingPageObject()}
                  deviceType={device}
                  selectedSectionId={selectedEditorSectionId}
                  onSelectSection={(id) => setSelectedEditorSectionId(id)}
                  onUpdateSectionText={(id, fields) => {
                    setSectionHeadings(prev => {
                      const current = prev[id] || { title: "" };
                      return {
                        ...prev,
                        [id]: {
                          ...current,
                          ...fields
                        }
                      };
                    });
                    
                    // Sync up hero states
                    if (id === "hero") {
                      if (fields.title !== undefined) setHeadline(fields.title);
                      if (fields.subtitle !== undefined) setSubheadline(fields.subtitle);
                      if (fields.description !== undefined) setAbout(fields.description);
                    }
                  }}
                  simulatedScroll={0}
                  animStyle={animStyle}
                  animSpeed={animSpeed}
                />
              </div>
            ) : !generatedHtml ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-radial-gradient">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7c5cfc]/20 to-[#00d4aa]/20 border border-zinc-850 flex items-center justify-center text-3xl">
                    🚀
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00d4aa] rounded-full border-2 border-zinc-950 animate-ping" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00d4aa] rounded-full border-2 border-zinc-950" />
                </div>
                <h3 className="text-base font-bold font-mono tracking-tight text-white mb-2">Canal HTML de Exportação</h3>
                <p className="text-xs text-zinc-400 max-w-[340px] leading-relaxed mb-4">
                  Clique no botão do rodapé lateral **✦ GERAR LANDING PAGE COM IA ✦** para compilar o código estático final integrado ao GSAP e players nativos.
                </p>
                <div className="bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-900 text-[10px] font-mono text-zinc-500">
                  Canal de Produção / Vercel Sandbox v3.5
                </div>
              </div>
            ) : (
              <>
                <iframe 
                  ref={iframeRef}
                  className="w-full h-full border-0 bg-transparent block"
                  title="Google AI Studio Live Visualizer"
                />

                {/* Real-time Video Sync Diagnostic HUD Overlay */}
                <div className="absolute bottom-4 right-4 z-40 max-w-sm pointer-events-auto">
                  {!isDiagnosticHudOpen ? (
                    <button
                      onClick={() => setIsDiagnosticHudOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-black/90 hover:bg-[#7c5cfc]/20 hover:border-[#7c5cfc] border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300 rounded-lg shadow-2xl cursor-pointer"
                    >
                      <Activity size={12} className="text-green-400 animate-pulse" />
                      ABRIR DIAGNÓSTICO DE VÍDEO
                    </button>
                  ) : (
                    <div className="w-[330px] bg-black/95 border border-[#7c5cfc]/30 rounded-2xl p-4 shadow-2xl font-mono text-[9px] text-zinc-300 space-y-3 backdrop-blur-md">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                          <span className="font-extrabold text-white text-[10px] tracking-wider">VIDEO-SYNC CORE v1.2</span>
                        </div>
                        <button
                          onClick={() => setIsDiagnosticHudOpen(false)}
                          className="text-zinc-500 hover:text-white px-1 font-bold cursor-pointer"
                        >
                          [ FECHAR ]
                        </button>
                      </div>

                      {/* Stats table */}
                      <div className="grid grid-cols-2 gap-2 text-[9px]">
                        <div className="bg-[#030407] p-2 rounded-lg border border-zinc-900">
                          <span className="text-zinc-500 block text-[8px]">PROG. SCROLL</span>
                          <span className="text-white font-bold text-xs">
                            {((diagnosticScrollY / (diagnosticMaxScroll || 1)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="bg-[#030407] p-2 rounded-lg border border-zinc-900">
                          <span className="text-zinc-500 block text-[8px]">PROG. VÍDEO</span>
                          <span className="text-white font-bold text-xs">
                            {diagnosticVideoDuration > 0 ? ((diagnosticVideoTime / diagnosticVideoDuration) * 100).toFixed(1) : "0.0"}%
                          </span>
                        </div>
                        <div className="bg-[#030407] p-2 rounded-lg border border-zinc-900">
                          <span className="text-zinc-500 block text-[8px]">CURRENT TIME</span>
                          <span className="text-[#00d4aa] font-bold text-xs">
                            {diagnosticVideoTime.toFixed(2)}s <span className="text-zinc-600 block text-[8px]">total: {diagnosticVideoDuration.toFixed(1)}s</span>
                          </span>
                        </div>
                        <div className="bg-[#030407] p-2 rounded-lg border border-[#7c5cfc]/10">
                          <span className="text-zinc-500 block text-[8px]">SCROLL Y</span>
                          <span className="text-[#7c5cfc] font-bold text-xs">
                            {diagnosticScrollY.toFixed(0)}px <span className="text-zinc-650 block text-[8px]">max: {diagnosticMaxScroll.toFixed(0)}px</span>
                          </span>
                        </div>
                      </div>

                      {/* Sync Status bar */}
                      <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900 flex justify-between items-center">
                        <span className="text-zinc-500 text-[8px] uppercase tracking-wider">STATUS DE REDE & SYNC</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] tracking-tight font-bold ${
                          diagnosticVideoStatus.includes("✓") 
                            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                            : "bg-[#7c5cfc]/10 text-[#7c5cfc] border border-[#7c5cfc]/20"
                        }`}>
                          {diagnosticVideoStatus}
                        </span>
                      </div>

                      {/* Canvas correlation visualizer */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[8px] text-zinc-500 font-bold uppercase">
                          <span>GRÁFICO DE CORRELAÇÃO (Time / Scroll)</span>
                          <span className="text-green-500 font-mono tracking-tighter">DIAGNOSTICO REAIS</span>
                        </div>
                        <div className="relative bg-[#020202] h-20 border border-zinc-900 rounded-lg overflow-hidden flex flex-col justify-end">
                          {/* Grid lines */}
                          <div className="absolute inset-x-0 top-1/2 border-t border-zinc-950/80" />
                          <div className="absolute inset-y-0 left-1/2 border-l border-zinc-950/80" />

                          {/* Ideal correlation diagonal */}
                          <div className="absolute inset-0 pointer-events-none">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                              {/* Ideal dashed line */}
                              <line x1="0" y1="100%" x2="100%" y2="0" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="2,2" strokeWidth="1" />
                              
                              {/* Current coordinates trace */}
                              {(() => {
                                const scrollPct = (diagnosticScrollY / (diagnosticMaxScroll || 1));
                                const videoPct = diagnosticVideoDuration > 0 ? (diagnosticVideoTime / diagnosticVideoDuration) : 0;
                                
                                const x = `${scrollPct * 100}%`;
                                const y = `${100 - (videoPct * 100)}%`;
                                return (
                                  <>
                                    <line x1="0" y1="100%" x2={x} y2={y} stroke="rgba(124, 92, 252, 0.4)" strokeWidth="1" />
                                    <circle cx={x} cy={y} r="4.5" fill="#00d4aa" className="animate-pulse" />
                                    <circle cx={x} cy={y} r="2" fill="#fff" />
                                  </>
                                );
                              })()}
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Console developer tracker logs list */}
        {logsList.length > 0 && (
          <div className="absolute bottom-16 right-6 w-80 bg-zinc-950/95 border border-zinc-900 rounded-xl p-4.5 shadow-2xl relative z-30 font-mono text-[10px] space-y-2 max-h-44 overflow-y-auto custom-scrollbar backdrop-blur">
            <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-900 pb-1.5">
              <span>CONTROLLER REQUISITIONS</span>
              <button onClick={() => setLogsList([])} className="hover:text-white cursor-pointer uppercase text-[8px] font-bold">Limpar</button>
            </div>
            <div className="space-y-1">
              {logsList.map((log, idx) => (
                <div key={idx} className="text-zinc-500 flex gap-1.5 items-start">
                  <span className="text-[#7c5cfc]">&gt;</span>
                  <span className="text-zinc-300">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom status indicator bar */}
        <div className="h-10 bg-[#0a0b12] border-t border-zinc-900 px-5 flex items-center justify-between text-[11px] text-zinc-500 select-none flex-shrink-0 relative z-10">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${
              statusType === "ok" 
                ? "bg-[#00d4aa]" 
                : statusType === "loading" 
                ? "bg-[#7c5cfc] animate-ping" 
                : "bg-red-500"
            }`} />
            <span className="font-medium text-zinc-400">{statusMessage}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            {tokenCount !== null ? (
              <span>Calculados: {tokenCount.toLocaleString()} tokens</span>
            ) : (
              <span>Gemini 2.5 Engine</span>
            )}
          </div>
        </div>

      </main>

      {/* Immersive Fullscreen Preview Modal */}
      {isFullscreenModal && (
        <div className="fixed inset-0 bg-black/95 z-[99999] flex flex-col" style={{ backdropFilter: "blur(20px)" }}>
          {/* Modal Header */}
          <div className="p-4 bg-[#0a0b12] border-b border-zinc-900 flex flex-wrap items-center justify-between gap-4">
            
            {/* Title / Identity */}
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#7c5cfc] to-[#00d4aa] animate-pulse" />
              <div>
                <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5 font-mono uppercase">
                  Visualização Imersiva <span className="px-1.5 py-0.5 bg-[#00d4aa]/15 text-[#00d4aa] rounded text-[9px] font-mono font-bold tracking-widest border border-[#00d4aa]/20">{brandName}</span>
                </span>
              </div>
            </div>

            {/* Viewport resizing handles inside full screen mode */}
            <div className="flex items-center gap-1 bg-[#030407] p-1.5 rounded-full border border-zinc-900">
              {[
                { id: "desktop", icon: <Monitor size={12} />, title: "Desktop Monitor" },
                { id: "tablet", icon: <Tablet size={12} />, title: "Tablet Viewport" },
                { id: "mobile", icon: <Smartphone size={12} />, title: "Mobile Shield" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setDevice(item.id as any)}
                  className={`py-1.5 px-3 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    device === item.id 
                      ? "bg-white text-black font-extrabold shadow" 
                      : "text-zinc-500 hover:text-white"
                  }`}
                  title={item.title}
                >
                  {item.icon}
                  <span>{item.id}</span>
                </button>
              ))}
            </div>

            {/* Action buttons */}
            <button
              onClick={() => setIsFullscreenModal(false)}
              className="py-1.5 px-4 bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/50 rounded-lg text-xs font-bold text-zinc-300 hover:text-red-400 transition-all cursor-pointer flex items-center gap-1.5 uppercase font-mono tracking-wider"
            >
              <Minimize2 size={11} />
              Fechar Fullscreen
            </button>
          </div>

          {/* Modal Main Viewport Pane */}
          <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-[#07070a]/50">
            <div className={`transition-all duration-300 ${
              device === "mobile" 
                ? "w-[390px] h-[760px]" 
                : device === "tablet" 
                ? "w-[768px] h-[900px]" 
                : "w-full max-w-[1440px] h-full"
            } rounded-2xl overflow-hidden border border-zinc-900 shadow-2xl bg-zinc-950 flex flex-col relative`}>
              <iframe 
                srcDoc={generatedHtml || ""}
                className="w-full h-full border-0 bg-transparent block"
                title="Google AI Studio Live Visualizer FullScreen"
              />
            </div>
          </div>
        </div>
      )}

      {/* ⚙️ CONFIGURAÇÕES GLOBAIS MODAL (ENGRENAGEM) */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4 animate-fade-in" style={{ backdropFilter: "blur(12px)" }}>
          <div className="bg-[#0b0c13] border border-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-[#e1e1e6]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-900 flex items-center justify-between flex-shrink-0 bg-[#07070a]/40">
              <div className="flex items-center gap-2">
                <Settings className="text-[#7c5cfc]" size={18} />
                <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">Configurações de API & SQLite Cloud</h2>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer text-xs uppercase font-mono font-bold"
              >
                [ Fechar ]
              </button>
            </div>

            {/* Modal Body Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 md:custom-scrollbar">
              
              {/* GEMINI CREDENTIALS SECTION */}
              <div className="space-y-3.5 bg-zinc-950/40 border border-zinc-900 rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
                  <Key className="text-[#00d4aa]" size={15} />
                  <span>1. Chave da API Gemini (Opcional)</span>
                </div>
                <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                  Insira sua chave de API do Google Gemini. Se fornecida, as gerações e sugestões usarão sua chave própria, contornando limites globais.
                </p>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-bold uppercase font-mono">Gemini API Key</label>
                  <input 
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiApiKey}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setGeminiApiKey(val);
                      localStorage.setItem("layon_gemini_api_key", val);
                    }}
                    className="w-full bg-[#030407] border border-zinc-900 focus:border-[#00d4aa] rounded-lg py-2 px-3 text-xs text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* SQLITE CLOUD CONNECTION SECTION */}
              <div className="space-y-4 bg-zinc-950/40 border border-zinc-900 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
                    <Database className="text-[#7c5cfc]" size={15} />
                    <span>2. Banco de Dados SQLite Cloud</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={sqliteEnabled}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setSqliteEnabled(val);
                        localStorage.setItem("layon_sqlite_enabled", val ? "true" : "false");
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#7c5cfc] peer-checked:after:bg-white peer-checked:after:border-transparent"></div>
                  </label>
                </div>
                
                <p className="text-[10.5px] text-zinc-400 leading-relaxed">
                  Conecte seu banco de dados SQLite Cloud (hospedado em sqlitecloud.io) para salvar estruturalmente e gerenciar todas as landing pages criadas. Perfeito se for hospedar na Vercel!
                </p>

                <div className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-400 font-bold uppercase font-mono tracking-wider flex items-center gap-1">
                      <span>Link de Conexão do SQLite Cloud</span>
                      <span className="text-zinc-600 font-normal lowercase">(connection string ou URL)</span>
                    </label>
                    <input 
                      type="text"
                      placeholder="sqlitecloud://admin:senha@host.sqlite.cloud:8090/nome_do_banco?apikey=sua_chave"
                      value={sqliteConnectionString}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSqliteConnectionString(val);
                        localStorage.setItem("layon_sqlite_connstring", val);
                        parseAndApplyConnectionString(val);
                      }}
                      disabled={!sqliteEnabled}
                      className="w-full bg-[#030407] border border-zinc-900 focus:border-[#7c5cfc] rounded-lg py-2.5 px-3 text-xs text-white outline-none font-mono disabled:opacity-40"
                    />
                  </div>

                  {sqliteEnabled && (sqliteHost || sqliteDbName || sqliteApiKey) && (
                    <div className="bg-[#030407]/80 border border-zinc-900 rounded-lg p-3.5 space-y-2.5 text-[11px] font-mono">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Parâmetros Extraídos do Link:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-zinc-950 border border-zinc-900/60 rounded p-2">
                          <div className="text-[9px] text-zinc-500 uppercase font-bold">Host / Servidor</div>
                          <div className="text-zinc-300 truncate font-semibold mt-0.5" title={sqliteHost}>{sqliteHost || "---"}</div>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-900/60 rounded p-2">
                          <div className="text-[9px] text-zinc-500 uppercase font-bold">Banco (.db)</div>
                          <div className="text-zinc-300 truncate font-semibold mt-0.5" title={sqliteDbName}>{sqliteDbName || "---"}</div>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-900/60 rounded p-2">
                          <div className="text-[9px] text-zinc-500 uppercase font-bold">Chave de Acesso</div>
                          <div className="text-zinc-300 truncate font-semibold mt-0.5" title={sqliteApiKey ? "Configurada" : "Ausente"}>
                            {sqliteApiKey ? "••••••••••••••••" : "---"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {sqliteEnabled && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestDatabaseSetting}
                      disabled={isTestingDb}
                      className="w-full sm:w-auto py-1.5 px-4 bg-zinc-900 hover:bg-[#7c5cfc]/10 text-zinc-300 hover:text-white border border-zinc-800 hover:border-[#7c5cfc]/30 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isTestingDb ? "Testando Conexão..." : "Testar Conexão"}
                    </button>
                    {dbTestMessage.text && (
                      <span className={`text-[10.5px] font-medium leading-relaxed ${dbTestMessage.type === "success" ? "text-emerald-400" : "text-rose-400"}`}>
                        {dbTestMessage.text}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* LIST / MANAGE CREATED PAGES PANEL */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">💾 Páginas Criadas ({historyProjects.length})</h3>
                  <span className="text-[9px] text-[#6b6b80] font-mono">Dispositivo: {sqliteEnabled ? "Sincronizado SQLite Cloud" : "LocalStorage Regional"}</span>
                </div>

                <div className="border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/20">
                  {historyProjects.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-xs">
                      Nenhuma landing page criada ainda. Elas aparecerão aqui após você gerá-las.
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-900 max-h-[14rem] overflow-y-auto md:custom-scrollbar">
                      {historyProjects.map((proj, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-zinc-950/40 transition-colors gap-4">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-zinc-200 block truncate" title={proj.name}>
                              {proj.name}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-mono block pt-0.5">Sincronismo: {proj.date}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => {
                                setGeneratedHtml(proj.html);
                                setIsSettingsModalOpen(false);
                                addLog(`Restaurado do banco: ${proj.name}`);
                              }}
                              className="py-1 px-2.5 bg-[#7c5cfc]/10 hover:bg-[#7c5cfc] border border-[#7c5cfc]/20 hover:border-transparent text-xs text-[#b09fff] hover:text-white rounded-md font-bold font-mono transition-all cursor-pointer"
                              title="Restaurar visualizador"
                            >
                              Carregar
                            </button>
                            <button
                              onClick={() => {
                                const blob = new Blob([proj.html], { type: "text/html" });
                                const u = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = u;
                                a.download = `${proj.name.replace(/\s+/g, "_")}.html`;
                                a.click();
                                URL.revokeObjectURL(u);
                              }}
                              className="p-1 px-2.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-900 transition-colors cursor-pointer flex items-center justify-center h-7 w-7"
                              title="Download do HTML Autônomo"
                            >
                              <Download size={11} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject((proj as any).id, idx)}
                              className="p-1 text-zinc-600 hover:text-rose-400 rounded hover:bg-rose-950/20 transition-colors cursor-pointer flex items-center justify-center h-7 w-7"
                              title="Excluir página permanentemente"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0a0b12] border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-mono flex-shrink-0">
              <span>Layon Build Engine v3.1</span>
              <span>Cloud Server Connection Active</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
