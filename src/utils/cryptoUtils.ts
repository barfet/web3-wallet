import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';

export function generateSeedPhrase(): string {
  return ethers.Wallet.createRandom().mnemonic?.phrase || '';
}

export async function encryptSeedPhrase(seedPhrase: string, password: string): Promise<string> {
  return AES.encrypt(seedPhrase, password).toString();
}

export async function decryptSeedPhrase(encryptedSeedPhrase: string, password: string): Promise<string> {
  const bytes = AES.decrypt(encryptedSeedPhrase, password);
  return bytes.toString(enc.Utf8);
}