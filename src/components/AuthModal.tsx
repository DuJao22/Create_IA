/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, ArrowRight, Sparkles } from "lucide-react";
import { User } from "../types";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro no servidor.");
      }

      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        {/* Glow decorative pattern */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-green-500/10 rounded-full blur-[80px]" />
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white transition-colors hover:bg-zinc-900 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full text-xs font-medium tracking-tight bg-green-500/10 text-green-400 border border-green-500/20">
            <Sparkles size={12} />
            Estúdio Layon Devs
          </div>
          <h2 className="text-3xl font-space font-medium text-white tracking-tight">
            {isLogin ? "Acessar Plataforma" : "Criar sua Conta"}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {isLogin 
              ? "Entre para salvar seus projetos e publicar landing páginas sofisticadas." 
              : "Cadastre-se gratuitamente para começar a criar landing pages cinematográficas."
            }
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl text-xs font-mono border border-red-500/20 bg-red-500/10 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-sm text-white placeholder-zinc-500 font-sans outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
              />
            </div>
          )}

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
              <Mail size={18} />
            </span>
            <input
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-sm text-white placeholder-zinc-500 font-sans outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
              <Lock size={18} />
            </span>
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 rounded-2xl text-sm text-white placeholder-zinc-500 font-sans outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-white text-black font-medium hover:bg-zinc-200 active:bg-zinc-300 disabled:opacity-50 disabled:pointer-events-none rounded-2xl text-sm transition-all shadow-md group"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? "Acessar Estúdio" : "Começar Agora"}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-900 pt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            {isLogin 
              ? "Ainda não tem conta? Clique aqui para criar" 
              : "Já possui uma conta? Faça login por aqui"
            }
          </button>
        </div>
      </div>
    </div>
  );
}
