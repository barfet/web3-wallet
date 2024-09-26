import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../redux/reducers';
import App from '../components/App';
import { ethers } from 'ethers';

jest.mock('ethers', () => ({
  Wallet: {
    createRandom: jest.fn().mockReturnValue({
      mnemonic: { phrase: 'test seed phrase' },
      address: '0x1234567890123456789012345678901234567890',
    }),
  },
  HDNodeWallet: {
    fromMnemonic: jest.fn().mockReturnValue({
      address: '0x1234567890123456789012345678901234567890',
    }),
  },
  Mnemonic: {
    fromPhrase: jest.fn().mockReturnValue({}),
    isValidMnemonic: jest.fn().mockReturnValue(true),
  },
}));

jest.mock('../utils/crypto', () => ({
  encryptSeedPhrase: jest.fn().mockResolvedValue('encrypted_seed_phrase'),
}));

describe('Wallet Setup Acceptance Tests', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: rootReducer });
    const mockChromeStorage = {
      local: {
        get: jest.fn(),
        set: jest.fn(),
        getBytesInUse: jest.fn(),
        clear: jest.fn(),
        remove: jest.fn(),
      },
      sync: {},
      managed: {},
      session: {},
      onChanged: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
        hasListeners: jest.fn(),
      },
    };
    global.chrome = {
      storage: mockChromeStorage,
    } as unknown as typeof chrome;
  });

  test('User can create a new wallet', async () => {
    const mockWallet = {
      mnemonic: { phrase: 'test seed phrase' },
      address: '0x1234567890123456789012345678901234567890',
    };
    (ethers.Wallet.createRandom as jest.Mock).mockReturnValue(mockWallet);
    (ethers.HDNodeWallet.fromMnemonic as jest.Mock).mockReturnValue(mockWallet);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Wait for the app to load
    await waitFor(() => getByText('Web3 Wallet'));

    fireEvent.click(getByText('Generate New Wallet'));
    fireEvent.change(getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Create Wallet'));

    await waitFor(() => {
      expect(getByText('Wallet Address:')).toBeInTheDocument();
      expect(getByText('0x1234567890123456789012345678901234567890')).toBeInTheDocument();
    });
  });

  test('User can import an existing wallet', async () => {
    const mockWallet = {
      mnemonic: { phrase: 'test seed phrase' },
      address: '0x1234567890123456789012345678901234567890',
    };
    (ethers.HDNodeWallet.fromMnemonic as jest.Mock).mockReturnValue(mockWallet);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Wait for the app to load
    await waitFor(() => getByText('Web3 Wallet'));

    fireEvent.change(getByPlaceholderText('Enter seed phrase to import wallet'), { target: { value: 'test seed phrase' } });
    fireEvent.change(getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Import Wallet'));

    await waitFor(() => {
      expect(getByText('Wallet Address:')).toBeInTheDocument();
      expect(getByText('0x1234567890123456789012345678901234567890')).toBeInTheDocument();
    });
  });

  test('User sees an error for invalid seed phrase', async () => {
    (ethers.Mnemonic.fromPhrase as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid mnemonic');
    });

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Wait for the app to load
    await waitFor(() => getByText('Web3 Wallet'));

    fireEvent.change(getByPlaceholderText('Enter seed phrase to import wallet'), { target: { value: 'invalid seed phrase' } });
    fireEvent.change(getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Import Wallet'));

    await waitFor(() => {
      expect(getByText(/Invalid seed phrase or error importing wallet/)).toBeInTheDocument();
    });
  });
});