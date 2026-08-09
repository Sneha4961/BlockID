import React, { useState } from "react";
import { Role, VerifiableCredential, AccessGrant, BlockchainBlock, ZKProof } from "./types";
import { USER_DID_DOC, INITIAL_CREDENTIALS, INITIAL_ACCESS_GRANTS, INITIAL_BLOCKS } from "./data/initialState";
import { Header } from "./components/Header";
import { HolderWallet } from "./components/HolderWallet";
import { IssuerPortal } from "./components/IssuerPortal";
import { VerifierPortal } from "./components/VerifierPortal";
import { SmartContractExplorer } from "./components/SmartContractExplorer";
import { WorkflowDiagram } from "./components/WorkflowDiagram";
import { PitchImpact } from "./components/PitchImpact";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { QRModal } from "./components/QRModal";

export default function App() {
  const [activeRole, setActiveRole] = useState<Role>("holder");
  const [userDid] = useState(USER_DID_DOC);
  const [credentials, setCredentials] = useState<VerifiableCredential[]>(INITIAL_CREDENTIALS);
  const [accessGrants, setAccessGrants] = useState<AccessGrant[]>(INITIAL_ACCESS_GRANTS);
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(INITIAL_BLOCKS);
  const [zkProofs, setZkProofs] = useState<ZKProof[]>([]);

  // Modal states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [qrModalData, setQrModalData] = useState<{ isOpen: boolean; title: string; data: string }>({
    isOpen: false,
    title: "",
    data: "",
  });

  // Handlers
  const handleRevokeAccessGrant = (grantId: string) => {
    setAccessGrants((prev) =>
      prev.map((g) => (g.id === grantId ? { ...g, status: "REVOKED" } : g))
    );
  };

  const handleRevokeCredential = (vcId: string) => {
    setCredentials((prev) =>
      prev.map((c) => (c.id === vcId ? { ...c, revoked: true } : c))
    );
  };

  const handleAddCredential = (vc: VerifiableCredential) => {
    setCredentials((prev) => [vc, ...prev]);
  };

  const handleGenerateZKProof = (proof: ZKProof) => {
    setZkProofs((prev) => [proof, ...prev]);
  };

  const handleMineBlock = (newBlock: BlockchainBlock) => {
    setBlocks((prev) => [newBlock, ...prev]);
  };

  const handleOpenQR = (title: string, data: string) => {
    setQrModalData({ isOpen: true, title, data });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <Header
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onOpenAIAssistant={() => setIsAiModalOpen(true)}
        credentialCount={credentials.length}
        blockHeight={blocks[0]?.blockHeight || 1042890}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeRole === "holder" && (
          <HolderWallet
            userDid={userDid}
            credentials={credentials}
            accessGrants={accessGrants}
            onRevokeAccessGrant={handleRevokeAccessGrant}
            onGenerateZKProof={handleGenerateZKProof}
            onOpenQR={handleOpenQR}
            onAddCredential={handleAddCredential}
          />
        )}

        {activeRole === "issuer" && (
          <IssuerPortal
            userDid={userDid.id}
            issuedCredentials={credentials}
            onIssueCredential={handleAddCredential}
            onRevokeCredential={handleRevokeCredential}
          />
        )}

        {activeRole === "verifier" && (
          <VerifierPortal
            credentials={credentials}
            zkProofs={zkProofs}
            onOpenQRScanner={() =>
              handleOpenQR(
                "Scan Verifiable Credential QR",
                JSON.stringify(credentials[0])
              )
            }
          />
        )}

        {activeRole === "blockchain" && (
          <SmartContractExplorer blocks={blocks} onMineBlock={handleMineBlock} />
        )}

        {activeRole === "workflow" && <WorkflowDiagram />}

        {activeRole === "pitch" && <PitchImpact />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-400">
            BlockID &copy; 2026 DecentraTrust Innovators &bull; Madhav Institute of Technology & Science (MITS)
          </p>
          <p className="text-[11px] text-slate-600">
            Self-Sovereign Digital Identity & Verification Platform &bull; W3C DID + Zero-Knowledge Proofs + EVM Smart Contracts
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AIAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />

      <QRModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData({ isOpen: false, title: "", data: "" })}
        title={qrModalData.title}
        data={qrModalData.data}
      />
    </div>
  );
}
