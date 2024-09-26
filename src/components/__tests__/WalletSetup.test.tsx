import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import WalletSetup from '../WalletSetup';
import { ethers } from 'ethers';

jest.mock('ethers');
jest.mock('../../utils/crypto', () => ({
  encryptSeedPhrase: jest.fn().mockResolvedValue('encrypted_seed_phrase'),
}));

const mockStore = configureStore([]);

describe('WalletSetup Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
  });

  test('renders wallet setup form', () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <WalletSetup />
      </Provider>
    );

    expect(getByText('Wallet Setup')).toBeInTheDocument();
    expect(getByText('Generate New Wallet')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter seed phrase to import wallet')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(getByPlaceholderText('Confirm password')).toBeInTheDocument();
    expect(getByText('Create Wallet')).toBeInTheDocument();
    expect(getByText('Import Wallet')).toBeInTheDocument();
  });

  test('generates new wallet when button is clicked', () => {
    const mockWallet = {
      mnemonic: { phrase: 'test seed phrase' },
    };
    (ethers.Wallet.createRandom as jest.Mock).mockReturnValue(mockWallet);

    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <WalletSetup />
      </Provider>
    );

    fireEvent.click(getByText('Generate New Wallet'));

    expect(getByPlaceholderText('Enter seed phrase to import wallet')).toHaveValue('test seed phrase');
  });

  test('shows error when passwords do not match', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <WalletSetup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'password456' } });
    fireEvent.click(getByText('Create Wallet'));

    await waitFor(() => {
      expect(getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  test('shows error when password is too short', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <WalletSetup />
      </Provider>
    );

    fireEvent.change(getByPlaceholderText('Enter password'), { target: { value: 'short' } });
    fireEvent.change(getByPlaceholderText('Confirm password'), { target: { value: 'short' } });
    fireEvent.click(getByText('Create Wallet'));

    await waitFor(() => {
      expect(getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });
});