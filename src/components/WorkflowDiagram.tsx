import React, { useState, useEffect } from "react";
import {
  GitFork,
  Building2,
  Cpu,
  Wallet,
  Lock,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Eye,
  Layers,
} from "lucide-react";

export const WorkflowDiagram: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("holder");

  const steps = [
    {
      stepNumber: 1,
      title: "1. Document Intake & Issuer Signing",
      source: "Issuer Authority",
      target: "Smart Contract & Holder",
      description:
        "The Issuer (University/Govt) authenticates the identity claim, computes SHA-256 Merkle root hash, and signs it using their private key.",
      payload: {
        action: "CREDENTIAL_ISSUE",
        issuerDid: "did:blockid:edu-mits-gwalior-official",
        holderDid: "did:blockid:0x8f3a1e94b27c6051d9e24a87310bc94f",
        sig: "0x89a1f2e4c90b21a3e...",
      },
    },
    {
      stepNumber: 2,
      title: "2. Smart Contract Registration",
      source: "Issuer Node",
      target: "BlockIDRegistry.sol",
      description:
        "The Merkle root hash and credential revocation anchor are broadcasted to the smart contract on Ethereum/EVM Sepolia.",
      payload: {
        txHash: "0x7d91e0a248f3b120aef13002a904322d81239c50e219ba48c3210ef890214a12",
        blockHeight: 1042890,
        gasUsed: 142090,
        status: "SUCCESS_ANCHORED",
      },
    },
    {
      stepNumber: 3,
      title: "3. Sovereign Wallet Storage",
      source: "Issuer Authority",
      target: "User Holder Wallet",
      description:
        "The full Verifiable Credential JSON is transmitted directly to the User's encrypted WebCrypto local vault. No raw PII is kept on central servers.",
      payload: {
        storageType: "WebCrypto IndexedDB Vault",
        encryption: "AES-GCM-256",
        control: "100% User Self-Sovereign",
      },
    },
    {
      stepNumber: 4,
      title: "4. Zero-Knowledge Proof Generation",
      source: "User Wallet",
      target: "ZK Circuit Engine",
      description:
        "When requested by a verifier, the User's wallet computes a zk-SNARK commitment proof (e.g. 'Prove Age >= 21') without revealing birthdate or name.",
      payload: {
        claimPredicate: "Age >= 21",
        commitmentHash: "0xzk_8f3910a29bc48ef12039a82f1023bc49",
        zkProofPi: "0xzkp_442109bc48ef12039a82f1023bc490d18203ef9281a02194",
        privacyStatus: "Zero Raw Data Disclosed",
      },
    },
    {
      stepNumber: 5,
      title: "5. Sub-Second Verifier Validation",
      source: "ZK Proof + Smart Contract",
      target: "Third-Party Verifier Engine",
      description:
        "The Verifier checks the cryptographic signature against the Issuer's on-chain public key, evaluates the ZK proof, and validates revocation state in < 1 second.",
      payload: {
        verificationStatus: "AUTHENTIC_VALID",
        latency: "0.8 seconds",
        cost: "$0.00 (Zero Central Intermediary)",
      },
    },
  ];

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsSimulating(false);
            return 0;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating, steps.length]);

  const nodes = [
    {
      id: "issuer",
      title: "Issuer Authority",
      subtitle: "University / Govt",
      icon: Building2,
      color: "border-blue-500/50 text-blue-400 bg-blue-950/40",
      description: "Generates & signs Verifiable Credentials using Secp256k1 keypairs.",
    },
    {
      id: "blockchain",
      title: "BlockIDRegistry.sol",
      subtitle: "EVM Smart Contract",
      icon: Cpu,
      color: "border-purple-500/50 text-purple-400 bg-purple-950/40",
      description: "Anchors Merkle roots & maintains active revocation registries.",
    },
    {
      id: "holder",
      title: "User Holder Wallet",
      subtitle: "Self-Sovereign DID Vault",
      icon: Wallet,
      color: "border-indigo-500/50 text-indigo-400 bg-indigo-950/40",
      description: "Stores encrypted VCs locally & generates Zero-Knowledge Proofs.",
    },
    {
      id: "zkp",
      title: "ZK Circuit Engine",
      subtitle: "zk-SNARK Prover",
      icon: Lock,
      color: "border-yellow-500/50 text-yellow-400 bg-yellow-950/40",
      description: "Computes mathematical proof polynomial for selective attribute disclosure.",
    },
    {
      id: "verifier",
      title: "Verifier Engine",
      subtitle: "Employers / Banks",
      icon: ShieldCheck,
      color: "border-emerald-500/50 text-emerald-400 bg-emerald-950/40",
      description: "Instantly validates signatures & ZK claims without seeing raw identity data.",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-lg">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              BlockID Architecture & Workflow Diagram
              <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                Slide 5 Specification
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive end-to-end data flow: Issuer ➔ Smart Contract ➔ Holder Wallet ➔ ZK Circuit ➔ Verifier
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setActiveStep(0);
              setIsSimulating(true);
            }}
            disabled={isSimulating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isSimulating ? "Simulating Pipeline Flow..." : "Run Live Workflow Simulation"}
          </button>
        </div>
      </div>

      {/* Visual Nodes Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            System Nodes & Data Vectors
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Current Step: <strong className="text-indigo-300">{steps[activeStep].title}</strong>
          </span>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isSelected = selectedNodeId === node.id;
            const isStepActive =
              (activeStep === 0 && (node.id === "issuer" || node.id === "holder")) ||
              (activeStep === 1 && (node.id === "issuer" || node.id === "blockchain")) ||
              (activeStep === 2 && node.id === "holder") ||
              (activeStep === 3 && (node.id === "holder" || node.id === "zkp")) ||
              (activeStep === 4 && (node.id === "zkp" || node.id === "verifier"));

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative ${
                  node.color
                } ${
                  isStepActive
                    ? "ring-2 ring-blue-400 shadow-xl scale-105"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                {isStepActive && (
                  <span className="absolute -top-2.5 right-3 bg-blue-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                    Active Vector
                  </span>
                )}

                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-black/30 rounded-xl border border-white/10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{node.title}</h4>
                    <p className="text-[10px] opacity-70">{node.subtitle}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">{node.description}</p>
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Interactive Stepper */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Step-by-Step Protocol Pipeline Controls:
            </p>
            <div className="flex gap-1">
              {steps.map((st, idx) => (
                <button
                  key={st.stepNumber}
                  onClick={() => {
                    setActiveStep(idx);
                    setIsSimulating(false);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all ${
                    activeStep === idx
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {st.stepNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Card */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold text-sm">
                  {steps[activeStep].stepNumber}
                </span>
                <h4 className="text-base font-bold text-white">{steps[activeStep].title}</h4>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="text-indigo-300 font-semibold">{steps[activeStep].source}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-purple-300 font-semibold">{steps[activeStep].target}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{steps[activeStep].description}</p>

            {/* Cryptographic Payload Inspector */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p className="font-semibold text-indigo-300 uppercase tracking-wider text-[10px]">
                Cryptographic Data Packet Transmitted:
              </p>
              <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto scrollbar-thin">
                {JSON.stringify(steps[activeStep].payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
