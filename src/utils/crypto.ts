import { ethers } from 'ethers';

export function generateWallet(): ethers.HDNodeWallet {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
}

export function getAddressFromMnemonic(mnemonic: string): string {
  const wallet = ethers.HDNodeWallet.fromMnemonic(ethers.Mnemonic.fromPhrase(mnemonic));
  return wallet.address;
}

export async function encryptSeedPhrase(seedPhrase: string, password: string): Promise<string> {
  const wallet = ethers.Wallet.fromPhrase(seedPhrase);
  return wallet.encrypt(password);
}