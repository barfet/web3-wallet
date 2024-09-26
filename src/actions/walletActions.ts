export const SET_WALLET = 'SET_WALLET';

export interface SetWalletAction {
  type: typeof SET_WALLET;
  payload: {
    address: string;
    encryptedSeedPhrase: string;
  };
}

export const setWallet = (address: string, encryptedSeedPhrase: string): SetWalletAction => ({
  type: SET_WALLET,
  payload: { address, encryptedSeedPhrase },
});