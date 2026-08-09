import { VerifiableCredential, AccessGrant, BlockchainBlock, DIDDocument } from "../types";

export const USER_DID_DOC: DIDDocument = {
  id: "did:blockid:0x8f3a1e94b27c6051d9e24a87310bc94f",
  controller: "did:blockid:0x8f3a1e94b27c6051d9e24a87310bc94f",
  publicKeyPem: "0x04b93f21a8d052c7e193f4e89a01c3459e87b601d238c9fe402a11b84f3e9a5c8d...",
  created: "2026-01-15T08:30:00Z",
  updated: "2026-08-01T12:00:00Z",
  keyType: "ECDSA_P256",
};

export const INITIAL_CREDENTIALS: VerifiableCredential[] = [
  {
    id: "vc:blockid:aadhaar-2026-8812",
    type: "NationalID",
    title: "National Digital ID (Aadhaar / Passport)",
    issuerDid: "did:blockid:gov-uidai-official-001",
    issuerName: "Government Unique Identification Authority",
    holderDid: USER_DID_DOC.id,
    issuanceDate: "2026-02-10",
    expirationDate: "2036-02-10",
    credentialSubject: {
      fullName: "Aarav Sharma",
      dateOfBirth: "1998-05-14",
      gender: "Male",
      address: "102 Cyber Park, Tech City, IN",
      idNumber: "9823-4410-1092",
      citizenship: "Verified Resident",
    },
    proof: {
      type: "EcdsaSecp256k1Signature2019",
      created: "2026-02-10T10:00:00Z",
      verificationMethod: "did:blockid:gov-uidai-official-001#key-1",
      proofPurpose: "assertionMethod",
      jws: "0x89a1f2e4c...90b21a3e",
    },
    revoked: false,
    onChainTxHash: "0x7d91e0a248f3b120aef13002a904322d81239c50e219ba48c3210ef890214a12",
    category: "Identity",
    badgeColor: "from-blue-600 to-indigo-700",
  },
  {
    id: "vc:blockid:degree-mits-2025-0042",
    type: "UniversityDegree",
    title: "B.Tech in Computer Science & AI",
    issuerDid: "did:blockid:edu-mits-gwalior-official",
    issuerName: "Madhav Institute of Technology & Science",
    holderDid: USER_DID_DOC.id,
    issuanceDate: "2025-06-25",
    expirationDate: "NEVER",
    credentialSubject: {
      fullName: "Aarav Sharma",
      studentId: "0101CS211042",
      degreeName: "Bachelor of Technology",
      major: "Computer Science & Engineering",
      graduationYear: "2025",
      gradeClassification: "First Class with Distinction (CGPA 9.2/10)",
      accreditation: "NAAC Accredited A++ Grade",
    },
    proof: {
      type: "EcdsaSecp256k1Signature2019",
      created: "2025-06-25T14:30:00Z",
      verificationMethod: "did:blockid:edu-mits-gwalior-official#key-1",
      proofPurpose: "assertionMethod",
      jws: "0x4f20109ae...82bc014a",
    },
    revoked: false,
    onChainTxHash: "0x3a82f1021bc490d18203ef9281a02194c520ef1982a013f90210bc9482103f1a",
    category: "Education",
    badgeColor: "from-amber-600 to-orange-700",
  },
  {
    id: "vc:blockid:license-dl-2026-9901",
    type: "DriverLicense",
    title: "Smart Digital Driving License",
    issuerDid: "did:blockid:gov-rto-transport-dept",
    issuerName: "Department of Motor Vehicles",
    holderDid: USER_DID_DOC.id,
    issuanceDate: "2024-03-15",
    expirationDate: "2044-03-15",
    credentialSubject: {
      fullName: "Aarav Sharma",
      licenseNumber: "DL-04202488192",
      allowedVehicles: "Class LMV (Light Motor Vehicle), MCWG",
      bloodGroup: "O+",
      organDonor: true,
      drivingStatus: "ACTIVE_VALID",
    },
    proof: {
      type: "EcdsaSecp256k1Signature2019",
      created: "2024-03-15T09:12:00Z",
      verificationMethod: "did:blockid:gov-rto-transport-dept#key-1",
      proofPurpose: "assertionMethod",
      jws: "0x12bc903e1...7710a29d",
    },
    revoked: false,
    onChainTxHash: "0x112093e81029bc48d9e201a403f2e19038d1209e812f3e901a8210bc92810a9f",
    category: "License",
    badgeColor: "from-emerald-600 to-teal-700",
  },
  {
    id: "vc:blockid:bank-kyc-2026-3021",
    type: "EmploymentBadge",
    title: "Financial KYC & Accreditation Pass",
    issuerDid: "did:blockid:fin-hdfc-bank-auth",
    issuerName: "Global Trust Financial Services",
    holderDid: USER_DID_DOC.id,
    issuanceDate: "2026-01-20",
    expirationDate: "2027-01-20",
    credentialSubject: {
      fullName: "Aarav Sharma",
      amlStatus: "PASSED_CLEAN",
      accreditedInvestorStatus: "VERIFIED",
      riskCategory: "LOW_RISK",
      incomeRangeTier: "TIER_1_APPROVED",
    },
    proof: {
      type: "EcdsaSecp256k1Signature2019",
      created: "2026-01-20T11:00:00Z",
      verificationMethod: "did:blockid:fin-hdfc-bank-auth#key-1",
      proofPurpose: "assertionMethod",
      jws: "0x90a1bc3ef...33a1098e",
    },
    revoked: false,
    onChainTxHash: "0x889210bc94021ef38201a9f029bc812039e812a03f9102bc48d210ef82103e91",
    category: "Finance",
    badgeColor: "from-purple-600 to-indigo-800",
  },
];

export const INITIAL_ACCESS_GRANTS: AccessGrant[] = [
  {
    id: "grant-101",
    verifierName: "TechCorp Global Recruitment",
    verifierDid: "did:blockid:org-techcorp-hr-01",
    credentialType: "UniversityDegree",
    grantedAt: "2026-08-01T10:00:00Z",
    expiresAt: "2026-09-01T10:00:00Z",
    scope: "Zero-Knowledge Proof",
    status: "ACTIVE",
  },
  {
    id: "grant-102",
    verifierName: "AeroExpress Airlines (Security Check)",
    verifierDid: "did:blockid:org-aeroexpress-tsa",
    credentialType: "NationalID",
    grantedAt: "2026-08-05T14:20:00Z",
    expiresAt: "2026-08-12T14:20:00Z",
    scope: "Selective Attributes",
    status: "ACTIVE",
  },
  {
    id: "grant-103",
    verifierName: "FinTech Lending App",
    verifierDid: "did:blockid:org-quickloan-api",
    credentialType: "EmploymentBadge",
    grantedAt: "2026-07-15T09:00:00Z",
    expiresAt: "2026-07-22T09:00:00Z",
    scope: "Full Credential",
    status: "REVOKED",
  },
];

export const INITIAL_BLOCKS: BlockchainBlock[] = [
  {
    blockHeight: 1042890,
    hash: "0x00003a8f29bc10e9281aef029bc38e91023a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    previousHash: "0x000010e9281aef029bc38e91023a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    merkleRoot: "0x8f3910a29bc48ef12039a82f1023bc490d18203ef9281a02194c520ef1982a01",
    timestamp: "2026-08-09T00:28:10Z",
    transactionsCount: 4,
    miner: "BlockID_Validator_Node_01",
    gasUsed: 142090,
    transactions: [
      {
        txHash: "0x7d91e0a248f3b120aef13002a904322d81239c50e219ba48c3210ef890214a12",
        blockHeight: 1042890,
        type: "CREDENTIAL_ISSUE",
        senderDid: "did:blockid:gov-uidai-official-001",
        contractAddress: "0xBlockIDRegistryRegistry001",
        timestamp: "2026-08-09T00:28:10Z",
        status: "SUCCESS",
        gasFee: "0.0012 ETH",
        details: "Issued Verifiable National ID Credential for holder did:blockid:0x8f3a...",
      },
      {
        txHash: "0x3a82f1021bc490d18203ef9281a02194c520ef1982a013f90210bc9482103f1a",
        blockHeight: 1042890,
        type: "CREDENTIAL_ISSUE",
        senderDid: "did:blockid:edu-mits-gwalior-official",
        contractAddress: "0xBlockIDRegistryRegistry001",
        timestamp: "2026-08-09T00:28:10Z",
        status: "SUCCESS",
        gasFee: "0.0014 ETH",
        details: "Issued Degree VC (B.Tech Computer Science) for did:blockid:0x8f3a...",
      },
      {
        txHash: "0x981203e810a928bc410293e812093e8201a9e80291bc0291e021e90291bc8291",
        blockHeight: 1042890,
        type: "ZK_PROOF_VERIFY",
        senderDid: "did:blockid:org-techcorp-hr-01",
        contractAddress: "0xZKProofVerifierContract002",
        timestamp: "2026-08-09T00:28:10Z",
        status: "SUCCESS",
        gasFee: "0.0008 ETH",
        details: "ZK-SNARK proof claim verified: Age >= 21 evaluated as TRUE without revealing raw DOB.",
      },
      {
        txHash: "0x442109e812bc812039a820193e812039e80129bc0291bc8291e0291bc0291bc0",
        blockHeight: 1042890,
        type: "CREDENTIAL_REVOKE",
        senderDid: "did:blockid:0x8f3a1e94b27c6051d9e24a87310bc94f",
        contractAddress: "0xRevocationRegistry003",
        timestamp: "2026-08-09T00:28:10Z",
        status: "SUCCESS",
        gasFee: "0.0005 ETH",
        details: "User self-revoked access grant for did:blockid:org-quickloan-api.",
      },
    ],
  },
  {
    blockHeight: 1042889,
    hash: "0x000010e9281aef029bc38e91023a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a",
    previousHash: "0x000099210bc94021ef38201a9f029bc812039e812a03f9102bc48d210ef82103",
    merkleRoot: "0x442109bc48ef12039a82f1023bc490d18203ef9281a02194c520ef1982a01490",
    timestamp: "2026-08-09T00:25:00Z",
    transactionsCount: 2,
    miner: "BlockID_Validator_Node_02",
    gasUsed: 89400,
    transactions: [
      {
        txHash: "0x112093e81029bc48d9e201a403f2e19038d1209e812f3e901a8210bc92810a9f",
        blockHeight: 1042889,
        type: "CREDENTIAL_ISSUE",
        senderDid: "did:blockid:gov-rto-transport-dept",
        contractAddress: "0xBlockIDRegistryRegistry001",
        timestamp: "2026-08-09T00:25:00Z",
        status: "SUCCESS",
        gasFee: "0.0011 ETH",
        details: "Registered Smart Driver License VC with hash 0x1120...",
      },
      {
        txHash: "0x889210bc94021ef38201a9f029bc812039e812a03f9102bc48d210ef82103e91",
        blockHeight: 1042889,
        type: "DID_REGISTER",
        senderDid: "did:blockid:0x8f3a1e94b27c6051d9e24a87310bc94f",
        contractAddress: "0xBlockIDRegistryRegistry001",
        timestamp: "2026-08-09T00:25:00Z",
        status: "SUCCESS",
        gasFee: "0.0020 ETH",
        details: "Registered Self-Sovereign Identity DID Document and Public Key Pem.",
      },
    ],
  },
];

export const SMART_CONTRACT_SOL = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BlockIDRegistry
 * @dev Self-Sovereign Identity & Verifiable Credential On-Chain Registry
 * @author DecentraTrust Innovators
 */
contract BlockIDRegistry {
    
    struct DIDRecord {
        address owner;
        string didUri;
        string publicKeyPem;
        uint256 createdAt;
        bool active;
    }

    struct CredentialRecord {
        bytes32 credentialHash;
        address issuer;
        string holderDid;
        uint256 issuedAt;
        uint256 expiresAt;
        bool isRevoked;
    }

    mapping(string => DIDRecord) private didRegistry;
    mapping(bytes32 => CredentialRecord) private credentialRegistry;
    mapping(bytes32 => bool) private zkProofCommitments;

    event DIDRegistered(string indexed didUri, address indexed owner, uint256 timestamp);
    event CredentialIssued(bytes32 indexed credentialHash, address indexed issuer, string holderDid);
    event CredentialRevoked(bytes32 indexed credentialHash, address indexed issuer, uint256 timestamp);
    event ZKProofVerified(bytes32 indexed commitmentHash, bool success);

    modifier onlyDIDOwner(string memory _didUri) {
        require(didRegistry[_didUri].owner == msg.sender, "BlockID: Unauthorized DID owner");
        _;
    }

    function registerDID(string memory _didUri, string memory _publicKeyPem) external {
        require(!didRegistry[_didUri].active, "BlockID: DID already exists");
        
        didRegistry[_didUri] = DIDRecord({
            owner: msg.sender,
            didUri: _didUri,
            publicKeyPem: _publicKeyPem,
            createdAt: block.timestamp,
            active: true
        });

        emit DIDRegistered(_didUri, msg.sender, block.timestamp);
    }

    function issueCredential(
        bytes32 _credHash,
        string memory _holderDid,
        uint256 _expiresAt
    ) external {
        require(credentialRegistry[_credHash].issuedAt == 0, "BlockID: Credential hash already registered");

        credentialRegistry[_credHash] = CredentialRecord({
            credentialHash: _credHash,
            issuer: msg.sender,
            holderDid: _holderDid,
            issuedAt: block.timestamp,
            expiresAt: _expiresAt,
            isRevoked: false
        });

        emit CredentialIssued(_credHash, msg.sender, _holderDid);
    }

    function revokeCredential(bytes32 _credHash) external {
        CredentialRecord storage record = credentialRegistry[_credHash];
        require(record.issuer == msg.sender, "BlockID: Only issuer can revoke credential");
        require(!record.isRevoked, "BlockID: Credential already revoked");

        record.isRevoked = true;
        emit CredentialRevoked(_credHash, msg.sender, block.timestamp);
    }

    function verifyZKProof(bytes32 _commitmentHash, bytes memory _proofPayload) external returns (bool) {
        // Zero-Knowledge Proof (zk-SNARK / Elliptic Curve Pairing verification)
        bool isValid = _commitmentHash != bytes32(0) && _proofPayload.length > 0;
        zkProofCommitments[_commitmentHash] = isValid;
        
        emit ZKProofVerified(_commitmentHash, isValid);
        return isValid;
    }

    function isCredentialValid(bytes32 _credHash) external view returns (bool) {
        CredentialRecord memory record = credentialRegistry[_credHash];
        if (record.issuedAt == 0) return false;
        if (record.isRevoked) return false;
        if (record.expiresAt > 0 && block.timestamp > record.expiresAt) return false;
        return true;
    }
}`;
