/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { 
  Brain, 
  Cpu, 
  Server, 
  Zap, 
  Shield, 
  Layers, 
  Activity, 
  Sparkles, 
  Code, 
  Sliders, 
  Play, 
  Send,
  HelpCircle,
  Globe,
  Check,
  TrendingUp,
  Maximize2,
  Trash2,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  ChevronUp,
  ChevronDown,
  Edit2
} from "lucide-react";
import { LandingPage, Section, SectionItem } from "../types";

// Helper to resolve Lucide Icon dynamic string name
export function getLucideIcon(iconName?: string) {
  const map: Record<string, any> = {
    Brain, Cpu, Server, Zap, Shield, Layers, Activity, Sparkles, Code, Sliders, Play, Send,
    HelpCircle, Globe, Check, TrendingUp, Maximize2, ArrowRight
  };
  return map[iconName || ""] || Sparkles;
}

interface PreviewFrameProps {
  page: LandingPage;
  deviceType: "desktop" | "tablet" | "mobile";
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
  onUpdateSectionText: (sectionId: string, updatedFields: Partial<Section>) => void;
  simulatedScroll: number; // 0 to 100 representing scroll scrub position
  animStyle?: string;
  animSpeed?: number;
}

export default function PreviewFrame({ 
  page, 
  deviceType, 
  selectedSectionId, 
  onSelectSection,
  onUpdateSectionText,
  simulatedScroll,
  animStyle = "fade-up",
  animSpeed = 0.8
}: PreviewFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom font class mapping
  const getFontClass = () => {
    switch (page.metadata.primaryFont) {
      case "Space Grotesk": return "font-space";
      case "Outfit": return "font-outfit";
      case "Playfair Display": return "font-playfair";
      default: return "font-sans";
    }
  };

  // Styles defined by the metadata loaded dynamically
  const p = page.metadata.palette;
  const styleVariables = {
    "--page-bg": p.background || "#030303",
    "--page-text": p.text || "#ffffff",
    "--page-accent": p.accent || "#22c55e",
    "--page-secondary": p.secondary || "#0a0a0a",
  } as React.CSSProperties;

  // Animation variants for smooth staggered entrance determined dynamically
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const getItemVariants = () => {
    const duration = animSpeed;
    const ease = [0.16, 1, 0.3, 1]; // Premium apple-like cubic-bezier ease out
    
    switch (animStyle) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1, 
            transition: { duration, ease } 
          }
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { type: "spring", stiffness: 100, damping: 15, duration } 
          }
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { 
            opacity: 1, 
            x: 0, 
            transition: { duration, ease } 
          }
        };
      case "blur-in":
        return {
          hidden: { opacity: 0, filter: "blur(12px)", y: 15 },
          visible: { 
            opacity: 1, 
            filter: "blur(0px)", 
            y: 0, 
            transition: { duration, ease } 
          }
        };
      case "rotate-in":
        return {
          hidden: { opacity: 0, rotate: -8, scale: 0.95, y: 20 },
          visible: { 
            opacity: 1, 
            rotate: 0, 
            scale: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 120, damping: 14 } 
          }
        };
      case "flip-y":
        return {
          hidden: { opacity: 0, rotateX: -70, y: 30 },
          visible: { 
            opacity: 1, 
            rotateX: 0, 
            y: 0, 
            transition: { duration, ease } 
          }
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { 
            opacity: 1, 
            x: 0, 
            transition: { duration, ease } 
          }
        };
      case "fade-up":
      default:
        return {
          hidden: { opacity: 0, y: 35 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration, ease } 
          }
        };
    }
  };

  const itemVariants = getItemVariants();

  return (
    <div 
      ref={containerRef}
      style={styleVariables} 
      className={`w-full mx-auto font-sans transition-all duration-500 overflow-x-hidden text-neutral-200 select-none ${getFontClass()}`}
    >
      {/* Background radial aura */}
      <div 
        className="w-full min-h-screen py-4 px-2"
        style={{ backgroundColor: p.background }}
      >
        {/* Site Header */}
        <header className="max-w-6xl mx-auto flex items-center justify-between py-6 px-6 relative z-30 border-b border-white/5 bg-black/20 backdrop-blur-md rounded-2xl mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black font-bold tracking-tighter text-sm">
              L
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-white font-mono">
              {page.name || "Layon Devs"}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            {page.sections.map(sec => (
              <a 
                key={sec.id} 
                href={`#${sec.id}`}
                className="hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`sec-view-${sec.id}`)?.scrollIntoView({ behavior: "smooth" });
                  onSelectSection(sec.id);
                }}
              >
                {sec.title.split(" ").slice(0, 2).join(" ") || sec.type}
              </a>
            ))}
          </nav>

          <div>
            <button className="px-4 py-2 border border-white/20 hover:border-white/90 rounded-full text-[10px] uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black">
              Conectar SaaS
            </button>
          </div>
        </header>

        {/* Dynamic section loops */}
        <motion.div 
          key={page.id + "_" + page.sections.length + "_" + page.sections.map(s => s.id).join("-")}
          className="space-y-24 pb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {page.sections.map((section, idx) => {
            const isSelected = selectedSectionId === section.id;
            return (
              <motion.div
                key={section.id}
                id={`sec-view-${section.id}`}
                variants={itemVariants}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSection(section.id);
                }}
                className={`relative group rounded-[2.5rem] p-8 md:p-14 border transition-all duration-300 ${
                  isSelected 
                    ? "border-green-500/80 ring-2 ring-green-500/10 shadow-2xl bg-white/[0.02]" 
                    : "border-white/[0.04] hover:border-white/[0.15] bg-black/40"
                }`}
              >
                {/* Active Section Indicator Ribbon */}
                <div className="absolute top-4 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                    SEÇÃO {idx + 1}: {section.type.toUpperCase()}
                  </span>
                  <button 
                    title="Editar Texto Diretamente"
                    className="p-1.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded hover:bg-green-500 hover:text-black transition-colors"
                    onClick={() => onSelectSection(section.id)}
                  >
                    <Edit2 size={11} />
                  </button>
                </div>

                {/* Section Content Renderer */}
                <SectionRenderer 
                  section={section} 
                  palette={p} 
                  simulatedScroll={simulatedScroll} 
                  onUpdate={(textFields) => onUpdateSectionText(section.id, textFields)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// COUNTER NUMBER ENGINE FOR METRICS
// -----------------------------------------------------------------
function CounterNumber({ value, suffix }: { value: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const target = parseFloat(value.replace(/,/g, ""));

  useEffect(() => {
    if (isNaN(target)) return;
    const duration = 1500;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuad = (t: number) => t * (2 - t);
      const current = Math.floor(easeOutQuad(progress) * target);

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, target]);

  return (
    <span className="font-sans font-extrabold text-5xl md:text-7xl tracking-tighter text-white">
      {isNaN(target) ? value : count.toLocaleString()}{suffix}
    </span>
  );
}

// -----------------------------------------------------------------
// SECTION RENDERER ENGINE
// -----------------------------------------------------------------
interface SectionRendererProps {
  section: Section;
  palette: any;
  simulatedScroll: number;
  onUpdate: (fields: Partial<Section>) => void;
}

function SectionRenderer({ section, palette, simulatedScroll, onUpdate }: SectionRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Quick live text editing support (simulating an inline experience)
  const handleInlineChange = (e: React.FocusEvent<HTMLHeadingElement | HTMLParagraphElement>, field: keyof Section) => {
    const text = e.target.innerText;
    onUpdate({ [field]: text });
  };

  // Canvas interactive drawing loop for particles and brain
  useEffect(() => {
    if (!canvasRef.current || (section.mediaType !== "canvas_particles" && section.mediaType !== "neural_brain" && section.mediaType !== "geometric_matrix")) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 600;
    let height = canvas.height = 360;

    // Handle resizing
    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = canvas.height = 360;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; color: string }> = [];
    
    // Seed points
    if (section.mediaType === "canvas_particles") {
      const particleCount = Math.min(120, Math.floor(width / 6));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9,
          radius: Math.random() * 2 + 1,
          color: palette.accent || "#22c55e"
        });
      }
    } else if (section.mediaType === "neural_brain") {
      // Create node points in circular density shape in the center
      for (let i = 0; i < 45; i++) {
        const radius = Math.random() * 95 + 15;
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 2.5 + 1.5,
          color: i % 3 === 0 ? "#ffffff" : palette.accent
        });
      }
    } else if (section.mediaType === "geometric_matrix") {
      // Grid mesh representation
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: Math.random() * 0.6 + 0.3, // flow downwards
          radius: 1,
          color: "rgba(255, 255, 255, 0.15)"
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (section.mediaType === "canvas_particles") {
        // Render beautiful particle field responsive to user simulated scroll scrubbing
        const scrubOffset = (simulatedScroll / 100) * 150;
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 0.5;

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          p1.x += p1.vx;
          p1.y += p1.vy + (simulatedScroll > 0 ? (simulatedScroll - 50) * 0.05 : 0) * 0.05;

          // Wrap boundaries
          if (p1.x < 0) p1.x = width;
          if (p1.x > width) p1.x = 0;
          if (p1.y < 0) p1.y = height;
          if (p1.y > height) p1.y = 0;

          ctx.fillStyle = p1.color;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby nodes
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 85) {
              const alpha = (1 - dist / 85) * 0.15;
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      } else if (section.mediaType === "neural_brain") {
        // Brain nodes neural mapping
        const center = { x: width / 2, y: height / 2 };
        
        // Draw brain cortex outline effect
        ctx.beginPath();
        ctx.strokeStyle = `${palette.accent}12`;
        ctx.lineWidth = 1;
        ctx.arc(center.x, center.y, 115, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          // Slow organic pulsation
          const pulse = Math.sin(Date.now() * 0.001 + i) * 3;
          p1.x += p1.vx + (Math.sin(Date.now() * 0.002 + i) * 0.05);
          p1.y += p1.vy + (Math.cos(Date.now() * 0.002 + i) * 0.05);

          ctx.fillStyle = p1.color;
          ctx.beginPath();
          ctx.arc(p1.x, p1.y + pulse * 0.2, p1.radius, 0, Math.PI * 2);
          ctx.fill();

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 95) {
              const alpha = (1 - dist / 95) * 0.2;
              ctx.strokeStyle = `${palette.accent}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        // Pulse wave aura
        const waveRadius = (Date.now() * 0.05) % 130 + 10;
        const waveAlpha = 1 - waveRadius / 130;
        ctx.strokeStyle = `${palette.accent}${Math.floor(waveAlpha * 35).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(center.x, center.y, waveRadius, 0, Math.PI * 2);
        ctx.stroke();

      } else if (section.mediaType === "geometric_matrix") {
        // Vertical metrics streams
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          p1.y += p1.vy;
          if (p1.y > height) {
            p1.y = 0;
            p1.x = Math.random() * width;
          }

          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.fillRect(p1.x, p1.y, 1, 10);
          
          if (i % 5 === 0) {
            ctx.fillStyle = `${palette.accent}99`;
            ctx.font = "8px monospace";
            ctx.fillText(Math.floor(Math.random() * 9).toString(), p1.x - 3, p1.y);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [section.mediaType, palette.accent, simulatedScroll]);

  // Handle alignment classes
  const getAlignClass = () => {
    if (section.alignment === "center") return "items-center text-center mx-auto";
    if (section.alignment === "right") return "items-end text-right ml-auto";
    return "items-start text-left";
  };

  return (
    <div className="relative">
      <div className={`flex flex-col ${getAlignClass()} max-w-5xl`}>
        
        {/* Badge header label */}
        {section.badge && (
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] mb-6 rounded-full border"
            style={{ 
              color: palette.accent, 
              borderColor: `${palette.accent}30`, 
              backgroundColor: `${palette.accent}07` 
            }}
          >
            <Sparkles size={11} />
            {section.badge}
          </span>
        )}

        {/* Dynamic headings - interactive contentEditable */}
        <h2 
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => handleInlineChange(e, "title")}
          className="text-4xl md:text-6xl font-medium tracking-tight text-white max-w-3xl leading-[1.1] outline-none hover:bg-white/[0.04] focus:bg-white/[0.07] px-2 rounded-xl transition-all"
        >
          {section.title}
        </h2>

        {section.subtitle && (
          <h3 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleInlineChange(e, "subtitle")}
            className="text-lg md:text-2xl font-light text-zinc-400 mt-4 max-w-2xl outline-none hover:bg-white/[0.04] px-2 rounded-lg transition-all"
          >
            {section.subtitle}
          </h3>
        )}

        {section.description && (
          <p 
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleInlineChange(e, "description")}
            className="text-sm md:text-base text-zinc-500 mt-6 max-w-xl leading-relaxed outline-none hover:bg-white/[0.04] px-2 rounded-lg transition-all"
          >
            {section.description}
          </p>
        )}

        {/* Custom Visual Media Renderers based on section template */}
        {section.mediaType && section.mediaType !== "none" && (
          <div className="w-full mt-10 relative overflow-hidden rounded-2xl bg-black/40 border border-white/[0.04] min-h-[300px] flex items-center justify-center">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.01)_0%,_rgba(0,0,0,0)_80%)]" />

            {(section.mediaType === "canvas_particles" || section.mediaType === "neural_brain" || section.mediaType === "geometric_matrix") && (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <canvas ref={canvasRef} className="opacity-90 w-full h-full max-h-[360px]" />
                
                {section.mediaType === "neural_brain" && (
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <Brain className="text-white/20 animate-pulse" size={44} style={{ color: `${palette.accent}aa` }} />
                    <span className="text-[9px] font-mono text-zinc-600 mt-2 tracking-widest uppercase">CÉREBRO COGNITIVO</span>
                  </div>
                )}
              </div>
            )}

            {section.mediaType === "mockup_saas" && (
              <div className="p-4 w-full h-full">
                {/* Simulated high-fidelity premium dashboard interface */}
                <div className="w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Mock browser chrome titlebar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 bg-zinc-900/40">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 font-mono w-48 text-center truncate">
                      layon-ai-cockpit.devs
                    </div>
                    <div className="w-12" />
                  </div>
                  {/* Mock SaaS content workspace */}
                  <div className="grid grid-cols-12 gap-4 p-5 min-h-[220px]">
                    <div className="col-span-3 border-r border-zinc-900 pr-2 space-y-2">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Módulos</div>
                      {["Visão Geral", "Agente Autônomo v4", "Geração Criativa", "Métricas", "Logs"].map((t, idx) => (
                        <button
                          key={t}
                          onClick={() => setActiveTab(idx)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between relative cursor-pointer ${
                            activeTab === idx 
                              ? "text-white" 
                              : "text-zinc-500 hover:text-zinc-400"
                          }`}
                        >
                          <span className="relative z-10">{t}</span>
                          {idx === 1 && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse relative z-10" />}
                          {activeTab === idx && (
                            <motion.div 
                              layoutId="activeMockTabBg"
                              className="absolute inset-0 bg-white/10 rounded-lg"
                              transition={{ type: "spring", stiffness: 380, damping: 28 }}
                            />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="col-span-9 space-y-4">
                      {activeTab === 0 && (
                        <>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-900">
                              <span className="text-[9px] text-zinc-500 font-mono block">EFICIÊNCIA</span>
                              <span className="text-lg font-space font-medium text-white">99.86%</span>
                            </div>
                            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-900">
                              <span className="text-[9px] text-zinc-500 font-mono block">CHAMADOS IA</span>
                              <span className="text-lg font-space font-medium text-white">12,482/s</span>
                            </div>
                            <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-900">
                              <span className="text-[9px] text-zinc-500 font-mono block">GPU CORE TEMP</span>
                              <span className="text-lg font-space font-medium text-green-500">42°C</span>
                            </div>
                          </div>
                          <div className="bg-zinc-900/20 p-3.5 rounded-xl border border-zinc-900/80 text-xs text-zinc-400 space-y-1.5 font-mono text-[10px]">
                            <div className="text-zinc-600">&gt; npm run core-node-sync</div>
                            <div className="text-green-400">[CORRET] Nodes de Inteligência sincronizados elásticos.</div>
                            <div className="text-zinc-500">[LOG] Geração de landing page responsiva concluída com 0 erros.</div>
                          </div>
                        </>
                      )}

                      {activeTab === 1 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white">Configurar Agente Autônomo</span>
                            <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-mono">ATIVO</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 leading-normal">
                            Este agente lê interações em canais digitais de forma autônoma e executa táticas de vendas e SEO imediatamente para seu negócio.
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="bg-zinc-900 p-2 rounded border border-zinc-850">Raciocínio Profundo: <span className="text-white font-semibold">120b</span></div>
                            <div className="bg-zinc-900 p-2 rounded border border-zinc-850">Latência do Trigger: <span className="text-white font-semibold">8ms</span></div>
                          </div>
                        </div>
                      )}

                      {activeTab === 2 && (
                        <div className="space-y-3">
                          <span className="text-xs font-semibold text-white">Conteúdo Dinâmico Gerado</span>
                          <div className="grid grid-cols-3 gap-2">
                            {["Banner Copy", "Acento Neon", "Copy Secundária"].map((v, i) => (
                              <div key={v} className="bg-white/[0.02] border border-white/5 p-2 rounded-lg text-center">
                                <span className="text-[10px] text-white block">{v}</span>
                                <span className="text-[8px] text-zinc-500 block font-mono">Variante #{i+1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 3 && (
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-white">Análise Gráfica Próxima Geração</span>
                          <div className="h-16 flex items-end gap-1.5 bg-black/60 p-2 rounded border border-zinc-900">
                            {[20, 45, 30, 80, 50, 95, 60, 40, 110, 85, 120, 90, 140, 100].map((h, i) => (
                              <div 
                                key={i} 
                                className="flex-1 bg-green-500/70 rounded-sm hover:bg-green-400 transition-colors cursor-pointer relative group/bar"
                                style={{ height: `${(h / 140) * 100}%` }}
                              >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] bg-zinc-900 text-white px-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity font-mono z-10">
                                  {h}xp
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeTab === 4 && (
                        <div className="font-mono text-[9px] text-zinc-500 bg-black/80 p-3 h-28 overflow-y-auto rounded-xl border border-zinc-900 space-y-1">
                          <div>[19:28:10] &lt;SYSTEM&gt; Instantiating DeepMind models...</div>
                          <div className="text-green-500">[19:28:11] &lt;MODEL_OK&gt; Response schema verified: Perfect compliance</div>
                          <div>[19:28:12] &lt;STATION_SYNC&gt; Database state saved local db.json successfully.</div>
                          <div className="text-blue-400">[19:28:15] &lt;SaaS&gt; Preload 200 frame images completely fetched...</div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            )}

            {section.mediaType === "avatar_grid" && (
              <div className="p-8 flex flex-col items-center">
                <div className="flex -space-x-4 mb-4">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  ].map((src, i) => (
                    <img key={i} src={src} className="w-12 h-12 rounded-full border-2 border-zinc-950 object-cover" alt="User avatar" />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 font-medium">Usado de forma impecável por mais de 4,200 engenheiros digitais.</p>
              </div>
            )}
          </div>
        )}

        {/* Dynamic section-specific components renders */}
        {/* Bento/Features rendering */}
        {section.items && (section.type === "technology" || section.type === "features_grid") && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-12">
            {section.items.map((item, idx) => {
              const IconComp = getLucideIcon(item.icon);
              return (
                <motion.div 
                  key={item.id}
                  whileHover="hover"
                  variants={{
                    hover: {
                      y: -6,
                      scale: 1.015,
                      borderColor: `${palette.accent}50`,
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      boxShadow: `0 15px 30px -10px ${palette.accent}15`
                    }
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="p-8 bg-zinc-950/65 border border-white/[0.04] rounded-3xl cursor-pointer select-none"
                >
                  <motion.div 
                    variants={{
                      hover: { rotate: 8, scale: 1.1 }
                    }}
                    transition={{ type: "spring", stiffness: 450, damping: 15 }}
                    className="w-10 h-10 rounded-xl mb-6 flex items-center justify-center border border-white/5"
                    style={{ backgroundColor: `${palette.secondary}99` }}
                  >
                    <IconComp size={18} style={{ color: palette.accent }} />
                  </motion.div>
                  <span className="text-[10px] font-mono text-zinc-600 block mb-2 uppercase">0{idx + 1} — RESOURCE</span>
                  <h4 className="text-lg font-space font-semibold text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pricing rendering */}
        {section.items && section.type === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-12 max-w-4xl">
            {section.items.map((item) => (
              <div 
                key={item.id}
                className="relative p-10 bg-zinc-950/65 border border-white/[0.04] rounded-[2rem] flex flex-col justify-between"
              >
                {item.badge && (
                  <span className="absolute top-6 right-6 px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-mono rounded">
                    {item.badge}
                  </span>
                )}
                <div>
                  <h4 className="text-xl font-space font-medium text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-zinc-500 mb-6">{item.description}</p>
                  
                  {item.price && (
                    <div className="flex items-baseline gap-2 mb-8 border-b border-white/5 pb-6">
                      <span className="text-4xl font-space font-bold text-white">{item.price}</span>
                      <span className="text-xs text-zinc-500 font-mono">/ mensal</span>
                    </div>
                  )}

                  {item.features && (
                    <ul className="space-y-3.5 mb-8">
                      {item.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-zinc-400">
                          <Check size={14} className="text-green-500 stroke-[3px]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button 
                  className="w-full py-3 rounded-xl text-xs font-semibold tracking-wider transition-all border mt-4"
                  style={{ 
                    borderColor: palette.accent, 
                    backgroundColor: `${palette.accent}10`, 
                    color: palette.accent 
                  }}
                >
                  Conectar Licença
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Power Section special layout rendering (Scrolled keyphrases) */}
        {section.items && section.type === "power" && (
          <div className="flex flex-col gap-5 w-full mt-12 py-10 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
            
            {section.items.map((item, idx) => {
              const isActive = (simulatedScroll / 100) * section.items!.length >= idx;
              return (
                <div 
                  key={item.id}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl border transition-all duration-500 min-h-[140px] z-10 ${
                    isActive 
                      ? "bg-zinc-950/90 border-green-500/40 opacity-100 scale-100 shadow-xl" 
                      : "bg-black/20 border-white/[0.02] opacity-40 scale-95"
                  }`}
                >
                  <span className="text-[10px] font-mono text-zinc-600 block mb-2 tracking-[0.3em]">PASSO 0{idx + 1}</span>
                  <h3 className="text-3xl md:text-5xl font-space font-bold text-white tracking-widest mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 text-center max-w-sm mt-1">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Numbers Section rendering */}
        {section.items && section.type === "numbers" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden w-full mt-12 animate-fade-in">
            {section.items.map((item) => {
              const match = item.price?.match(/^([\d.,]+)(.*)$/);
              const numVal = match ? match[1] : item.price || "0";
              const suffixVal = match ? match[2] : "";
              return (
                <div 
                  key={item.id}
                  className="bg-black/95 p-8 md:p-12 flex flex-col justify-center items-center text-center hover:bg-neutral-900/60 transition-colors group"
                >
                  <div className="flex items-baseline justify-center">
                    <CounterNumber value={numVal} suffix={suffixVal} />
                  </div>
                  <span className="text-xs md:text-sm text-zinc-500 mt-3 font-light uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Render buttons if any are defined */}
        {section.buttons && section.buttons.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12 z-20">
            {section.buttons.map((btn, i) => {
              const isPrimary = btn.variant === "primary";
              const isOutline = btn.variant === "outline";
              return (
                <motion.button
                  key={i}
                  whileHover="hover"
                  whileTap={{ scale: 0.97 }}
                  variants={{
                    hover: {
                      scale: 1.05,
                      y: -2,
                      boxShadow: isPrimary 
                        ? "0 10px 25px -5px rgba(255,255,255,0.2), 0 8px 10px -6px rgba(255,255,255,0.2)" 
                        : `0 10px 25px -5px ${palette.accent}20, 0 8px 10px -6px ${palette.accent}20`
                    }
                  }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  className={`px-6 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase flex items-center gap-2 select-none ${
                    isPrimary 
                      ? "bg-white text-black hover:bg-zinc-200 shadow-lg cursor-pointer" 
                      : isOutline 
                      ? "border border-white/20 text-white cursor-pointer"
                      : "text-zinc-400 hover:text-white cursor-pointer"
                  }`}
                >
                  <span>{btn.text}</span>
                  <motion.span
                    variants={{
                      hover: { x: 4, scale: 1.1 }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <ArrowRight size={14} />
                  </motion.span>
                </motion.button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
