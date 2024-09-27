import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import { Wallet } from 'ethers';

export function generateSeedPhrase(): string {
  return Wallet.createRandom().mnemonic?.phrase || '';
}

export async function encryptSeedPhrase(seedPhrase: string, password: string): Promise<string> {
  return AES.encrypt(seedPhrase, password).toString();
}

export async function decryptSeedPhrase(encryptedSeedPhrase: string, password: string): Promise<string> {
  const bytes = AES.decrypt(encryptedSeedPhrase, password);
  return bytes.toString(enc.Utf8);
}

// Add this new function for seed phrase validation
export function isValidSeedPhrase(seedPhrase: string): boolean {
  try {
    Wallet.fromPhrase(seedPhrase);
    return true;
  } catch (error) {
    return false;
  }
}