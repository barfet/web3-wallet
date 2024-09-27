import { ethers } from 'ethers';
import { AES, enc } from 'crypto-js';
import { Wallet } from 'ethers';

// New imports for Web Crypto API
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function generateSeedPhrase(): Promise<string> {
  return ethers.Wallet.createRandom().mnemonic?.phrase || '';
}

export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSeedPhrase(seedPhrase: string, password: string): Promise<string> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(password, salt);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encoder.encode(seedPhrase)
  );
  const encryptedArray = new Uint8Array(salt.length + iv.length + new Uint8Array(encryptedData).length);
  encryptedArray.set(salt, 0);
  encryptedArray.set(iv, salt.length);
  encryptedArray.set(new Uint8Array(encryptedData), salt.length + iv.length);
  return btoa(String.fromCharCode.apply(null, Array.from(encryptedArray)));
}

export async function decryptSeedPhrase(encryptedSeedPhrase: string, password: string): Promise<string> {
  const encryptedArray = new Uint8Array(atob(encryptedSeedPhrase).split('').map(char => char.charCodeAt(0)));
  const salt = encryptedArray.slice(0, 16);
  const iv = encryptedArray.slice(16, 28);
  const data = encryptedArray.slice(28);
  const key = await deriveKey(password, salt);
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );
  return decoder.decode(decryptedData);
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