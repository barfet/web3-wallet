import { ethers } from 'ethers';

export const encryptSeedPhrase = async (seedPhrase: string, password: string): Promise<string> => {
  const wallet = ethers.Wallet.fromMnemonic(seedPhrase);
  return await wallet.encrypt(password);
};

export const decryptSeedPhrase = async (encryptedJson: string, password: string): Promise<string> => {
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  return wallet.mnemonic.phrase;
};