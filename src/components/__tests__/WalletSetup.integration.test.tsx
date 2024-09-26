import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../../redux/reducers';
import thunk from 'redux-thunk';
import WalletSetup from '../WalletSetup';
import { ethers } from 'ethers';

jest.mock('ethers');
jest.mock('../../utils/crypto', () => ({
  encryptSeedPhrase: jest.fn().mockResolvedValue('encrypted_seed_phrase'),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('WalletSetup Integration', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    });
    store.dispatch = jest.fn();
  });

  test('creates a new wallet and dispatches action', async () => {
    const mockWallet = {
      mnemonic: { phrase: 'test seed phrase' },
      address: '0x1234567890123456789012345678901234567890',
    };
    (ethers.Wallet.createRandom as jest.Mock).mockReturnValue(mockWallet);
    (ethers.Wallet.fromMnemonic as jest.Mock).mockReturnValue(mockWallet);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <WalletSetup />
      </Provider>
    );

    fireEvent.click(getByText('Generate New Wallet'));
    fireEvent.change(getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Create Wallet'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SET_WALLET',
          payload: {
            address: '0x1234567890123456789012345678901234567890',
            encryptedSeedPhrase: 'encrypted_seed_phrase',
          },
        })
      );
    });
  });

  test('imports an existing wallet and dispatches action', async () => {
    const mockWallet = {
      mnemonic: { phrase: 'test seed phrase' },
      address: '0x1234567890123456789012345678901234567890',
    };
    (ethers.Wallet.fromMnemonic as jest.Mock).mockReturnValue(mockWallet);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <WalletSetup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Enter seed phrase to import wallet'), { target: { value: 'test seed phrase' } });
    fireEvent.change(getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Import Wallet'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SET_WALLET',
          payload: {
            address: '0x1234567890123456789012345678901234567890',
            encryptedSeedPhrase: 'encrypted_seed_phrase',
          },
        })
      );
    });
  });
});