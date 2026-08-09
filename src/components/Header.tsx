import React from "react";
import { Role } from "../types";
import {
  ShieldCheck,
  Wallet,
  Building2,
  CheckCircle2,
  Cpu,
  GitFork,
  TrendingUp,
  Bot,
  Layers,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  onOpenAIAssistant: () => void;
  credentialCount: number;
  blockHeight: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  setActiveRole,
  onOpenAIAssistant,
  credentialCount,
  blockHeight,
}) => {
  const roles: { id: Role; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "holder", label: "User Wallet", icon: Wallet },
    { id: "issuer", label: "Issuer Portal", icon: Building2 },
    { id: "verifier", label: "Verifier Engine", icon: CheckCircle2 },
    { id: "blockchain", label: "Smart Contracts", icon: Cpu },
    { id: "workflow", label: "Architecture Flow", icon: GitFork },
    { id: "pitch", label: "Hackathon Pitch", icon: TrendingUp },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      {/* Top Banner / Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-1 text-xs font-medium text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            Hackathon Edition
          </span>
          <span>BlockID: Decentralized Digital Identity & Verification Platform</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-200">Ethereum Sepolia Live</span>
          </span>
          <span>Block #{blockHeight}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveRole("holder")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  BlockID
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  W3C DID + ZKP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Self-Sovereign Identity Trust Protocol</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-slate-300">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Layers className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-[10px] text-slate-400">Stored Credentials</p>
                <p className="font-semibold text-white">{credentialCount} Active VCs</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Cpu className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-[10px] text-slate-400">Zero-Knowledge Proofs</p>
                <p className="font-semibold text-white">zk-SNARK Ready</p>
              </div>
            </div>
          </div>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all border border-blue-400/30 group"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="hidden sm:inline">AI Identity Advisor</span>
            <span className="sm:hidden">AI Advisor</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-4 flex space-x-1 sm:space-x-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
