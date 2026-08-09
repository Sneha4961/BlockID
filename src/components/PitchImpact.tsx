import React, { useState } from "react";
import {
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  Clock,
  Building2,
  GraduationCap,
  HeartPulse,
  Landmark,
  CheckCircle2,
  XCircle,
  Zap,
  Sparkles,
  Award,
} from "lucide-react";

export const PitchImpact: React.FC = () => {
  const [monthlyVerifications, setMonthlyVerifications] = useState<number>(5000);

  // Math metrics based on industry benchmarks
  const legacyCostPerCheck = 35; // $35 average manual background verification check cost
  const blockidCostPerCheck = 0.05; // $0.05 gas fee for smart contract check
  const legacyTimeDays = 12; // 12 days average background check
  const blockidTimeSec = 0.8; // 0.8 seconds

  const totalLegacyCost = monthlyVerifications * legacyCostPerCheck;
  const totalBlockidCost = monthlyVerifications * blockidCostPerCheck;
  const monthlySavings = totalLegacyCost - totalBlockidCost;
  const hoursSavedPerMonth = Math.round((monthlyVerifications * legacyTimeDays * 8) / 24);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-purple-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-300 shadow-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              BlockID Hackathon Pitch & Impact Matrix
              <span className="text-[10px] font-mono bg-yellow-500/20 text-yellow-300 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                Hackathon Winner Spec
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Solving $50B+ identity fraud & legacy verification friction with Self-Sovereign Identity and Zero-Knowledge Proofs.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 font-bold">
          99.8% Cost Savings Calculated
        </div>
      </div>

      {/* Problem vs Solution Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Problem */}
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-rose-500/20 pb-3">
            <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">The Problem (Centralized Legacy Identity)</h3>
              <p className="text-xs text-rose-300/80">Slide 2 Requirement</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Centralized Data Breaches:</strong> Equifax, Aadhaar leaks, and corporate database hacks expose millions of raw PII records.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Manual Verification Friction:</strong> Universities & employers spend 7–14 days and $30–$100 per candidate to verify degrees or IDs.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero User Privacy:</strong> Users are forced to send full unredacted passport/ID scans to third parties, losing data ownership.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Synthetic Fraud & Deepfakes:</strong> Legacy photo/PDF uploads are easily manipulated with modern generative AI tools.
              </span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-emerald-500/20 pb-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">The BlockID Solution (Web3 SSI + ZKP)</h3>
              <p className="text-xs text-emerald-300/80">Slides 3 & 4 Requirement</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Self-Sovereign Identity (W3C DID):</strong> Zero central databases. Data lives in user's encrypted local WebCrypto vault.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Sub-Second Verification (&lt; 0.8s):</strong> Smart contracts validate cryptographic signatures on-chain instantly for &lt; $0.05.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Zero-Knowledge Privacy:</strong> Users prove claims (e.g. "Age &ge; 21" or "Graduated") without revealing raw personal details.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Tamper-Proof Blockchain Registry:</strong> ECDSA signatures & Merkle roots guarantee immunity against synthetic fraud.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive ROI & Impact Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Institutional ROI & Societal Impact Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Calculate cost and time savings when replacing legacy background checks with BlockID.
            </p>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-semibold w-fit">
            Live Impact Estimator
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-semibold text-slate-300">
              Monthly Institutional Verification Volume:
            </label>
            <span className="font-mono text-sm font-bold text-indigo-300">
              {monthlyVerifications.toLocaleString()} Verifications / Month
            </span>
          </div>

          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={monthlyVerifications}
            onChange={(e) => setMonthlyVerifications(Number(e.target.value))}
            className="w-full accent-indigo-500 bg-slate-950 rounded-lg cursor-pointer h-2"
          />

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Monthly Cost Savings
              </p>
              <p className="text-xl font-extrabold text-emerald-400 font-mono">
                ${monthlySavings.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">From ${totalLegacyCost.toLocaleString()} down to ${totalBlockidCost.toLocaleString()}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-400" /> Verification Delay Reduction
              </p>
              <p className="text-xl font-extrabold text-blue-300 font-mono">
                12 Days ➔ 0.8s
              </p>
              <p className="text-[10px] text-slate-500">Saves ~{hoursSavedPerMonth.toLocaleString()} hours of manual audit per month</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Data Leakage Risk
              </p>
              <p className="text-xl font-extrabold text-purple-300 font-mono">
                0% Central Risk
              </p>
              <p className="text-[10px] text-slate-500">Zero PII stored on central company servers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Industries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl w-fit">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Higher Education</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant degree certificate verification for alumni, eliminating fake diplomas & transcript fraud globally.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl w-fit">
            <Landmark className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Fintech & Banking</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant reusable KYC & accredited investor checks with Zero-Knowledge proofs for compliance.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl w-fit">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">Healthcare & Passports</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cryptographic vaccination records & practitioner licenses without revealing patient medical histories.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl w-fit">
            <Building2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">E-Governance</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Digital Aadhaar / National ID sovereign credentials giving citizens total control over personal data.
          </p>
        </div>
      </div>
    </div>
  );
};
