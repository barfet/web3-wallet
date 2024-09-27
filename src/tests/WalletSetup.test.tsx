import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WalletSetup } from '@/components/WalletSetup';
import * as cryptoUtils from '@/utils/cryptoUtils';
import { Wallet } from 'ethers';

// Mock chrome.storage.local
const mockChromeStorage = {
  set: jest.fn((data, callback) => callback()),
};
global.chrome = {
  storage: {
    local: mockChromeStorage,
  },
} as any;

// Mock cryptoUtils functions
jest.mock('@/utils/cryptoUtils', () => ({
  generateSeedPhrase: jest.fn(),
  encryptSeedPhrase: jest.fn(),
  isValidSeedPhrase: jest.fn(),
}));

// Mock ethers Wallet
jest.mock('ethers', () => ({
  Wallet: {
    createRandom: jest.fn(() => ({
      mnemonic: { phrase: 'test seed phrase' },
    })),
    fromPhrase: jest.fn(() => ({
      address: '0x1234567890123456789012345678901234567890',
    })),
  },
}));

describe('WalletSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Unit Tests
  describe('Unit Tests', () => {
    test('renders WelcomePage initially', () => {
      render(<WalletSetup />);
      expect(screen.getByText('Web3 Wallet')).toBeInTheDocument();
      expect(screen.getByText('Create New Wallet')).toBeInTheDocument();
      expect(screen.getByText('Import Existing Wallet')).toBeInTheDocument();
    });

    test('generateSeedPhrase is called when creating a new wallet', async () => {
      const mockSeedPhrase = 'test seed phrase';
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockReturnValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      render(<WalletSetup />);
      fireEvent.click(screen.getByText('Create New Wallet'));
      await waitFor(() => {
        expect(cryptoUtils.generateSeedPhrase).toHaveBeenCalled();
        expect(screen.getByText('Your Seed Phrase')).toBeInTheDocument();
        expect(screen.getByText(mockSeedPhrase)).toBeInTheDocument();
      });
    });

    test('displays SeedPhraseDisplay component after wallet creation', async () => {
      const mockSeedPhrase = 'test seed phrase';
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockReturnValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      render(<WalletSetup />);
      fireEvent.click(screen.getByText('Create New Wallet'));
      await waitFor(() => {
        expect(screen.getByText('Your Seed Phrase')).toBeInTheDocument();
        expect(screen.getByText(mockSeedPhrase)).toBeInTheDocument();
      });
    });
  });

  // Integration Tests
  describe('Integration Tests', () => {
    test('completes wallet creation flow', async () => {
      const mockSeedPhrase = 'test seed phrase';
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockReturnValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      (cryptoUtils.encryptSeedPhrase as jest.Mock).mockResolvedValue('encrypted_seed_phrase');
      
      render(<WalletSetup />);
      
      // Create new wallet
      fireEvent.click(screen.getByText('Create New Wallet'));
      
      // Confirm seed phrase display
      await waitFor(() => {
        expect(screen.getByText('Your Seed Phrase')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('I have written down my seed phrase'));
      fireEvent.click(screen.getByText('Continue'));
      
      // Confirm seed phrase
      await waitFor(() => {
        expect(screen.getByText('Confirm Your Seed Phrase')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: mockSeedPhrase } });
      fireEvent.click(screen.getByText('Confirm Seed Phrase'));
      
      // Set password
      await waitFor(() => {
        expect(screen.getByText('Set Your Password')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Set Password'));
      
      // Check if chrome.storage.local.set was called
      await waitFor(() => {
        expect(mockChromeStorage.set).toHaveBeenCalled();
      });
    });

    test('handles wallet import flow', async () => {
      const mockSeedPhrase = 'valid seed phrase for import';
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      render(<WalletSetup />);
      
      // Navigate to import wallet
      fireEvent.click(screen.getByText('Import Existing Wallet'));
      
      // Enter seed phrase
      fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: mockSeedPhrase } });
      fireEvent.click(screen.getByText('Import Wallet'));
      
      // Set password
      await waitFor(() => {
        expect(screen.getByText('Set Your Password')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password123' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Set Password'));
      
      // Check if chrome.storage.local.set was called
      await waitFor(() => {
        expect(mockChromeStorage.set).toHaveBeenCalled();
      });
    });
  });

  // Acceptance Tests
  describe('Acceptance Tests', () => {
    test('User can create a new wallet', async () => {
      const mockSeedPhrase = 'test seed phrase';
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockReturnValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      (cryptoUtils.encryptSeedPhrase as jest.Mock).mockResolvedValue('encrypted_seed_phrase');
      
      render(<WalletSetup />);
      
      // User clicks "Create New Wallet"
      fireEvent.click(screen.getByText('Create New Wallet'));
      
      // User sees the seed phrase
      await waitFor(() => {
        expect(screen.getByText('Your Seed Phrase')).toBeInTheDocument();
        expect(screen.getByText(mockSeedPhrase)).toBeInTheDocument();
      });
      
      // User confirms they've written down the seed phrase
      fireEvent.click(screen.getByText('I have written down my seed phrase'));
      fireEvent.click(screen.getByText('Continue'));
      
      // User confirms the seed phrase
      await waitFor(() => {
        expect(screen.getByText('Confirm Your Seed Phrase')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: mockSeedPhrase } });
      fireEvent.click(screen.getByText('Confirm Seed Phrase'));
      
      // User sets a password
      await waitFor(() => {
        expect(screen.getByText('Set Your Password')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'securePassword123!' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'securePassword123!' } });
      fireEvent.click(screen.getByText('Set Password'));
      
      // Verify that the wallet is created and stored
      await waitFor(() => {
        expect(mockChromeStorage.set).toHaveBeenCalledWith(
          expect.objectContaining({
            encryptedSeedPhrase: 'encrypted_seed_phrase',
            walletAddress: expect.any(String),
          }),
          expect.any(Function)
        );
      });
    });

    test('User can import an existing wallet', async () => {
      const mockSeedPhrase = 'valid test seed phrase for import';
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      render(<WalletSetup />);
      
      // User clicks "Import Existing Wallet"
      fireEvent.click(screen.getByText('Import Existing Wallet'));
      
      // User enters a valid seed phrase
      fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: mockSeedPhrase } });
      fireEvent.click(screen.getByText('Import Wallet'));
      
      // User sets a password
      await waitFor(() => {
        expect(screen.getByText('Set Your Password')).toBeInTheDocument();
      });
      fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'securePassword123!' } });
      fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: 'securePassword123!' } });
      fireEvent.click(screen.getByText('Set Password'));
      
      // Verify that the wallet is imported and stored
      await waitFor(() => {
        expect(mockChromeStorage.set).toHaveBeenCalledWith(
          expect.objectContaining({
            encryptedSeedPhrase: expect.any(String),
            walletAddress: expect.any(String),
          }),
          expect.any(Function)
        );
      });
    });
  });
});