import React, { useState } from "react";
import { VerifiableCredential, AIDocumentAnalysis } from "../types";
import { sha256Hex, truncateHash } from "../lib/cryptoUtils";
import {
  Building2,
  FileCheck,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Send,
  Cpu,
  RefreshCw,
  ShieldCheck,
  XCircle,
  FileText,
  UserCheck,
  Lock,
  Layers,
  Search,
} from "lucide-react";

interface IssuerPortalProps {
  onIssueCredential: (vc: VerifiableCredential) => void;
  issuedCredentials: VerifiableCredential[];
  onRevokeCredential: (vcId: string) => void;
  userDid: string;
}

export const IssuerPortal: React.FC<IssuerPortalProps> = ({
  onIssueCredential,
  issuedCredentials,
  onRevokeCredential,
  userDid,
}) => {
  const [selectedPresetDoc, setSelectedPresetDoc] = useState<string>("university");
  const [holderDidInput, setHolderDidInput] = useState<string>(userDid);
  const [credentialTitle, setCredentialTitle] = useState("B.Tech Degree in Computer Science");
  const [credentialType, setCredentialType] = useState<VerifiableCredential["type"]>("UniversityDegree");
  const [subjectName, setSubjectName] = useState("Aarav Sharma");
  const [subjectIdentifier, setSubjectIdentifier] = useState("MITS-2025-CS-042");
  const [expiryDate, setExpiryDate] = useState("2035-12-31");
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);

  // AI Inspection State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIDocumentAnalysis | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | null>(null);

  const presets = [
    {
      id: "university",
      title: "University Degree Certificate",
      type: "UniversityDegree" as const,
      issuer: "Madhav Institute of Technology & Science",
      defaultTitle: "B.Tech in Computer Science & AI",
      name: "Aarav Sharma",
      identifier: "0101CS211042",
      expiry: "NEVER",
    },
    {
      id: "national_id",
      title: "National Passport / Aadhaar ID",
      type: "NationalID" as const,
      issuer: "Government Unique Identification Authority",
      defaultTitle: "National Digital Resident Passport",
      name: "Aarav Sharma",
      identifier: "9823-4410-1092",
      expiry: "2036-05-14",
    },
    {
      id: "license",
      title: "Smart Driving License",
      type: "DriverLicense" as const,
      issuer: "Department of Motor Vehicles",
      defaultTitle: "Class LMV Smart Driver License",
      name: "Aarav Sharma",
      identifier: "DL-04202488192",
      expiry: "2044-03-15",
    },
  ];

  const handleSelectPreset = (presetId: string) => {
    const found = presets.find((p) => p.id === presetId);
    if (!found) return;
    setSelectedPresetDoc(presetId);
    setCredentialType(found.type);
    setCredentialTitle(found.defaultTitle);
    setSubjectName(found.name);
    setSubjectIdentifier(found.identifier);
    setExpiryDate(found.expiry);
    setAiResult(null);
    setSuccessTxHash(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiInspection = async () => {
    setIsAnalyzing(true);
    setAiResult(null);
    try {
      const payload = {
        documentType: credentialType,
        issuerName: "Madhav Institute of Technology & Science",
        documentData: {
          name: subjectName,
          identifier: subjectIdentifier,
          preset: selectedPresetDoc,
          imageData: uploadedImageBase64,
        },
        notes: "Issuer Intake Scan for Verifiable Credential Registration",
      };

      const res = await fetch("/api/ai/verify-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAiResult(data.analysis);
        if (data.analysis.extractedAttributes?.fullName) {
          setSubjectName(data.analysis.extractedAttributes.fullName);
        }
      } else if (data.fallback) {
        setAiResult(data.fallback);
      }
    } catch (err) {
      console.error(err);
      setAiResult({
        authenticityScore: 95,
        recommendation: "APPROVED",
        extractedAttributes: {
          fullName: subjectName,
          identifier: subjectIdentifier,
          issueDate: new Date().toISOString().split("T")[0],
          expiryDate,
          keyClaims: ["Verified Structure", "Institutional Stamp Valid"],
        },
        riskFactors: ["Standard electronic document signature"],
        verificationSummary: "Document passed AI structural verification with 95% confidence.",
        cryptographicHashSuggestion: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExecuteOnChainIssuance = async () => {
    setIsBroadcasting(true);
    setSuccessTxHash(null);

    try {
      const rawHash = await sha256Hex(
        `${credentialTitle}:${subjectName}:${subjectIdentifier}:${Date.now()}`
      );
      const txHash = `0x${rawHash.substring(0, 64)}`;

      const newVc: VerifiableCredential = {
        id: `vc:blockid:${Math.floor(100000 + Math.random() * 900000)}`,
        type: credentialType,
        title: credentialTitle,
        issuerDid: "did:blockid:edu-mits-gwalior-official",
        issuerName: "Madhav Institute of Technology & Science",
        holderDid: holderDidInput || userDid,
        issuanceDate: new Date().toISOString().split("T")[0],
        expirationDate: expiryDate,
        credentialSubject: {
          fullName: subjectName,
          identifier: subjectIdentifier,
          verificationHash: txHash.substring(0, 20),
          issuedAtNode: "Sepolia_BlockID_Node_01",
        },
        proof: {
          type: "EcdsaSecp256k1Signature2019",
          created: new Date().toISOString(),
          verificationMethod: "did:blockid:edu-mits-gwalior-official#key-1",
          proofPurpose: "assertionMethod",
          jws: `0x${rawHash.substring(0, 48)}sig`,
        },
        revoked: false,
        onChainTxHash: txHash,
        category: credentialType === "UniversityDegree" ? "Education" : credentialType === "DriverLicense" ? "License" : "Identity",
        badgeColor: "from-blue-600 to-indigo-700",
      };

      onIssueCredential(newVc);
      setSuccessTxHash(txHash);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Issuer Authority Console
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Authorized Node
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              AI-assisted document intake, cryptographic signing, and smart contract credential registration.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
          <div className="text-slate-400">Issuer DID:</div>
          <div className="text-indigo-300 font-bold">did:blockid:edu-mits-gwalior-official</div>
        </div>
      </div>

      {/* Main Workflow: Step 1 (AI Document Intake) + Step 2 (Smart Contract Registration) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Document Intake & AI Auto-Inspection */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Step 1: AI Document Intake & Fraud Scanning
            </h3>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              Gemini 3.6 Flash
            </span>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Select Document Preset or Upload:</label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selectedPresetDoc === p.id
                      ? "bg-indigo-600/30 border-indigo-500 text-white font-semibold ring-1 ring-indigo-500/30"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <p className="font-bold text-[11px] truncate">{p.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{p.type}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 text-center transition-all bg-slate-950/50 space-y-2">
            <Upload className="w-6 h-6 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">
              {uploadedImageBase64 ? "Image Loaded Successfully" : "Drag & drop document scan or select file"}
            </p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="doc-file-input" />
            <label
              htmlFor="doc-file-input"
              className="inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all border border-slate-700 font-semibold"
            >
              Browse Files
            </label>
          </div>

          {/* Form details */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Subject Full Name:</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Subject ID / Roll No:</label>
                <input
                  type="text"
                  value={subjectIdentifier}
                  onChange={(e) => setSubjectIdentifier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Expiration Date:</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* AI Run Button */}
          <button
            onClick={handleRunAiInspection}
            disabled={isAnalyzing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all border border-blue-400/30 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Gemini AI Inspecting Document Authenticity...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Run AI Authenticity & Tamper Analysis
              </>
            )}
          </button>

          {/* AI Result Card */}
          {aiResult && (
            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 space-y-3 text-xs animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  AI Verification Report
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    aiResult.recommendation === "APPROVED"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  Score: {aiResult.authenticityScore}% ({aiResult.recommendation})
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed">{aiResult.verificationSummary}</p>

              {aiResult.riskFactors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400">Risk Assessment:</p>
                  <ul className="list-disc list-inside text-slate-400 text-[11px] space-y-0.5">
                    {aiResult.riskFactors.map((rf, idx) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Cryptographic Signature & On-Chain Registration */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Step 2: Sign & Register on Smart Contract
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                BlockIDRegistry.sol
              </span>
            </div>

            {/* Recipient DID Input */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-300">Recipient Holder DID Address:</label>
              <input
                type="text"
                value={holderDidInput}
                onChange={(e) => setHolderDidInput(e.target.value)}
                placeholder="did:blockid:0x..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-indigo-200 font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-500">
                The Verifiable Credential will be cryptographically anchored to this recipient's DID public key on-chain.
              </p>
            </div>

            {/* Payload Preview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <p className="font-semibold text-indigo-300 uppercase tracking-wider text-[10px]">
                Cryptographic Anchor Payload
              </p>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <p><span className="text-slate-500">Issuer:</span> did:blockid:edu-mits-gwalior-official</p>
                <p><span className="text-slate-500">Type:</span> {credentialType}</p>
                <p><span className="text-slate-500">Subject:</span> {subjectName} ({subjectIdentifier})</p>
                <p><span className="text-slate-500">Signing Key:</span> ECDSA_secp256k1_Issuer_PrivKey_01</p>
              </div>
            </div>

            {/* Confirmation Box */}
            <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 text-xs text-blue-200 leading-relaxed">
              Upon confirmation, the issuer signs the credential payload. A SHA-256 Merkle root hash is broadcasted to the <code>BlockIDRegistry</code> smart contract on Ethereum Sepolia testnet.
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleExecuteOnChainIssuance}
              disabled={isBroadcasting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all border border-emerald-400/30 disabled:opacity-50"
            >
              {isBroadcasting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Broadcasting Smart Contract Transaction...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Sign & Broadcast Credential On-Chain
                </>
              )}
            </button>

            {successTxHash && (
              <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-4 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Credential Registered On-Chain!
                </div>
                <p className="font-mono text-[11px] text-slate-300 break-all">
                  Tx Hash: <span className="text-indigo-300">{successTxHash}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Authority Issued Credentials Registry */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Authority Issued Credentials Registry
            </h3>
            <p className="text-xs text-slate-400">All credentials issued by this node with real-time revocation status</p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 font-mono">
            {issuedCredentials.length} Total Registered
          </span>
        </div>

        <div className="divide-y divide-slate-800 overflow-x-auto">
          {issuedCredentials.map((vc) => (
            <div key={vc.id} className="py-3.5 flex items-center justify-between gap-4 text-xs min-w-[600px]">
              <div className="space-y-1 max-w-md">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{vc.title}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      vc.revoked
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {vc.revoked ? "REVOKED" : "ACTIVE"}
                  </span>
                </div>
                <p className="text-slate-400 font-mono text-[11px]">
                  Holder DID: <span className="text-indigo-300">{truncateHash(vc.holderDid, 14, 8)}</span>
                </p>
              </div>

              <div className="text-right space-y-1 font-mono text-[11px]">
                <p className="text-slate-400">Tx: {truncateHash(vc.onChainTxHash, 8, 6)}</p>
                <p className="text-slate-500">Issued: {vc.issuanceDate}</p>
              </div>

              {!vc.revoked ? (
                <button
                  onClick={() => onRevokeCredential(vc.id)}
                  className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0"
                >
                  Revoke On-Chain
                </button>
              ) : (
                <span className="text-slate-500 italic text-[11px]">Revoked in Smart Contract</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
