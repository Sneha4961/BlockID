/**
 * Utility functions for cryptographic operations using standard Web Crypto API (SHA-256, HMAC, KeyPairs)
 */

export async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateRandomHex(length: number = 32): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function generateDID(): Promise<{ did: string; publicKeyHex: string }> {
  const randomHex = generateRandomHex(16);
  const did = `did:blockid:0x${randomHex}`;
  const pubKeyHash = await sha256Hex(`pubkey_${randomHex}`);
  return { did, publicKeyHex: `0x${pubKeyHash.substring(0, 40)}` };
}

export async function createMockSignature(payload: string, privateKeySeed: string): Promise<string> {
  const combined = payload + ":" + privateKeySeed;
  const hash = await sha256Hex(combined);
  return `0x${hash.substring(0, 64)}...sig`;
}

export async function generateZKProofData(
  credentialId: string,
  claimPredicate: string,
  privateSecret: string
): Promise<{ commitmentHash: string; proofValue: string }> {
  const nonce = generateRandomHex(16);
  const commitmentRaw = `${credentialId}:${claimPredicate}:${privateSecret}:${nonce}`;
  const commitmentHash = await sha256Hex(commitmentRaw);

  const proofRaw = `zkproof_pi_${claimPredicate}_${commitmentHash}_${nonce}`;
  const proofValue = await sha256Hex(proofRaw);

  return {
    commitmentHash: `0xzk_${commitmentHash.substring(0, 32)}`,
    proofValue: `0xzkp_${proofValue.substring(0, 48)}`,
  };
}

export function truncateHash(hash: string, startLength: number = 6, endLength: number = 4): string {
  if (!hash) return "";
  if (hash.length <= startLength + endLength) return hash;
  return `${hash.substring(0, startLength)}...${hash.substring(hash.length - endLength)}`;
}
