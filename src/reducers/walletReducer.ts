import { SET_WALLET, SetWalletAction } from '../actions/walletActions';

interface WalletState {
  address: string | null;
  encryptedSeedPhrase: string | null;
}

const initialState: WalletState = {
  address: null,
  encryptedSeedPhrase: null,
};

export const walletReducer = (state = initialState, action: SetWalletAction): WalletState => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        address: action.payload.address,
        encryptedSeedPhrase: action.payload.encryptedSeedPhrase,
      };
    default:
      return state;
  }
};