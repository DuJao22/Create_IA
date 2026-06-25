/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// Local persistent database file
const DB_FILE = path.join(process.cwd(), "db.json");

// Define structure of our simple database format
interface DatabaseSchema {
  projects: any[];
  users: any[];
}

function getDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = { projects: [], users: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, returning default", err);
    return { projects: [], users: [] };
  }
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file", err);
  }
}

// ---------------------------------------------------------
// AI GENERATION: Initialize Gemini SDK
// ---------------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. AI generation will run with mock data fallback.");
}

// Dynamic helper to get active Gemini client based on user settings API Key header
function getAiClient(req: any): GoogleGenAI | null {
  const customKey = req.headers["x-gemini-api-key"] || req.headers["X-Gemini-Api-Key"];
  if (customKey && typeof customKey === "string") {
    try {
      return new GoogleGenAI({
        apiKey: customKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build-custom",
          },
        },
      });
    } catch (err) {
      console.error("[GEMINI-CUSTOM] Error initializing client, using global:", err);
    }
  }
  return ai;
}

// Dynamic connector to SQLite Cloud REST endpoint
async function querySQLiteCloud(host: string, apiKey: string, dbName: string, sql: string): Promise<any> {
  let baseUrl = host.trim();
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `https://${baseUrl}`;
  }
  baseUrl = baseUrl.replace(/\/v(1|2)\/?$/, "").replace(/\/$/, "");
  
  // Endpoint standard
  const url = `${baseUrl}/v2/webrequest`;
  console.log(`[SQLITE CLOUD] Query: "${sql.slice(0, 100)}"`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-API-KEY": apiKey
    },
    body: JSON.stringify({
      database: dbName,
      sql: sql
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro do SQLite Cloud: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// ---------------------------------------------------------
// Express Routes - Core API Endpoints
// ---------------------------------------------------------

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiEnabled: !!ai });
});

// AUTH REGISTRATION / LOG IN
app.post("/api/auth/register", (req, res) => {
  const { email, name, password } = req.body;
  if (!email) {
    res.status(400).json({ error: "E-mail é obrigatório." });
    return;
  }
  const db = getDatabase();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (existingUser) {
    res.status(400).json({ error: "E-mail já está em uso." });
    return;
  }

  const newUser = {
    id: "user_" + Math.random().toString(36).substr(2, 9),
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    password // simplistic
  };

  db.users.push(newUser);
  saveDatabase(db);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword, message: "Conta criada com sucesso!" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ error: "E-mail é obrigatório." });
    return;
  }
  const db = getDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    res.status(401).json({ error: "Usuário não encontrado." });
    return;
  }

  // Simplified password check
  if (password && user.password && user.password !== password) {
    res.status(401).json({ error: "Senha inválida." });
    return;
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword, message: "Login realizado com sucesso!" });
});

// GET PROJECTS / DESIGNS
app.get("/api/projects", async (req, res) => {
  const userId = req.query.userId as string || "anonymous";
  const sqHost = req.headers["x-sqlite-cloud-host"] as string;
  const sqApiKey = req.headers["x-sqlite-cloud-apikey"] as string;
  const sqDbName = req.headers["x-sqlite-cloud-dbname"] as string;

  if (sqHost && sqApiKey && sqDbName) {
    try {
      console.log("[SQLITE CLOUD] Projects read requested by user.");
      // Bootstrap projects table
      await querySQLiteCloud(
        sqHost,
        sqApiKey,
        sqDbName,
        "CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT, html TEXT, date TEXT, userId TEXT);"
      );

      // Fetch projects
      const queryRes = await querySQLiteCloud(
        sqHost,
        sqApiKey,
        sqDbName,
        `SELECT id, name, html, date, userId FROM projects ORDER BY date DESC;`
      );

      let projects: any[] = [];
      if (queryRes && Array.isArray(queryRes.data)) {
        projects = queryRes.data;
      } else if (Array.isArray(queryRes)) {
        projects = queryRes;
      } else if (queryRes && Array.isArray(queryRes.rows)) {
        projects = queryRes.rows;
      } else if (queryRes && queryRes.results && Array.isArray(queryRes.results)) {
        projects = queryRes.results;
      }

      // Convert rows format to standard objects if returned as arrays
      const formattedProjects = projects.map((p: any) => {
        if (Array.isArray(p)) {
          // If returned as raw arrays, map by indices: 0: id, 1: name, 2: html, 3: date, 4: userId
          return {
            id: p[0],
            name: p[1],
            html: p[2],
            date: p[3],
            userId: p[4]
          };
        }
        return p;
      }).filter((p: any) => p && p.userId === userId);

      res.json(formattedProjects);
      return;
    } catch (err: any) {
      console.error("[SQLITE CLOUD] Fetch error details, falling back to local storage:", err.message);
    }
  }

  // Fallback local schema
  const db = getDatabase();
  const projects = db.projects.filter(p => p.userId === userId);
  res.json(projects);
});

// CREATE / UPDATE PROJECT
app.post("/api/projects", async (req, res) => {
  const projectData = req.body;
  if (!projectData.name) {
    res.status(400).json({ error: "Nome do projeto é obrigatório." });
    return;
  }

  const { id, name, html, date, userId } = projectData;
  const finalId = id || "proj_" + Math.random().toString(36).substr(2, 9);
  const finalUserId = userId || "anonymous";
  const finalDate = date || new Date().toLocaleDateString();

  const sqHost = req.headers["x-sqlite-cloud-host"] as string;
  const sqApiKey = req.headers["x-sqlite-cloud-apikey"] as string;
  const sqDbName = req.headers["x-sqlite-cloud-dbname"] as string;

  if (sqHost && sqApiKey && sqDbName) {
    try {
      console.log(`[SQLITE CLOUD] Store/Update request for page: "${name}"`);
      // Bootstrap projects table
      await querySQLiteCloud(
        sqHost,
        sqApiKey,
        sqDbName,
        "CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, name TEXT, html TEXT, date TEXT, userId TEXT);"
      );

      // Escape SQL inputs to prevent injection
      const escId = finalId.replace(/'/g, "''");
      const escName = name.replace(/'/g, "''");
      const escHtml = html.replace(/'/g, "''");
      const escDate = finalDate.replace(/'/g, "''");
      const escUserId = finalUserId.replace(/'/g, "''");

      const storeSql = `INSERT OR REPLACE INTO projects (id, name, html, date, userId) VALUES ('${escId}', '${escName}', '${escHtml}', '${escDate}', '${escUserId}');`;
      await querySQLiteCloud(sqHost, sqApiKey, sqDbName, storeSql);

      res.json({ id: finalId, name, html, date: finalDate, userId: finalUserId });
      return;
    } catch (err: any) {
      console.error("[SQLITE CLOUD] Save error details:", err.message);
      res.status(500).json({ error: `Estratégia de gravação no SQLite Cloud falhou: ${err.message}` });
      return;
    }
  }

  // Fallback local persistence
  const db = getDatabase();
  const index = db.projects.findIndex(p => p.id === finalId);

  const projectToSave = {
    ...projectData,
    id: finalId,
    userId: finalUserId,
    createdAt: projectData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (index !== -1) {
    db.projects[index] = projectToSave;
  } else {
    db.projects.push(projectToSave);
  }

  saveDatabase(db);
  res.json(projectToSave);
});

// DELETE PROJECT
app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const sqHost = req.headers["x-sqlite-cloud-host"] as string;
  const sqApiKey = req.headers["x-sqlite-cloud-apikey"] as string;
  const sqDbName = req.headers["x-sqlite-cloud-dbname"] as string;

  if (sqHost && sqApiKey && sqDbName) {
    try {
      const escId = id.replace(/'/g, "''");
      await querySQLiteCloud(sqHost, sqApiKey, sqDbName, `DELETE FROM projects WHERE id = '${escId}';`);
      res.json({ success: true, message: "Página removida com sucesso do SQLite Cloud." });
      return;
    } catch (err: any) {
      console.error("[SQLITE CLOUD] Delete failure:", err.message);
      res.status(500).json({ error: `Remoção falhou no SQLite Cloud: ${err.message}` });
      return;
    }
  }

  const db = getDatabase();
  const originalLength = db.projects.length;
  db.projects = db.projects.filter(p => p.id !== id);
  if (db.projects.length < originalLength) {
    saveDatabase(db);
    res.json({ success: true, message: "Projeto excluído com sucesso." });
  } else {
    res.status(404).json({ error: "Projeto não encontrado." });
  }
});

// REBUILD SQLITE CLOUD STRUCTURE FROM SCRATCH
app.post("/api/rebuild-db", async (req, res) => {
  const sqHost = req.headers["x-sqlite-cloud-host"] as string;
  const sqApiKey = req.headers["x-sqlite-cloud-apikey"] as string;
  const sqDbName = req.headers["x-sqlite-cloud-dbname"] as string;

  if (!sqHost || !sqApiKey || !sqDbName) {
    res.status(400).json({ error: "Credenciais do SQLite Cloud não fornecidas nos cabeçalhos." });
    return;
  }

  try {
    console.log("[SQLITE CLOUD] Reconstrução completa de tabelas solicitada.");
    
    // Step 1: DROP TABLE if exists to clear out any incompatible structure or data corruption
    try {
      await querySQLiteCloud(sqHost, sqApiKey, sqDbName, "DROP TABLE IF EXISTS projects;");
    } catch (dropErr: any) {
      console.warn("[SQLITE CLOUD] Erro ao dropar tabela projects (pode não existir):", dropErr.message);
    }

    // Step 2: CREATE TABLE completely fresh with standard definition
    await querySQLiteCloud(
      sqHost,
      sqApiKey,
      sqDbName,
      "CREATE TABLE projects (id TEXT PRIMARY KEY, name TEXT, html TEXT, date TEXT, userId TEXT);"
    );

    // Step 3: Insert a sample welcome landing page so the database is never empty
    const sampleId = "proj_welcome";
    const sampleName = "Minha Primeira Landing Page (Boas-vindas)";
    const sampleHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Boas-vindas</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-white flex flex-col items-center justify-center min-h-screen">
  <div class="max-w-md text-center p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
    <h1 class="text-2xl font-bold mb-4">Banco de Dados Configurado! 🚀</h1>
    <p class="text-zinc-400 text-sm mb-6">Sua estrutura do SQLite Cloud foi recriada com sucesso.</p>
    <a href="#" class="px-5 py-2.5 bg-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-500 transition-all">Começar a Gerar</a>
  </div>
</body>
</html>`;
    const sampleDate = new Date().toLocaleDateString();
    const sampleUserId = "anonymous";

    const escId = sampleId.replace(/'/g, "''");
    const escName = sampleName.replace(/'/g, "''");
    const escHtml = sampleHtml.replace(/'/g, "''");
    const escDate = sampleDate.replace(/'/g, "''");
    const escUserId = sampleUserId.replace(/'/g, "''");

    const insertSql = `INSERT OR REPLACE INTO projects (id, name, html, date, userId) VALUES ('${escId}', '${escName}', '${escHtml}', '${escDate}', '${escUserId}');`;
    await querySQLiteCloud(sqHost, sqApiKey, sqDbName, insertSql);

    res.json({ success: true, message: "Banco de dados recriado do zero com sucesso!" });
  } catch (err: any) {
    console.error("[SQLITE CLOUD] Rebuild table failure:", err.message);
    res.status(500).json({ error: `Falha na reconstrução das tabelas: ${err.message}` });
  }
});

// Helper to read and format cloned skills to augment the AI system instruction
function getClonedSkillsContent(): string {
  const dirPath = path.join(process.cwd(), "cloned_skills");
  if (!fs.existsSync(dirPath)) {
    return "";
  }
  try {
    let content = "\n\n--- INICIA DIRETRIZES DE SKILLS CLONADAS DO SENSOR GERAL ---\n";
    
    // Recursive folder scan helper
    const scanDir = (dir: string, depth = 0): string[] => {
      if (depth > 2) return []; // avoid extremely deep folders
      let results: string[] = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        if (file.startsWith(".") || file === "node_modules") continue;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          results = results.concat(scanDir(filePath, depth + 1));
        } else if (file.endsWith(".md") || file.endsWith(".json") || file.endsWith(".txt")) {
          results.push(filePath);
        }
      }
      return results;
    };

    const files = scanDir(dirPath);
    let count = 0;
    for (const filePath of files) {
      const relPath = path.relative(dirPath, filePath);
      const fileData = fs.readFileSync(filePath, "utf-8");
      content += `\n[Skill Cloned File: ${relPath}]\n${fileData.slice(0, 1500)}\n`;
      count++;
      if (count >= 6) {
        content += "\n(Outras diretrizes truncadas para otimização de contexto)\n";
        break;
      }
    }
    content += "\n--- FIM DAS DIRETRIZES DE SKILLS CLONADAS ---\n";
    return count > 0 ? content : "";
  } catch (err) {
    console.error("Error reading cloned files for prompt injection", err);
    return "";
  }
}

// ROUTE: CLONE GIT REPOSITORY
app.post("/api/git/clone", async (req, res) => {
  const { gitUrl } = req.body;
  if (!gitUrl || typeof gitUrl !== "string") {
    res.status(400).json({ error: "A URL do repositório Git é obrigatória." });
    return;
  }

  const targetDir = path.join(process.cwd(), "cloned_skills");

  try {
    // Delete target dir if exists to fresh clone
    if (fs.existsSync(targetDir)) {
      console.log("Removing existing cloned directory for fresh clone:", targetDir);
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    console.log(`Cloning repository ${gitUrl} to ${targetDir}...`);
    // Run git clone command
    exec(`git clone --depth 1 "${gitUrl}" "${targetDir}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("Failed to run Git clone command:", error, stderr);
        res.status(500).json({ 
          error: "Falha ao clonar o repositório Git.", 
          details: error.message,
          stderr 
        });
        return;
      }

      // Check success and read files
      let filesFound: string[] = [];
      if (fs.existsSync(targetDir)) {
        const getFilesRecursive = (dir: string): string[] => {
          let list: string[] = [];
          const files = fs.readdirSync(dir);
          for (const f of files) {
            if (f.startsWith(".") || f === "node_modules") continue;
            const fullPath = path.join(dir, f);
            if (fs.statSync(fullPath).isDirectory()) {
              list = list.concat(getFilesRecursive(fullPath));
            } else if (f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".txt")) {
              list.push(path.relative(targetDir, fullPath));
            }
          }
          return list;
        };
        filesFound = getFilesRecursive(targetDir);
      }

      res.json({
        success: true,
        message: "Repositório clonado com sucesso!",
        filesCount: filesFound.length,
        files: filesFound.slice(0, 50), // return sample list in response
        stdout,
        stderr
      });
    });

  } catch (err: any) {
    console.error("General error in git clone route:", err);
    res.status(500).json({ error: "Erro interno ao executar a rotina de clonagem.", details: err.message });
  }
});

// ROUTE: GET CLONED STATUS AND FILES
app.get("/api/git/status", (req, res) => {
  const targetDir = path.join(process.cwd(), "cloned_skills");
  if (!fs.existsSync(targetDir)) {
    res.json({ cloned: false, files: [], filesCount: 0 });
    return;
  }

  try {
    // Recurse directory
    const getFilesRecursive = (dir: string): string[] => {
      let list: string[] = [];
      const files = fs.readdirSync(dir);
      for (const f of files) {
        if (f.startsWith(".") || f === "node_modules") continue;
        const fullPath = path.join(dir, f);
        if (fs.statSync(fullPath).isDirectory()) {
          list = list.concat(getFilesRecursive(fullPath));
        } else if (f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".txt")) {
          list.push(path.relative(targetDir, fullPath));
        }
      }
      return list;
    };

    const files = getFilesRecursive(targetDir);
    res.json({
      cloned: true,
      filesCount: files.length,
      files: files.slice(0, 50) // list top 50 files
    });
  } catch (err: any) {
    res.status(500).json({ error: "Erro ao ler status das skills clonadas.", details: err.message });
  }
});

// ---------------------------------------------------------
// AI LANDING PAGE GENERATION endpoint
// Calls Gemini with custom schemas to structure the output
// ---------------------------------------------------------
app.post("/api/generate", async (req, res) => {
  const { prompt, currentVibe, companyName } = req.body;

  if (!prompt) {
    res.status(400).json({ error: "O prompt do usuário é obrigatório." });
    return;
  }

  const fallbackName = companyName || "Layon Devs";

  // System instruction detailing the exact requirements for LayonDevs standard
  const systemInstruction = `Você é um Designer e Desenvolvedor Web do nível mais alto internacional (pense em designer sênior da Apple, Stripe, Linear).
Sua tarefa é ler atentamente a solicitação do usuário e gerar uma estrutura de landing page/página web cinematográfica, premium, moderna, elegante e com um storytelling irresistível.
Você deve responder em formato JSON estrito, compatível com os tipos declarados.

REGRAS DE CONTEÚDO E DESIGN COMPORTAMENTAL:
1. DESIGN PREMIUM & CORES IMPACTANTES:
   - Defina uma paleta de cores excepcional baseada no "vibe" da marca. Use cores cinematográficas (pense em tons de ardósia, preto absoluto #000000, grafite #0a0a0a, brancos polidos, e cores de acento extremamente vibrantes como azul elétrico #38bdf8, magenta cósmico #f43f5e, verde neon #10b981, ou dourado bronze #d97706).
   - Tipografia de grife: Escolha fontes adequadas ("Space Grotesk" ou "Outfit" para tecnologia futurista/IA; "Inter" para minimalismo limpo e corporativo; "Playfair Display" para o clássico editorial premium).
2. COMPOSIÇÃO DE STORIES DO SCROLL (Estratégia de Alto Padrão):
   - Crie seções na ordem correta para guiar o usuário. Por exemplo:
     * SEÇÃO 1: 'hero' (Início cinematográfico com título forte, descrição imersiva e visual de canvas procedural ou mockup futurista).
     * SEÇÃO 2: 'vision' (Uma frase enorme e inspiracional que define um novo paradigma, ex: "Não construímos softwares. Elaboramos mentes digitais.")
     * SEÇÃO 3: 'technology' (Grid de recursos ou bento grid moderno com especificações que dão autoridade técnica. Use nomes de ícones do Lucide perfeitamente conexos: 'Brain', 'Cpu', 'Terminal', 'Maximize', 'Zap', 'Shield', 'Layers', 'Activity', 'Sparkles').
     * SEÇÃO 4: 'power' (Destaques curtos de impacto ("Automatize. Escale. Domine."), focado no controle dinâmico).
     * SEÇÃO 5: 'product' (Simulação de um dashboard SaaS interativo, focado na ferramenta trabalhando em tempo real).
     * SEÇÃO 6: 'features_grid' ou 'pricing' (Cards bento para demonstrar valor ou planos de assinatura).
     * SEÇÃO 7: 'cta' (Chamada imperativa com botão imponente, fundo escuro premium sem ruídos).
3. DETALHAMENTO DE CAMPOS:
   - Mantenha títulos curtos e extremamente impactantes. Evite geradores genéricos de IA, use uma cópia comercial sutil, concisa e de alto valor.
   - Todo ícone referenciado deve ser um nome de ícone válido do Lucide (CamelCase ou lowercase compatível, ex: Brain, Cpu, Sparkles, Layers, Activity, Zap, Shield, HelpCircle, Code, Star, Check, Globe, RefreshCw, Send, Users, TrendingUp).
   - Adicione badges cativantes (ex: "SISTEMA OPERACIONAL COGNITIVO", "MÓDULO IA", "EDANTE DE CRIAÇÃO", "PREMIUM").
   - Defina alignments adequados para criar ritmo de scroll ('center' para heros/vision/cta, e 'left' para grids, pricing ou seções editoriais).
   - Ajuste o 'mediaType' em cada seção aplicável: 'canvas_particles' ou 'neural_brain' em heros/vision; 'mockup_saas' em produtos; 'none' em CTA simples.`;

  // Schema declaration for complete control
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Nome do projeto ou da marca estruturada" },
      metadata: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título SEO/Cabeçalho principal do site" },
          description: { type: Type.STRING, description: "Descrição do site ou slogan sutil" },
          primaryFont: { 
            type: Type.STRING, 
            enum: ["Inter", "Space Grotesk", "Outfit", "Playfair Display"],
            description: "Fonte principal para títulos" 
          },
          vibe: { 
            type: Type.STRING, 
            enum: ["minimalist", "tech", "warm", "editorial", "brutalist"],
            description: "A essência visual do site" 
          },
          palette: {
            type: Type.OBJECT,
            properties: {
              background: { type: Type.STRING, description: "Cor do fundo em hexadecimal, ex: #000000" },
              text: { type: Type.STRING, description: "Cor dos textos em hexadecimal, ex: #ffffff" },
              accent: { type: Type.STRING, description: "Cor do destaque principal, ex: #38bdf8" },
              secondary: { type: Type.STRING, description: "Cor de elementos secundários ou cards, ex: #111111" }
            },
            required: ["background", "text", "accent", "secondary"]
          }
        },
        required: ["title", "description", "primaryFont", "vibe", "palette"]
      },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "ID único da seção, ex: hero, vision, features" },
            type: { 
              type: Type.STRING, 
              enum: ["hero", "vision", "technology", "power", "product", "cta", "features_grid", "pricing", "faq", "contact"] 
            },
            title: { type: Type.STRING, description: "Título chamativo da seção" },
            subtitle: { type: Type.STRING, description: "Subtítulo de apoio complementar" },
            badge: { type: Type.STRING, description: "Tag ou etiqueta de topo em caixa alta (ex: TECNOLOGIA)" },
            description: { type: Type.STRING, description: "Parágrafo descritivo que explica detalhadamente" },
            alignment: { type: Type.STRING, enum: ["left", "center", "right"] },
            mediaType: { 
              type: Type.STRING, 
              enum: ["canvas_particles", "neural_brain", "geometric_matrix", "mockup_saas", "avatar_grid", "none"] 
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "ID do item" },
                  title: { type: Type.STRING, description: "Nome do card, recurso ou categoria" },
                  description: { type: Type.STRING, description: "Explicação ou detalhe" },
                  icon: { type: Type.STRING, description: "Nome de ícone Lucide adequado para representar o recurso" },
                  badge: { type: Type.STRING, description: "Mini badge de item" },
                  price: { type: Type.STRING, description: "Preço se aplicável a planos" },
                  features: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING }, 
                    description: "Lista de vantagens inclusas (em preços)" 
                  }
                },
                required: ["id", "title"]
              }
            },
            buttons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING, description: "Texto do botão, ex: Começar Agora" },
                  variant: { type: Type.STRING, enum: ["primary", "secondary", "outline", "ghost"] },
                  actionType: { type: Type.STRING, enum: ["link", "scroll_to_cta", "contact_modal"] },
                  actionValue: { type: Type.STRING, description: "Link de destino ou seletor CSS de scroll" }
                },
                required: ["text", "variant", "actionType"]
              }
            }
          },
          required: ["id", "type", "title", "alignment"]
        }
      }
    },
    required: ["name", "metadata", "sections"]
  };

  const modelName = "gemini-3.5-flash"; // recommended text model

  try {
    const activeAi = getAiClient(req);
    if (!activeAi) {
      throw new Error("Gemini API Client is not initialized due to missing GEMINI_API_KEY.");
    }

    console.log(`Starting Gemini Generation for prompt: "${prompt.slice(0, 50)}..."`);

    const clonedSkills = getClonedSkillsContent();
    const finalSystemInstruction = systemInstruction + (clonedSkills ? `\n\nDIRETRIZES ADICIONAIS DE CLAUDE/GIT SKILLS CLONADAS:\n${clonedSkills}\nAdote as regras e padrões de design acima listados para otimizar e refinar a qualidade de layout, cores e storytelling da saída.` : "");

    const userInstructions = `Solicitação do usuário: ${prompt}
Configurações adicionais se fornecidas:
- Vibe favorita: ${currentVibe || "não especificada"}
- Nome da marca/empresa: ${fallbackName}

Mapeie o roteiro estrito de scroll cinematográfico de alta convicção solicitado para esta marca. Certifique-se de incluir a Hero com suporte a visual canvas de partículas/rede, a seção de visão inspirada na Apple, os grids bento de recursos, e uma CTA espetacular.`;

    let response;
    const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
    let lastError: any = null;

    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i];
      try {
        console.log(`[Attempt ${i + 1}/${modelsToTry.length}] Calling Gemini with model: ${currentModel}...`);
        
        response = await activeAi.models.generateContent({
          model: currentModel,
          contents: userInstructions,
          config: {
            systemInstruction: finalSystemInstruction,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.8
          }
        });
        
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Attempt ${i + 1}/${modelsToTry.length}] Failed to generate content via Gemini with model ${currentModel}:`, err.message || err);
        if (i < modelsToTry.length - 1) {
          const delay = (i + 1) * 1500;
          console.log(`Waiting ${delay}ms before next attempt due to transient failure...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("Não foi possível obter resposta do Gemini após múltiplas tentativas.");
    }

    const outputText = response.text;
    if (!outputText) {
      throw new Error("Retorno vazio do modelo Gemini.");
    }

    // Try parsing result to ensure validity
    const resultJson = JSON.parse(outputText.trim());
    res.json(resultJson);

  } catch (err: any) {
    console.error("Erro na geração da página via Gemini: ", err);

    // Provide a highly polished fallback mock (Apple/LayonDevs Style) so the app NEVER crashes even without a key!
    // This maintains premium UX and provides a robust demonstration template.
    const mockTheme = {
      name: fallbackName,
      metadata: {
        title: fallbackName,
        description: "Construindo inteligências que escalam o futuro",
        primaryFont: "Space Grotesk" as const,
        vibe: "tech" as const,
        palette: {
          background: "#030303",
          text: "#f8fafc",
          accent: "#22c55e",
          secondary: "#0d0d0e"
        }
      },
      sections: [
        {
          id: "hero",
          type: "hero" as const,
          badge: "PLATAFORMA COGNITIVA V4",
          title: fallbackName,
          subtitle: "Agentes Autônomos de Alta Performance",
          description: "Criamos ecossistemas hiper-inteligentes que integram agentes de IA autônomos, automações sem fricção e sistemas de dados preditivos para posicionar a sua marca à frente do tempo.",
          alignment: "center" as const,
          mediaType: "canvas_particles" as const,
          buttons: [
            { text: "Explorar Tecnologia", variant: "primary" as const, actionType: "scroll_to_cta" as const, actionValue: "vision" },
            { text: "Falar com Engenheiro", variant: "outline" as const, actionType: "contact_modal" as const }
          ]
        },
        {
          id: "vision",
          type: "vision" as const,
          badge: "VISÃO & PARADIGMA",
          title: "Não criamos apenas softwares.",
          subtitle: "Criamos cérebros digitais altamente adaptativos.",
          description: "Acreditamos que a tecnologia deve ser imperceptível e infinitamente inteligente. Nossos sistemas operam em segundo plano, analisando tendências e automatizando decisões críticas com precisão milimétrica.",
          alignment: "center" as const,
          mediaType: "neural_brain" as const
        },
        {
          id: "technology",
          type: "technology" as const,
          badge: "ESPECIFICAÇÕES DA PLATAFORMA",
          title: "Engenharia robusta construída para escala ilimitada.",
          description: "Nosso bento grid apresenta a sinergia perfeita entre processamento local em milissegundos e conexões globais seguras.",
          alignment: "left" as const,
          mediaType: "geometric_matrix" as const,
          items: [
            { id: "tech_1", title: "Cérebro IA Integrado", description: "Capacidade avançada de processar raciocínios lógicos complexos de forma nativa e paralela.", icon: "Brain" },
            { id: "tech_2", title: "Automações 24/7", description: "Agentes inteligentes que criam, validam e publicam workflows sem intervenção manual contínua.", icon: "Zap" },
            { id: "tech_3", title: "Infraestrutura Elástica", description: "Preparado para suportar milhões de requisições simultâneas com redundância distribuída.", icon: "Server" },
            { id: "tech_4", title: "Escudo Criptográfico", description: "Governança estrita baseada em segurança militar de dados e chaves privadas isoladas.", icon: "Shield" }
          ]
        },
        {
          id: "power",
          type: "power" as const,
          badge: "CONCEITO DO SCROLL",
          title: "Sincronização Absoluta.",
          subtitle: "Deslize para ver o progresso exponencial da sua empresa.",
          description: "Assuma o controle total de cada pixel. Automatize inteligentemente, escale de forma previsível e domine seu mercado através de decisões guiadas por IA profunda.",
          alignment: "center" as const,
          mediaType: "none" as const,
          items: [
            { id: "p1", title: "AUTOMATIZE", description: "Elimine gargalos manuais." },
            { id: "p2", title: "ESCALE", description: "Crescimento sem overhead." },
            { id: "p3", title: "DOMINE", description: "Liderança de mercado." }
          ]
        },
        {
          id: "product",
          type: "product" as const,
          badge: "DEMONSTRAÇÃO REAL-TIME",
          title: "A Central de Comando dos Seus Agentes",
          subtitle: "SaaS Cockpit Inteligente",
          description: "Uma interface desenhada para visualização rápida de métricas, controle de tarefas de IA e edição visual instantânea de deploys ativos.",
          alignment: "center" as const,
          mediaType: "mockup_saas" as const,
          buttons: [
            { text: "Entrar no Cockpit", variant: "primary" as const, actionType: "link" as const, actionValue: "#" }
          ]
        },
        {
          id: "pricing",
          type: "pricing" as const,
          badge: "PLANOS DE EXPANSÃO",
          title: "Estruturas de investimento flexíveis, sem pegadinhas.",
          description: "Selecione o plano ideal para as necessidades da sua operação. Cancele ou atualize a qualquer momento.",
          alignment: "center" as const,
          items: [
            { id: "plan_1", title: "Aceleradoras (Startup)", description: "Perfeito para novos negócios validando MVPs ou landing pages iniciais inteligentes.", price: "$149", badge: "POPULAR", features: ["Até 5 Landing Pages Ativas", "Infraestrutura Express", "Suporte Comunitário Discord", "Gerações básicas por IA"] },
            { id: "plan_2", title: "Enterprise (Bilionário)", description: "Soluções sob medida para marcas consolidadas buscando governança e deploys de altíssimo luxo.", price: "Custom", features: ["Páginas Ilimitadas", "Agentes autônomos dedicados 128-core", "SLA de 99.99% garantido em contrato", "Rede de CDN dedicada", "Consultoria exclusiva Layon Devs"] }
          ]
        },
        {
          id: "cta",
          type: "cta" as const,
          badge: "O AMANHÃ É AGORA",
          title: "O futuro não espera.",
          subtitle: "Faça parte da revolução inteligente desenvolvida por quem molda a vanguarda.",
          description: "Junte-se à elite tecnológica e configure suas landing pages com precisão cirúrgica de IA e animações fluidas.",
          alignment: "center" as const,
          mediaType: "none" as const,
          buttons: [
            { text: "Começar Agora", variant: "primary" as const, actionType: "contact_modal" as const }
          ]
        }
      ]
    };

    res.json(mockTheme);
  }
});


// ---------------------------------------------------------
// NEW AI LANDING PAGE CONTENT SUGGESTER ("Colar Ideia")
// Calls Gemini to automatically outline deep storytelling, headlines,
// features, stats and testimonials from a simple user concept.
// ---------------------------------------------------------
app.post("/api/suggest-content", async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    res.status(400).json({ error: "A ideia ou descrição do seu negócio é obrigatória." });
    return;
  }

  const systemInstruction = `Você é um Copywriter e Diretor Criativo Senior da Apple ou Stripe.
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

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      brandName: { type: Type.STRING, description: "Nome elegante do negócio" },
      headline: { type: Type.STRING, description: "Título magnético principal" },
      subheadline: { type: Type.STRING, description: "Subtítulo de apoio da Hero" },
      about: { type: Type.STRING, description: "Parágrafo institucional/Parágrafo sobre" },
      ctaText: { type: Type.STRING, description: "Texto de ação do botão principal" },
      ctaLink: { type: Type.STRING, description: "Link de ação (geralmente #contato)" },
      aiContext: { type: Type.STRING, description: "Descrição do tom e do público direcionados ao Gemini" },
      features: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            icon: { type: Type.STRING, description: "Ícone CamelCase do Lucide válido (ex: Brain, Cpu, Sparkles, Layers, Activity, Zap, Shield, Globe)" },
            title: { type: Type.STRING },
            desc: { type: Type.STRING }
          },
          required: ["id", "icon", "title", "desc"]
        }
      },
      stats: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            val: { type: Type.STRING },
            label: { type: Type.STRING }
          },
          required: ["id", "val", "label"]
        }
      },
      testimonials: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            quote: { type: Type.STRING },
            author: { type: Type.STRING },
            role: { type: Type.STRING }
          },
          required: ["id", "quote", "author", "role"]
        }
      }
    },
    required: ["brandName", "headline", "subheadline", "about", "ctaText", "ctaLink", "aiContext", "features", "stats", "testimonials"]
  };

  let response;
  const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
  let lastError: any = null;

  try {
    const activeAi = getAiClient(req);
    if (!activeAi) {
      throw new Error("Gemini API Client is not initialized.");
    }

    console.log(`[SUGGESTER] Gerando conteúdo para a ideia: "${idea.slice(0, 50)}..."`);
    
    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i];
      try {
        console.log(`[SUGGESTER - Attempt ${i + 1}/${modelsToTry.length}] Calling Gemini with model: ${currentModel}...`);
        
        response = await activeAi.models.generateContent({
          model: currentModel,
          contents: `Construa todo o conteúdo da landing page com base nesta ideia crua do negócio: ${idea}`,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
            temperature: 0.7
          }
        });

        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[SUGGESTER - Attempt ${i + 1}/${modelsToTry.length}] Failed with model ${currentModel}:`, err.message || err);
        if (i < modelsToTry.length - 1) {
          const delay = (i + 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    if (response && response.text) {
      const resultJson = JSON.parse(response.text.trim());
      res.json({ success: true, ...resultJson });
      return;
    } else {
      throw lastError || new Error("Nenhum texto de retorno do Gemini.");
    }
  } catch (err: any) {
    console.error("[SUGGESTER] Erro final ao sugerir conteúdo:", err.message || err);
    
    // Premium fallback generator if API key fails or is missing
    const words = idea.split(" ");
    const keyword = words[0] || "Premium";
    const titleKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    
    const fallbackResponse = {
      success: true,
      brandName: `${titleKeyword} Lab`,
      headline: `Redefinindo o paradigma de ${idea.toLowerCase()}`,
      subheadline: `Entregamos sofisticação técnica, inteligência integrada e sistemas customizados de alto nível projetados para escalar sem limites.`,
      about: `Somos uma equipe focada na excelência visual e operacional. Projetamos soluções para negócios que não aceitam o comum. Nossa especialidade é transformar a complexidade de "${idea}" em experiências fluidas, lucrativas e cinematográficas.`,
      ctaText: `Desbloquear Acesso`,
      ctaLink: `#contato`,
      aiContext: `Tom: de autoridade, sofisticado, sério. Público: Clientes premium interessados em ${idea}. Setor: Serviços de alto padrão.`,
      features: [
        { id: "f1", icon: "Sparkles", title: "Integração Pura", desc: "Sincronização imediata de cada elemento para garantir velocidade e estabilidade crítica." },
        { id: "f2", icon: "Shield", title: "Padrão de Elite", desc: "Criptografia e governança rigorosa em cada fluxo operacional executado." },
        { id: "f3", icon: "Activity", title: "Otimização Contínua", desc: "Análise profunda de telemetria para garantir que seu ecossistema nunca perca desempenho." },
        { id: "f4", icon: "Zap", title: "Execução Extrema", desc: "Infraestrutura projetada para rodar tarefas complexas em milissegundos." }
      ],
      stats: [
        { id: "s1", val: "100%", label: "Satisfação Premium" },
        { id: "s2", val: "0ms", label: "Latência de Resposta" },
        { id: "s3", val: "10×", label: "Mais Performance" },
        { id: "s4", val: "Uptime", label: "Garantia Integral" }
      ],
      testimonials: [
        { id: "t1", quote: `A equipe superou todas as expectativas em relação a "${idea}". O resultado final é uma obra-prima de design e engenharia fluida que converte em segundos.`, author: "Carlos Menezes", role: "Diretor Executivo, Alpha Group" }
      ]
    };
    
    res.json(fallbackResponse);
  }
});


// ---------------------------------------------------------
// NEW AI LANDING PAGE GENERATION (RAW HTML) endpoint
// Calls Gemini with custom system and user prompts to compile
// a high-luxury self-contained single-page HTML landing page.
// ---------------------------------------------------------
app.post("/api/generate-html", async (req, res) => {
  const { systemPrompt, userPrompt } = req.body;

  if (!userPrompt) {
    res.status(400).json({ error: "O prompt do usuário é obrigatório." });
    return;
  }

  const activeAi = getAiClient(req);
  if (!activeAi) {
    res.status(500).json({ error: "O SDK do Gemini não está instanciado no servidor. Defina GEMINI_API_KEY ou configure sob as Configurações de Engrenagem." });
    return;
  }

  let response;
  const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      console.log(`[HTML Gen - Attempt ${i + 1}/${modelsToTry.length}] Calling Gemini with model: ${currentModel}...`);
      
      response = await activeAi.models.generateContent({
        model: currentModel,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7
        }
      });
      
      if (response && response.text) {
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[HTML Gen - Attempt ${i + 1}/${modelsToTry.length}] Failed with model ${currentModel}:`, err.message || err);
      if (i < modelsToTry.length - 1) {
        const delay = (i + 1) * 1500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  if (!response || !response.text) {
    res.status(500).json({ 
      error: "Não foi possível obter resposta do Gemini após múltiplas tentativas.", 
      details: lastError?.message || "Sem detalhes disponíveis" 
    });
    return;
  }

  const outputText = response.text;
  
  // Clean markdown ticks from response
  let cleanedHtml = outputText
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```\s*$/, "")
    .trim();

  if (!cleanedHtml.startsWith("<!DOCTYPE") && !cleanedHtml.startsWith("<html")) {
    const match = cleanedHtml.match(/(<!DOCTYPE[\s\S]*)/i);
    if (match) cleanedHtml = match[1];
  }

  res.json({ html: cleanedHtml });
});


// ---------------------------------------------------------
// RESOLVE VIDEO URL: Resolves redirects and parses Pinterest / pin.it
// or general pages to fetch direct video streams in .mp4 format.
// ---------------------------------------------------------
app.post("/api/resolve-video", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: "A URL do vídeo é obrigatória." });
    return;
  }

  try {
    console.log(`[VIDEO-RESOLVER] Resolving incoming video request for: "${url}"`);
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
    
    // Follow redirect to obtain original pin page or actual resource
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
      },
      redirect: "follow"
    });

    const finalUrl = response.url;
    console.log(`[VIDEO-RESOLVER] Final URL resolved: "${finalUrl}"`);

    // If already direct mp4, return it
    if (finalUrl.toLowerCase().endsWith(".mp4") || finalUrl.toLowerCase().includes(".mp4?")) {
      res.json({ success: true, originalUrl: url, resolvedUrl: finalUrl });
      return;
    }

    const html = await response.text();
    
    // Unescape unicode structures, backslashes, and AMP encodings
    let cleanHtml = html
      .replace(/\\u002F/gi, "/")
      .replace(/\\u003a/gi, ":")
      .replace(/\\/g, "")
      .replace(/&amp;/g, "&");

    // Method pointer 1: secure_url meta og tags
    const ogVideoSecureMatch = cleanHtml.match(/<meta[^>]*?property="og:video:secure_url"[^>]*?content="([^"]+?\.mp4[^"]*?)"/i)
      || cleanHtml.match(/<meta[^>]*?property="og:video:secure_url"[^>]*?content="([^"]+?)"/i);
    if (ogVideoSecureMatch && ogVideoSecureMatch[1]) {
      const resolved = ogVideoSecureMatch[1];
      console.log(`[VIDEO-RESOLVER] Method 1 match: "${resolved}"`);
      res.json({ success: true, originalUrl: url, resolvedUrl: resolved });
      return;
    }

    // Method pointer 2: generic og:video tag
    const ogVideoMatch = cleanHtml.match(/<meta[^>]*?property="og:video"[^>]*?content="([^"]+?\.mp4[^"]*?)"/i)
      || cleanHtml.match(/<meta[^>]*?property="og:video"[^>]*?content="([^"]+?)"/i);
    if (ogVideoMatch && ogVideoMatch[1]) {
      const resolved = ogVideoMatch[1];
      console.log(`[VIDEO-RESOLVER] Method 2 match: "${resolved}"`);
      res.json({ success: true, originalUrl: url, resolvedUrl: resolved });
      return;
    }

    // Method pointer 3: Scan pinimg.com video CDN endpoints (e.g. h264 inside config/JSON blocks)
    const pinimgMp4Regex = /https?:\/\/[^\s"'`<>]+?\.pinimg\.com\/videos\/[^\s"'`<>]+?\.mp4[^\s"'`<>@]*/gi;
    const pinimgMatches = cleanHtml.match(pinimgMp4Regex);
    if (pinimgMatches && pinimgMatches.length > 0) {
      const resolved = pinimgMatches[0];
      console.log(`[VIDEO-RESOLVER] Method 3 match: "${resolved}"`);
      res.json({ success: true, originalUrl: url, resolvedUrl: resolved });
      return;
    }

    // Method pointer 4: Look for <video src="..."> markup tag
    const videoTagMatch = cleanHtml.match(/<video[^>]*?src="([^"]+?)"/i);
    if (videoTagMatch && videoTagMatch[1]) {
      const resolved = videoTagMatch[1];
      console.log(`[VIDEO-RESOLVER] Method 4 match: "${resolved}"`);
      res.json({ success: true, originalUrl: url, resolvedUrl: resolved });
      return;
    }

    // Method pointer 5: Look for any relative pinimg MP4 pattern
    const pinimgAnyRegex = /https?:\/\/[^\s"'`<>]+?pinimg\.com[^\s"'`<>]+?\.mp4[^\s"'`<>@]*/gi;
    const pinimgAnyMatches = cleanHtml.match(pinimgAnyRegex);
    if (pinimgAnyMatches && pinimgAnyMatches.length > 0) {
      const resolved = pinimgAnyMatches[0];
      console.log(`[VIDEO-RESOLVER] Method 5 match: "${resolved}"`);
      res.json({ success: true, originalUrl: url, resolvedUrl: resolved });
      return;
    }

    // If fallback, check general mp4 urls inside the body
    const genericMp4Regex = /https?:\/\/[^\s"'`<>]+?\.mp4[^\s"'`<>@]*/gi;
    const genericMatches = cleanHtml.match(genericMp4Regex);
    if (genericMatches && genericMatches.length > 0) {
      const resolved = genericMatches[0];
      console.log(`[VIDEO-RESOLVER] Method 6 (generic mp4) match: "${resolved}"`);
      res.json({ success: true, originalUrl: url, resolvedUrl: resolved });
      return;
    }

    // If no direct video can be resolved, log warning and let client know
    console.log(`[VIDEO-RESOLVER] FAILED to extract any direct MP4 from URL page.`);
    res.json({ 
      success: false, 
      message: "Não foi possível extrair um link de vídeo MP4 direto desta página de forma automatizada. Usando URL original como fallback.", 
      resolvedUrl: url 
    });

  } catch (error: any) {
    console.error("[VIDEO-RESOLVER] Critical resolution error:", error);
    res.json({ 
      success: false, 
      error: error.message, 
      resolvedUrl: url 
    });
  }
});


// ---------------------------------------------------------
// Vite Integration & Static Assets
// Setup server-side logic and load Vite in dev mode
// ---------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve build outputs
    app.use(express.static(distPath));
    
    // Fallback index.html for SPA
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LayonDevs AI Server running smoothly at http://localhost:${PORT}`);
  });
}

startServer();
