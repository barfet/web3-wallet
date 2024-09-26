import { combineReducers } from 'redux';
import { WalletAction } from './actions';

interface WalletState {
  address: string | null;
  encryptedSeedPhrase: string | null;
}

const initialWalletState: WalletState = {
  address: null,
  encryptedSeedPhrase: null,
};

const walletReducer = (state = initialWalletState, action: WalletAction): WalletState => {
  switch (action.type) {
    case 'SET_WALLET':
      return {
        ...state,
        address: action.payload.address,
        encryptedSeedPhrase: action.payload.encryptedSeedPhrase,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  wallet: walletReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;