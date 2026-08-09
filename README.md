# Project Title : BlockID [HackMatrix2026]

BlockID is a Decentralized Digital Identity & Verification platform powered by blockchain smart contracts, self-sovereign DIDs, zero-knowledge proofs, and AI verification.

## Team Name
**DecentraTrust Innovators**  

---

## Problem Statement
Traditional centralized identity systems suffer from severe vulnerabilities and inefficiencies:
* **Centralized Data Breaches:** Corporate database hacks and PII leaks expose millions of raw identity records daily.
* **Manual Verification Friction:** Background checks (like verifying degrees or employment history) take 7–14 days and cost $30–$100 per check.
* **Zero User Privacy:** Users must hand over full unredacted copies of sensitive documents (Passports, National IDs) to third parties, losing data ownership.
* **AI-Generated Synthetic Fraud:** Photo and PDF uploads are easily manipulated using generative AI tools, making legacy digital checks highly unreliable.

---

## Solution Overview
BlockID implements a W3C-compliant Self-Sovereign Identity (SSI) and Zero-Knowledge verification layer:
* **Self-Sovereign Identity (W3C DID):** Eliminates centralized databases. Identity data lives securely in the user's encrypted local WebCrypto vault.
* **Sub-Second Verification (< 0.8s):** Decentralized smart contracts validate cryptographic signatures on-chain instantly for negligible gas costs.
* **Zero-Knowledge Privacy:** Enables users to prove claims (e.g., "Age &ge; 21" or "Graduated") without revealing raw underlying personal details.
* **Tamper-Proof Registry:** Uses ECDSA signatures and Merkle roots to secure identity credentials, rendering synthetic fraud impossible.
* **AI-Powered Insights:** Uses Gemini AI models for automated document intake, initial credential verification, and real-time fraud risk assessments.

---

## PPT Link 
https://drive.google.com/file/d/1ESPGUOpu443FUA8K04adXjYs8EYlFosM/view?usp=drive_link

---

## Live Demonstration Link
https://drive.google.com/file/d/1yopohgC95jclu8UupH3m0UCNGQ9stj_o/view

---

## Technology Stack
* **Frontend:** React (v19), TypeScript, Tailwind CSS, Motion (Framer Motion), Lucide React
* **Backend:** Node.js, Express, TypeScript Execution (`tsx`)
* **AI Integration:** Google Gemini API (`@google/genai`) for document analysis, VC verification, and anomaly detection
* **Cryptography & Web3:** W3C Decentralized Identifiers (DIDs), Verifiable Credentials (VCs), Zero-Knowledge Proofs (ZKPs) simulation, EVM-compatible Smart Contracts

---

## Team Members
* **Sneha** ([@Sneha4961](https://github.com/Sneha4961))


---

## Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Sneha4961/BlockID.git
   cd BlockID
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your Gemini API key:
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and add your key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

### Running the App
Start the local development server:
```bash
npm run dev
```

The application will be available at **`http://localhost:3000`**.
