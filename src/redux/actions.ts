import { Action } from 'redux';

export interface SetWalletAction extends Action<'SET_WALLET'> {
  payload: {
    address: string;
    encryptedSeedPhrase: string;
  };
}

export type WalletAction = SetWalletAction;

export const setWallet = (address: string, encryptedSeedPhrase: string): SetWalletAction => ({
  type: 'SET_WALLET',
  payload: { address, encryptedSeedPhrase },
});