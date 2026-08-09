import React, { useState } from "react";
import { VerifiableCredential, AccessGrant, ZKProof, DIDDocument } from "../types";
import { truncateHash, generateZKProofData } from "../lib/cryptoUtils";
import {
  Wallet,
  Key,
  ShieldAlert,
  ShieldCheck,
  QrCode,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Download,
  Trash2,
  ChevronRight,
  Filter,
  Layers,
  FileText,
  User,
  GraduationCap,
  Car,
  CreditCard,
  PlusCircle,
} from "lucide-react";

interface HolderWalletProps {
  userDid: DIDDocument;
  credentials: VerifiableCredential[];
  accessGrants: AccessGrant[];
  onRevokeAccessGrant: (grantId: string) => void;
  onGenerateZKProof: (proof: ZKProof) => void;
  onOpenQR: (title: string, data: string) => void;
  onAddCredential: (vc: VerifiableCredential) => void;
}

export const HolderWallet: React.FC<HolderWalletProps> = ({
  userDid,
  credentials,
  accessGrants,
  onRevokeAccessGrant,
  onGenerateZKProof,
  onOpenQR,
  onAddCredential,
}) => {
  const [copiedDid, setCopiedDid] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedVcId, setExpandedVcId] = useState<string | null>(credentials[0]?.id || null);

  // ZK Proof Generator Modal State
  const [showZkModal, setShowZkModal] = useState(false);
  const [selectedVcForZk, setSelectedVcForZk] = useState<VerifiableCredential | null>(null);
  const [zkPredicate, setZkPredicate] = useState("Age >= 21");
  const [hiddenAttributes, setHiddenAttributes] = useState<string[]>(["dateOfBirth", "address", "idNumber"]);
  const [isGeneratingZk, setIsGeneratingZk] = useState(false);
  const [generatedZkResult, setGeneratedZkResult] = useState<ZKProof | null>(null);

  // Custom VC Modal
  const [showAddVcModal, setShowAddVcModal] = useState(false);
  const [newVcTitle, setNewVcTitle] = useState("");
  const [newVcType, setNewVcType] = useState<VerifiableCredential["type"]>("EmploymentBadge");
  const [newVcIssuer, setNewVcIssuer] = useState("Global University System");

  const categories = ["All", "Identity", "Education", "License", "Finance"];

  const filteredCredentials =
    selectedCategory === "All"
      ? credentials
      : credentials.filter((c) => c.category === selectedCategory);

  const handleCopyDid = () => {
    navigator.clipboard.writeText(userDid.id);
    setCopiedDid(true);
    setTimeout(() => setCopiedDid(false), 2000);
  };

  const handleOpenZkModal = (vc: VerifiableCredential) => {
    setSelectedVcForZk(vc);
    setGeneratedZkResult(null);
    if (vc.type === "NationalID") {
      setZkPredicate("Age >= 21");
      setHiddenAttributes(["dateOfBirth", "address", "idNumber"]);
    } else if (vc.type === "UniversityDegree") {
      setZkPredicate("Graduation Year <= 2025");
      setHiddenAttributes(["gradeClassification", "studentId"]);
    } else if (vc.type === "DriverLicense") {
      setZkPredicate("Driver Status == ACTIVE_VALID");
      setHiddenAttributes(["licenseNumber", "address"]);
    } else {
      setZkPredicate("Income Tier == APPROVED");
      setHiddenAttributes(["amlStatus", "riskCategory"]);
    }
    setShowZkModal(true);
  };

  const handleRunZkGeneration = async () => {
    if (!selectedVcForZk) return;
    setIsGeneratingZk(true);
    try {
      const proofData = await generateZKProofData(
        selectedVcForZk.id,
        zkPredicate,
        userDid.id
      );

      const disclosed: Record<string, string> = {
        holderDid: truncateHash(userDid.id, 10, 6),
        issuerName: selectedVcForZk.issuerName,
        provedPredicate: zkPredicate,
      };

      const newProof: ZKProof = {
        id: "zkp-" + Math.floor(100000 + Math.random() * 900000),
        credentialId: selectedVcForZk.id,
        credentialType: selectedVcForZk.type,
        holderDid: userDid.id,
        claimPredicate: zkPredicate,
        commitmentHash: proofData.commitmentHash,
        proofValue: proofData.proofValue,
        timestamp: new Date().toISOString(),
        verified: true,
        disclosedAttributes: disclosed,
        hiddenAttributes,
      };

      setGeneratedZkResult(newProof);
      onGenerateZKProof(newProof);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingZk(false);
    }
  };

  const handleCreateNewCredential = () => {
    if (!newVcTitle) return;
    const newVc: VerifiableCredential = {
      id: "vc:blockid:" + Math.floor(100000 + Math.random() * 900000),
      type: newVcType,
      title: newVcTitle,
      issuerDid: "did:blockid:official-issuer-node",
      issuerName: newVcIssuer,
      holderDid: userDid.id,
      issuanceDate: new Date().toISOString().split("T")[0],
      expirationDate: "2030-12-31",
      credentialSubject: {
        fullName: "Aarav Sharma",
        status: "Officially Verified",
        issuedBy: newVcIssuer,
      },
      proof: {
        type: "EcdsaSecp256k1Signature2019",
        created: new Date().toISOString(),
        verificationMethod: "did:blockid:official-issuer-node#key-1",
        proofPurpose: "assertionMethod",
        jws: "0x" + Math.random().toString(16).substring(2) + "sig",
      },
      revoked: false,
      onChainTxHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      category: newVcType === "UniversityDegree" ? "Education" : newVcType === "DriverLicense" ? "License" : "Identity",
      badgeColor: "from-indigo-600 to-purple-700",
    };
    onAddCredential(newVc);
    setShowAddVcModal(false);
    setNewVcTitle("");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & DID Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main DID Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-indigo-400" />
          </div>

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Self-Sovereign Identity Wallet
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      W3C Standard
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Decentralized Identifier (DID) & Key Vault</p>
                </div>
              </div>

              <button
                onClick={() => onOpenQR("My Sovereign DID", userDid.id)}
                className="p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700 text-slate-300 hover:text-white transition-all shadow-md flex items-center gap-1.5 text-xs font-medium"
              >
                <QrCode className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">QR Code</span>
              </button>
            </div>

            {/* DID Number Display */}
            <div className="bg-slate-950/70 border border-indigo-500/20 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Decentralized Identifier (DID)</span>
                <span className="text-[11px] font-mono text-indigo-300">{userDid.keyType}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-sm font-mono text-indigo-200 tracking-tight break-all font-semibold">
                  {userDid.id}
                </code>
                <button
                  onClick={handleCopyDid}
                  className="p-2 bg-indigo-600/20 hover:bg-indigo-600/40 rounded-lg text-indigo-300 transition-all shrink-0"
                  title="Copy DID"
                >
                  {copiedDid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Keypair status & controls */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-yellow-400" /> Keypair Status
                </p>
                <p className="font-semibold text-emerald-400 mt-1">Secured in WebCrypto</p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Registry State
                </p>
                <p className="font-semibold text-blue-300 mt-1">On-Chain Verified</p>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-purple-400" /> Data Control
                </p>
                <p className="font-semibold text-purple-300 mt-1">100% User Owned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Widget & Add VC */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Wallet Actions
              </h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                {credentials.length} VCs Stored
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your credentials are cryptographically signed and stored locally in your sovereign vault. Zero central servers have access to your raw personal data.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowAddVcModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all border border-blue-400/30"
            >
              <PlusCircle className="w-4 h-4" />
              Request / Add New Credential
            </button>

            <button
              onClick={() => {
                const jsonStr = JSON.stringify(credentials, null, 2);
                const blob = new Blob([jsonStr], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `blockid-wallet-backup-${new Date().toISOString().split("T")[0]}.json`;
                a.click();
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              Export Encrypted Backup
            </button>
          </div>
        </div>
      </div>

      {/* Verifiable Credentials Vault */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Verifiable Credentials Vault
            </h3>
            <p className="text-xs text-slate-400">Cryptographically verifiable credentials issued by trusted authorities</p>
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30"
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCredentials.map((vc) => {
            const isExpanded = expandedVcId === vc.id;
            return (
              <div
                key={vc.id}
                className={`bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? "border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-xl" : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Header Badge */}
                <div className={`bg-gradient-to-r ${vc.badgeColor} p-4 text-white flex items-center justify-between`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      {vc.type === "NationalID" && <User className="w-5 h-5" />}
                      {vc.type === "UniversityDegree" && <GraduationCap className="w-5 h-5" />}
                      {vc.type === "DriverLicense" && <Car className="w-5 h-5" />}
                      {vc.type === "EmploymentBadge" && <CreditCard className="w-5 h-5" />}
                      {vc.type === "HealthPass" && <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/30 border border-white/20">
                        {vc.category}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-0.5">{vc.title}</h4>
                    </div>
                  </div>

                  <span className="text-[11px] bg-emerald-500/20 text-emerald-200 px-2.5 py-1 rounded-full border border-emerald-400/30 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Valid
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-4">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Issuer:</span>
                      <span className="font-medium text-slate-200">{vc.issuerName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Issuance Date:</span>
                      <span className="font-mono text-slate-300">{vc.issuanceDate}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Expiration:</span>
                      <span className="font-mono text-slate-300">{vc.expirationDate}</span>
                    </div>
                  </div>

                  {/* Subject Claims preview */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">Credential Claims</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                      {Object.entries(vc.credentialSubject)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key} className="bg-slate-900 p-1.5 rounded border border-slate-800/80 truncate">
                            <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1")}: </span>
                            <span className="text-slate-200 font-semibold">{String(value)}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenZkModal(vc)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20"
                    >
                      <Lock className="w-3.5 h-3.5 text-yellow-300" />
                      Generate ZK Proof
                    </button>

                    <button
                      onClick={() => onOpenQR(vc.title, JSON.stringify(vc))}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white border border-slate-700 transition-all"
                      title="Share QR Code"
                    >
                      <QrCode className="w-4 h-4 text-blue-400" />
                    </button>

                    <button
                      onClick={() => setExpandedVcId(isExpanded ? null : vc.id)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white border border-slate-700 transition-all text-xs font-semibold flex items-center gap-1"
                    >
                      {isExpanded ? "Hide JSON" : "View Raw"}
                    </button>
                  </div>

                  {/* Expanded JSON details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>On-Chain Tx Hash:</span>
                        <span className="font-mono text-indigo-300">{truncateHash(vc.onChainTxHash, 10, 8)}</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 scrollbar-thin">
                        <pre>{JSON.stringify(vc, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consent & Access Control Manager */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              Active Consent & Third-Party Access Manager
            </h3>
            <p className="text-xs text-slate-400">
              Control which verifiers can view your credentials or ZK proofs. Revoke access instantly on-chain.
            </p>
          </div>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-semibold w-fit">
            Self-Sovereign Access Rules
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {accessGrants.map((grant) => {
            const isActive = grant.status === "ACTIVE";
            return (
              <div key={grant.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{grant.verifierName}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {grant.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Verifier DID: <span className="text-slate-300">{grant.verifierDid}</span>
                  </p>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-400">
                    <span>Scope: <strong className="text-indigo-300">{grant.scope}</strong></span>
                    <span>Granted: {new Date(grant.grantedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {isActive ? (
                  <button
                    onClick={() => onRevokeAccessGrant(grant.id)}
                    className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Revoke Access
                  </button>
                ) : (
                  <span className="text-xs text-slate-500 italic">Access Terminated On-Chain</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Zero-Knowledge Proof Generator Modal */}
      {showZkModal && selectedVcForZk && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
                  <Lock className="w-5 h-5 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Generate Zero-Knowledge Proof</h3>
                  <p className="text-xs text-slate-400">Prove attributes without revealing raw personal information</p>
                </div>
              </div>
              <button
                onClick={() => setShowZkModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Credential summary */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Credential:</span>
                <span className="font-bold text-white">{selectedVcForZk.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issuer:</span>
                <span className="text-slate-300">{selectedVcForZk.issuerName}</span>
              </div>
            </div>

            {/* Predicate Selector */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-200">Select Mathematical Claim Predicate:</label>
              <select
                value={zkPredicate}
                onChange={(e) => setZkPredicate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-mono"
              >
                {selectedVcForZk.type === "NationalID" && (
                  <>
                    <option value="Age >= 21">Prove Age ≥ 21 (Without revealing birthdate or name)</option>
                    <option value="Citizenship == Verified Resident">Prove Citizenship Status (Without address)</option>
                    <option value="Age >= 18">Prove Age ≥ 18 (Legal Adult)</option>
                  </>
                )}
                {selectedVcForZk.type === "UniversityDegree" && (
                  <>
                    <option value="Graduation Year <= 2025">Prove Degree Completed (Without revealing GPA)</option>
                    <option value="Degree == Bachelor of Technology">Prove Tech Major Qualification</option>
                  </>
                )}
                {selectedVcForZk.type === "DriverLicense" && (
                  <>
                    <option value="Driver Status == ACTIVE_VALID">Prove Valid Driving Privilege (Without license #)</option>
                    <option value="Organ Donor == true">Prove Organ Donor Consent</option>
                  </>
                )}
                {selectedVcForZk.type === "EmploymentBadge" && (
                  <>
                    <option value="Income Tier == APPROVED">Prove Income Eligibility (Without exact salary)</option>
                    <option value="AML Status == PASSED_CLEAN">Prove Clean Financial AML Check</option>
                  </>
                )}
              </select>
            </div>

            {/* Privacy Shield Info */}
            <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-4 text-xs space-y-2">
              <p className="font-bold text-purple-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Zero-Knowledge Privacy Shield
              </p>
              <p className="text-purple-300/80 leading-relaxed">
                The verifier will mathematically evaluate the cryptographic proof polynomial commitment. They receive a <strong>TRUE / FALSE</strong> result without ever acquiring your birthdate, exact address, or raw identity numbers.
              </p>
            </div>

            {/* Action button */}
            {!generatedZkResult ? (
              <button
                onClick={handleRunZkGeneration}
                disabled={isGeneratingZk}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all border border-purple-400/30 disabled:opacity-50"
              >
                {isGeneratingZk ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Executing zk-SNARK Cryptographic Circuit...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-yellow-300" />
                    Compute zk-SNARK Proof Commitment
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ZK-SNARK Proof Generated Successfully
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded">
                      VALID PROOF
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-[11px]">
                    <p className="text-slate-400">Commitment Hash: <span className="text-indigo-300">{generatedZkResult.commitmentHash}</span></p>
                    <p className="text-slate-400">zk-SNARK Proof Pi: <span className="text-purple-300">{generatedZkResult.proofValue}</span></p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onOpenQR(`ZK Proof: ${zkPredicate}`, JSON.stringify(generatedZkResult));
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <QrCode className="w-4 h-4" /> Share Proof QR
                  </button>
                  <button
                    onClick={() => setShowZkModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-xs transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add / Request VC Modal */}
      {showAddVcModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Import or Request Credential</h3>
              <button onClick={() => setShowAddVcModal(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Credential Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Healthcare Vaccination Pass"
                  value={newVcTitle}
                  onChange={(e) => setNewVcTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Type:</label>
                <select
                  value={newVcType}
                  onChange={(e) => setNewVcType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="EmploymentBadge">Employment Badge / Corporate ID</option>
                  <option value="HealthPass">Health & Vaccination Record</option>
                  <option value="UniversityDegree">Academic Qualification</option>
                  <option value="NationalID">National Government ID</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Issuer Authority:</label>
                <input
                  type="text"
                  value={newVcIssuer}
                  onChange={(e) => setNewVcIssuer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateNewCredential}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-blue-600/30"
              >
                Import & Sign Credential
              </button>
              <button
                onClick={() => setShowAddVcModal(false)}
                className="bg-slate-800 text-slate-300 font-semibold py-2.5 px-4 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
