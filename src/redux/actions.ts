import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './reducers';

export interface SetWalletAction extends Action<'SET_WALLET'> {
  type: 'SET_WALLET';
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

export const setWalletThunk = (
  address: string,
  encryptedSeedPhrase: string
): ThunkAction<void, RootState, unknown, WalletAction> => {
  return (dispatch) => {
    dispatch(setWallet(address, encryptedSeedPhrase));
  };
};