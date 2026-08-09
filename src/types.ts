export type Role = "holder" | "issuer" | "verifier" | "blockchain" | "workflow" | "pitch";

export interface DIDDocument {
  id: string; // e.g., "did:blockid:0x7a8f...39c2"
  controller: string;
  publicKeyPem: string;
  created: string;
  updated: string;
  keyType: "ECDSA_P256" | "Ed25519";
}

export type CredentialType = "NationalID" | "UniversityDegree" | "DriverLicense" | "HealthPass" | "EmploymentBadge";

export interface VerifiableCredential {
  id: string; // e.g. "vc:blockid:983421"
  type: CredentialType;
  title: string;
  issuerDid: string;
  issuerName: string;
  holderDid: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: Record<string, any>;
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws: string; // Cryptographic Signature
  };
  revoked: boolean;
  onChainTxHash: string;
  category: "Identity" | "Education" | "License" | "Health" | "Employment" | "Finance";
  badgeColor: string;
}

export interface ZKProof {
  id: string;
  credentialId: string;
  credentialType: CredentialType;
  holderDid: string;
  claimPredicate: string; // e.g., "Age >= 21" or "Degree Status == Graduated"
  commitmentHash: string;
  proofValue: string;
  timestamp: string;
  verified: boolean;
  disclosedAttributes: Record<string, string>; // Attributes user explicitly chose to reveal
  hiddenAttributes: string[]; // Names of hidden attributes
}

export interface AccessGrant {
  id: string;
  verifierName: string;
  verifierDid: string;
  credentialType: CredentialType;
  grantedAt: string;
  expiresAt: string;
  scope: "Full Credential" | "Zero-Knowledge Proof" | "Selective Attributes";
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
}

export interface BlockchainBlock {
  blockHeight: number;
  hash: string;
  previousHash: string;
  merkleRoot: string;
  timestamp: string;
  transactionsCount: number;
  miner: string;
  gasUsed: number;
  transactions: BlockchainTx[];
}

export interface BlockchainTx {
  txHash: string;
  blockHeight: number;
  type: "DID_REGISTER" | "CREDENTIAL_ISSUE" | "CREDENTIAL_REVOKE" | "ZK_PROOF_VERIFY";
  senderDid: string;
  contractAddress: string;
  timestamp: string;
  status: "SUCCESS" | "FAILED";
  gasFee: string;
  details: string;
}

export interface AIDocumentAnalysis {
  authenticityScore: number;
  recommendation: "APPROVED" | "REJECTED" | "NEEDS_HUMAN_REVIEW";
  extractedAttributes: {
    fullName?: string;
    identifier?: string;
    issueDate?: string;
    expiryDate?: string;
    keyClaims?: string[];
  };
  riskFactors: string[];
  verificationSummary: string;
  cryptographicHashSuggestion: string;
}

export interface AIFraudReport {
  fraudRiskScore: number;
  status: "VALID" | "SUSPICIOUS" | "INVALID";
  signatureValid: boolean;
  revocationChecked: boolean;
  zkProofValid: boolean;
  aiSecurityNote: string;
  flags: string[];
}
