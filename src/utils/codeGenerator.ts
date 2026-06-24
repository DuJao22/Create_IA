/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LandingPage, Section } from "../types";

export function generateReactTailwindCode(page: LandingPage, animStyle: string, animSpeed: number): string {
  const { name, metadata, sections } = page;
  const { background, text, accent, secondary } = metadata.palette;
  const primaryFont = metadata.primaryFont;

  // Map font name to safe tailwind or system fallbacks
  const fontClass = primaryFont === "Space Grotesk" ? "font-sans" : "font-sans";

  return `import React, { useState } from "react";
import { motion } from "framer-motion"; // or "motion/react"
import { 
  Sparkles, 
  Cpu, 
  Server, 
  Layers, 
  Check, 
  Zap, 
  Globe, 
  Activity, 
  ArrowRight, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  HelpCircle 
} from "lucide-react";

// ==========================================
// CONFIGURATION AND PALETTE
// ==========================================
// Primary Font: ${primaryFont}
// Palette: 
//   Background: ${background}
//   Text: ${text}
//   Accent: ${accent}
//   Secondary Accent: ${secondary}
// ==========================================

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Framer Motion Animation Variants (Speed: ${animSpeed}s)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const getItemVariants = () => {
    const duration = ${animSpeed};
    const ease = [0.16, 1, 0.3, 1];
    
    switch ("${animStyle}") {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, ease } }
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15, duration } }
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration, ease } }
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration, ease } }
        };
      case "blur-in":
        return {
          hidden: { opacity: 0, filter: "blur(12px)", y: 15 },
          visible: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration, ease } }
        };
      case "rotate-in":
        return {
          hidden: { opacity: 0, rotate: -6, scale: 0.95, y: 15 },
          visible: { opacity: 1, rotate: 0, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
        };
      case "flip-y":
        return {
          hidden: { opacity: 0, rotateX: -60, y: 20 },
          visible: { opacity: 1, rotateX: 0, y: 0, transition: { duration, ease } }
        };
      case "fade-up":
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration, ease } }
        };
    }
  };

  const itemVariants = getItemVariants();

  return (
    <div 
      className="min-h-screen text-white overflow-x-hidden selection:bg-purple-500 selection:text-white"
      style={{ 
        backgroundColor: "${background}", 
        color: "${text}",
        fontFamily: "'${primaryFont}', system-ui, sans-serif"
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* HEADER BAR */}
        <header className="flex justify-between items-center mb-16 border-b border-white/5 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-extrabold tracking-widest text-white">
              ${name.charAt(0).toUpperCase()}
            </div>
            <span className="font-extrabold tracking-tight text-white text-lg">${name}</span>
          </div>
          <button 
            className="text-xs px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white transition-all duration-300"
            onClick={() => {
              const ctaEl = document.getElementById("sec-cta");
              if (ctaEl) ctaEl.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Fale Conosco
          </button>
        </header>

        {/* SECTION INJECTIONS */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-24"
        >
${sections.map((sec, sIdx) => {
  const alignmentClass = sec.alignment === "center" ? "text-center items-center justify-center" : sec.alignment === "right" ? "text-right items-end justify-end" : "text-left items-start justify-start";
  const flexColAlign = sec.alignment === "center" ? "mx-auto" : sec.alignment === "right" ? "ml-auto" : "mr-auto";
  
  let sectionContent = "";

  if (sec.type === "hero") {
    sectionContent = `          {/* HERO SECTION */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants} 
            className="flex flex-col ${alignmentClass} min-h-[70vh] justify-center relative py-12"
          >
            {sec.badge && (
              <span className="px-3.5 py-1.5 text-[9px] font-bold tracking-widest text-white rounded-full border border-white/10 bg-white/5 uppercase mb-6">
                {sec.badge}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight mb-6">
              {sec.title}
            </h1>
            {sec.subtitle && (
              <p className="text-zinc-400 text-sm md:text-lg max-w-2xl font-medium leading-relaxed mb-6">
                {sec.subtitle}
              </p>
            )}
            {sec.description && (
              <p className="text-zinc-500 text-xs md:text-sm max-w-xl leading-relaxed mb-8">
                {sec.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 ${sec.alignment === "center" ? "justify-center" : sec.alignment === "right" ? "justify-end" : "justify-start"}">
              <button 
                className="px-8 py-4 rounded-full text-xs font-bold bg-white text-black hover:bg-zinc-200 shadow-xl transition-all duration-300"
                onClick={() => document.getElementById("sec-cta")?.scrollIntoView({ behavior: "smooth" })}
              >
                Começar Agora
              </button>
              <button 
                className="px-8 py-4 rounded-full text-xs font-bold border border-white/10 text-white hover:bg-white/5 transition-all duration-300"
                onClick={() => {
                  const items = document.querySelectorAll("section");
                  if (items[1]) items[1].scrollIntoView({ behavior: "smooth" });
                }}
              >
                Conhecer Mais
              </button>
            </div>
          </motion.section>`;
  } else if (sec.type === "vision") {
    sectionContent = `          {/* VISION STATEMENT */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="flex flex-col ${alignmentClass} py-12 border-t border-white/5"
          >
            {sec.badge && (
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 mb-4 uppercase">
                {sec.badge}
              </span>
            )}
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white max-w-2xl mb-6">
              {sec.title}
            </h2>
            {sec.subtitle && (
              <h3 className="text-[#accent] text-xs font-mono font-bold tracking-wider mb-4 uppercase" style={{ color: "${accent}" }}>
                {sec.subtitle}
              </h3>
            )}
            {sec.description && (
              <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
                {sec.description}
              </p>
            )}
          </motion.section>`;
  } else if (sec.type === "features_grid" || sec.type === "technology") {
    sectionContent = `          {/* FEATURES / TECHNOLOGY */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-12 border-t border-white/5"
          >
            <div className="flex flex-col ${alignmentClass} mb-12">
              {sec.badge && <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3">{sec.badge}</span>}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{sec.title}</h2>
              {sec.description && <p className="text-xs text-zinc-400 max-w-xl ${sec.alignment === "center" ? "mx-auto" : ""}" style={{ color: "rgba(255,255,255,0.6)" }}>{sec.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sec.items ? sec.items.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-8 rounded-2xl bg-zinc-950/60 border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#secondary]/40 border border-white/5 flex items-center justify-center mb-6" style={{ backgroundColor: "${secondary}40" }}>
                    <Sparkles size={16} className="text-[#accent]" style={{ color: "${accent}" }} />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              )) : (
                <p className="text-xs text-zinc-500">Sem itens configurados.</p>
              )}
            </div>
          </motion.section>`;
  } else if ((sec.type as string) === "numbers" || (sec.type as string) === "stats") {
    sectionContent = `          {/* METRICS & NUMBERS */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-12 border-t border-white/5"
          >
            <div className="flex flex-col ${alignmentClass} mb-12">
              {sec.badge && <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3">{sec.badge}</span>}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{sec.title}</h2>
              {sec.description && <p className="text-xs text-zinc-400 max-w-xl ${sec.alignment === "center" ? "mx-auto" : ""}" style={{ color: "rgba(255,255,255,0.6)" }}>{sec.description}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {sec.items ? sec.items.map((item) => (
                <div 
                  key={item.id}
                  className="text-center p-6 rounded-2xl bg-[#secondary]/10 border border-white/5"
                  style={{ backgroundColor: "${secondary}15" }}
                >
                  <div className="text-3xl md:text-5xl font-extrabold text-white mb-2">
                    {item.price || "100%"}
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                    {item.title}
                  </div>
                </div>
              )) : (
                <p className="text-xs text-zinc-500">Sem métricas configuradas.</p>
              )}
            </div>
          </motion.section>`;
  } else if (sec.type === "power") {
    sectionContent = `          {/* POWER FLOW LIST */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-12 border-t border-white/5"
          >
            <div className="flex flex-col ${alignmentClass} mb-12">
              {sec.badge && <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3">{sec.badge}</span>}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{sec.title}</h2>
              {sec.description && <p className="text-xs text-zinc-400 max-w-xl ${sec.alignment === "center" ? "mx-auto" : ""}" style={{ color: "rgba(255,255,255,0.6)" }}>{sec.description}</p>}
            </div>

            <div className="space-y-4">
              {sec.items ? sec.items.map((item, idx) => (
                <div 
                  key={item.id}
                  className="p-6 rounded-2xl bg-[#secondary]/20 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                  style={{ backgroundColor: "${secondary}15" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono text-zinc-700">0{idx + 1}</span>
                    <div>
                      <h4 className="text-base font-bold text-white uppercase tracking-wider">{item.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                    </div>
                  </div>
                  <Check size={16} className="text-[#accent] self-end md:self-auto" style={{ color: "${accent}" }} />
                </div>
              )) : (
                <p className="text-xs text-zinc-500">Sem itens configurados.</p>
              )}
            </div>
          </motion.section>`;
  } else if (sec.type === "pricing") {
    sectionContent = `          {/* PRICING PLANS */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-12 border-t border-white/5"
          >
            <div className="flex flex-col ${alignmentClass} mb-12">
              {sec.badge && <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3">{sec.badge}</span>}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{sec.title}</h2>
              {sec.description && <p className="text-xs text-zinc-400 max-w-xl ${sec.alignment === "center" ? "mx-auto" : ""}" style={{ color: "rgba(255,255,255,0.6)" }}>{sec.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {sec.items ? sec.items.map((item) => {
                const isPromo = item.badge === "RECOMENDADO" || item.badge === "POPULAR";
                return (
                  <div 
                    key={item.id}
                    className={\`p-8 rounded-3xl relative flex flex-col \${
                      isPromo 
                        ? "border-2 border-[#accent] bg-[#secondary]/35 shadow-2xl" 
                        : "border border-white/5 bg-zinc-950/70"
                    }\`}
                    style={isPromo ? { borderColor: "${accent}", backgroundColor: "${secondary}30" } : {}}
                  >
                    {item.badge && (
                      <span className="absolute -top-3 left-6 px-3 py-1 text-[8px] font-extrabold tracking-widest bg-white text-black rounded-full uppercase">
                        {item.badge}
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">{item.description}</p>
                    
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-4xl md:text-5xl font-extrabold text-white">{item.price || "$0"}</span>
                      {item.duration && <span className="text-xs text-zinc-500 font-mono">/{item.duration}</span>}
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {item.features ? item.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                          <Check size={12} className="text-[#accent]" style={{ color: "${accent}" }} />
                          <span>{feat}</span>
                        </li>
                      )) : (
                        <li className="text-xs text-zinc-500">Suporte prioritário e atualizações diárias.</li>
                      )}
                    </ul>

                    <button 
                      className={\`w-full py-3 rounded-full text-xs font-bold transition-all duration-300 \${
                        isPromo 
                          ? "bg-white text-black hover:bg-zinc-200" 
                          : "border border-white/10 text-white hover:bg-white/5"
                      }\`}
                      onClick={() => document.getElementById("sec-cta")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Selecionar Plano
                    </button>
                  </div>
                );
              }) : (
                <p className="text-xs text-zinc-500">Sem planos configurados.</p>
              )}
            </div>
          </motion.section>`;
  } else if ((sec.type as string) === "product" || (sec.type as string) === "products") {
    sectionContent = `          {/* PRODUCT SHOWCASE */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-12 border-t border-white/5 text-center flex flex-col items-center"
          >
            {sec.badge && <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3">{sec.badge}</span>}
            <h2 className="text-2xl md:text-4xl font-bold text-white max-w-2xl mb-4">{sec.title}</h2>
            {sec.subtitle && <h3 className="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-6">{sec.subtitle}</h3>}
            {sec.description && <p className="text-xs text-zinc-500 max-w-xl leading-relaxed mb-8">{sec.description}</p>}
            
            {/* SaaS Mockup Dashboard */}
            <div className="w-full max-w-4xl p-1 bg-white/5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-zinc-950">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/60">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">dashboard_preview.app</span>
                <span className="w-4" />
              </div>
              <div className="p-6 text-left grid grid-cols-3 gap-4">
                <div className="bg-[#secondary]/10 border border-white/5 p-4 rounded-xl" style={{ backgroundColor: "${secondary}10" }}>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase mb-2">Agentes Online</div>
                  <div className="text-2xl font-bold text-white">4.218</div>
                  <div className="text-[9px] text-[#accent] mt-1" style={{ color: "${accent}" }}>● Ativos agora</div>
                </div>
                <div className="bg-[#secondary]/10 border border-white/5 p-4 rounded-xl" style={{ backgroundColor: "${secondary}10" }}>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase mb-2">Requisições/Seg</div>
                  <div className="text-2xl font-bold text-white">1.492</div>
                  <div className="text-[9px] text-zinc-500 mt-1">Sincronia estável</div>
                </div>
                <div className="bg-[#secondary]/10 border border-white/5 p-4 rounded-xl" style={{ backgroundColor: "${secondary}10" }}>
                  <div className="text-[9px] font-mono text-zinc-500 uppercase mb-2">Latência Global</div>
                  <div className="text-2xl font-bold text-white">14ms</div>
                  <div className="text-[9px] text-green-400 mt-1">Uptime 99.9%</div>
                </div>
              </div>
            </div>
          </motion.section>`;
  } else if ((sec.type as string) === "testimonials") {
    sectionContent = `          {/* TESTIMONIALS */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-12 border-t border-white/5"
          >
            <div className="flex flex-col ${alignmentClass} mb-12">
              {sec.badge && <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mb-3">{sec.badge}</span>}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{sec.title}</h2>
              {sec.description && <p className="text-xs text-zinc-400 max-w-xl ${sec.alignment === "center" ? "mx-auto" : ""}" style={{ color: "rgba(255,255,255,0.6)" }}>{sec.description}</p>}
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {sec.items ? sec.items.map((item) => (
                <div 
                  key={item.id}
                  className="p-8 rounded-2xl bg-zinc-950/70 border border-white/5 relative"
                >
                  <MessageSquare size={32} className="absolute top-6 right-6 text-white/[0.02]" />
                  <p className="text-sm md:text-base italic text-zinc-300 leading-relaxed mb-6 font-serif">
                    "{item.description}"
                  </p>
                  <div>
                    <h5 className="text-xs font-bold text-white tracking-wider font-mono">{item.title}</h5>
                    {item.badge && <span className="text-[10px] text-[#accent] font-medium mt-0.5 block" style={{ color: "${accent}" }}>{item.badge}</span>}
                  </div>
                </div>
              )) : (
                <p className="text-xs text-zinc-500">Sem depoimentos cadastrados.</p>
              )}
            </div>
          </motion.section>`;
  } else if (sec.type === "cta") {
    sectionContent = `          {/* CALL TO ACTION */}
          <motion.section 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-16 my-8 border border-white/5 rounded-3xl bg-gradient-to-tr from-zinc-950 to-zinc-900/40 text-center flex flex-col items-center justify-center p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#accent]/5 rounded-full blur-[100px]" style={{ backgroundColor: "${accent}0a" }} />
            {sec.badge && <span className="text-[8px] font-extrabold tracking-widest text-[#accent] uppercase mb-4" style={{ color: "${accent}" }}>{sec.badge}</span>}
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl leading-tight mb-4">
              {sec.title}
            </h2>
            {sec.subtitle && <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-6">{sec.subtitle}</p>}
            {sec.description && <p className="text-xs text-zinc-400 max-w-md leading-relaxed mb-8">{sec.description}</p>}
            
            <button 
              className="px-10 py-4 rounded-full text-xs font-extrabold bg-[#accent] text-white hover:opacity-90 shadow-2xl transition-all duration-300 flex items-center gap-2 uppercase tracking-widest cursor-pointer"
              style={{ backgroundColor: "${accent}" }}
              onClick={() => alert("Obrigado pelo interesse! Seu formulário ou webhook seria acionado aqui.")}
            >
              Começar a Transformação
              <ArrowRight size={12} />
            </button>
          </motion.section>`;
  } else if ((sec.type as string) === "footer") {
    sectionContent = `          {/* FOOTER */}
          <motion.footer 
            id="sec-${sec.id}"
            variants={itemVariants}
            className="py-12 border-t border-white/5 text-center flex flex-col items-center justify-center gap-4 text-zinc-600"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-[10px] font-extrabold text-white">
                ${name.charAt(0).toUpperCase()}
              </div>
              <span className="font-extrabold tracking-tight text-white text-xs">${name}</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono">
              © {new Date().getFullYear()} ${name} Inc. Todos os direitos reservados.
            </p>
            <p className="text-[9px] text-zinc-600">
              Desenvolvido de forma automatizada com React, Framer Motion e Tailwind CSS.
            </p>
          </motion.footer>`;
  }

  return sectionContent;
}).filter(Boolean).join("\n\n")}
        </motion.div>

      </div>
    </div>
  );
}
`;
}
