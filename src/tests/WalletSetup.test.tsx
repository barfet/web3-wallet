import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WalletSetup } from '@/components/WalletSetup';
import * as cryptoUtils from '@/utils/cryptoUtils';
import * as passwordUtils from '@/utils/passwordUtils';
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

// Mock passwordUtils functions
jest.mock('@/utils/passwordUtils', () => ({
  validatePassword: jest.fn(),
  getPasswordStrength: jest.fn(),
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

// Mock console.error
console.error = jest.fn();

describe('WalletSetup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (passwordUtils.validatePassword as jest.Mock).mockReturnValue(true);
    (passwordUtils.getPasswordStrength as jest.Mock).mockReturnValue('strong');
  });

  const mockOnComplete = jest.fn();
  const mockOnBack = jest.fn();

  // Unit Tests
  describe('Unit Tests', () => {
    test('renders WelcomePage initially', () => {
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      expect(screen.getByText('Web3 Wallet')).toBeInTheDocument();
      expect(screen.getByText('Create New Wallet')).toBeInTheDocument();
      expect(screen.getByText('Import Existing Wallet')).toBeInTheDocument();
    });

    test('generateSeedPhrase is called when creating a new wallet', async () => {
      const mockSeedPhrase = 'test seed phrase';
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockReturnValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
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
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
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
      
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      
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
      render(<WalletSetup initialStep="import" onComplete={mockOnComplete} onBack={mockOnBack} />);
      
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
      
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      
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
      render(<WalletSetup initialStep="import" onComplete={mockOnComplete} onBack={mockOnBack} />);
      
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

  // New tests for error handling and updated processes
  describe('Error Handling', () => {
    test('handles error when generating invalid seed phrase', async () => {
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockResolvedValue('invalid seed phrase');
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(false);
      
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      fireEvent.click(screen.getByText('Create New Wallet'));
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Generated invalid seed phrase');
      });
    });

    test('handles error when creating wallet fails', async () => {
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockRejectedValue(new Error('Wallet creation failed'));
      
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      fireEvent.click(screen.getByText('Create New Wallet'));
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error creating wallet:', expect.any(Error));
      });
    });

    test('handles error when importing invalid seed phrase', async () => {
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(false);
      
      render(<WalletSetup initialStep="import" onComplete={mockOnComplete} onBack={mockOnBack} />);
      fireEvent.click(screen.getByText('Import Existing Wallet'));
      fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: 'invalid seed phrase' } });
      fireEvent.click(screen.getByText('Import Wallet'));
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Invalid seed phrase');
      });
    });

    test('handles error when importing wallet fails', async () => {
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      (Wallet.fromPhrase as jest.Mock).mockImplementation(() => {
        throw new Error('Import failed');
      });
      
      render(<WalletSetup initialStep="import" onComplete={mockOnComplete} onBack={mockOnBack} />);
      fireEvent.click(screen.getByText('Import Existing Wallet'));
      fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: 'valid seed phrase' } });
      fireEvent.click(screen.getByText('Import Wallet'));
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error importing wallet:', expect.any(Error));
      });
    });
  });

  describe('Seed Phrase Validation', () => {
    test('uses isValidSeedPhrase for wallet creation', async () => {
      const mockSeedPhrase = 'valid test seed phrase';
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockResolvedValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      fireEvent.click(screen.getByText('Create New Wallet'));
      
      await waitFor(() => {
        expect(cryptoUtils.isValidSeedPhrase).toHaveBeenCalledWith(mockSeedPhrase);
      });
    });

    test('uses isValidSeedPhrase for wallet import', async () => {
      const mockSeedPhrase = 'valid imported seed phrase';
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      
      render(<WalletSetup initialStep="import" onComplete={mockOnComplete} onBack={mockOnBack} />);
      fireEvent.click(screen.getByText('Import Existing Wallet'));
      fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: mockSeedPhrase } });
      fireEvent.click(screen.getByText('Import Wallet'));
      
      await waitFor(() => {
        expect(cryptoUtils.isValidSeedPhrase).toHaveBeenCalledWith(mockSeedPhrase);
      });
    });
  });

  describe('Wallet Creation and Import Process', () => {
    test('creates wallet and moves to seed phrase display', async () => {
      const mockSeedPhrase = 'test seed phrase';
      (cryptoUtils.generateSeedPhrase as jest.Mock).mockResolvedValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      
      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      
      fireEvent.click(screen.getByText('Create New Wallet'));
      
      await waitFor(() => {
        expect(screen.getByText('Your Seed Phrase')).toBeInTheDocument();
        expect(screen.getByText(mockSeedPhrase)).toBeInTheDocument();
      }, { timeout: 10000 });
    });

    test('imports wallet and moves to password setup', async () => {
      const mockSeedPhrase = 'valid imported seed phrase';
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      
      render(<WalletSetup initialStep="import" onComplete={mockOnComplete} onBack={mockOnBack} />);
      
      fireEvent.click(screen.getByText('Import Existing Wallet'));
      
      await waitFor(() => {
        const input = screen.getByPlaceholderText('Enter your seed phrase');
        fireEvent.change(input, { target: { value: mockSeedPhrase } });
      });

      fireEvent.click(screen.getByText('Import Wallet'));
      
      await waitFor(() => {
        expect(screen.getByText('Set Your Password')).toBeInTheDocument();
      }, { timeout: 10000 });
    });
  });

  describe('Password Setup and Encryption', () => {
    test('encrypts seed phrase and stores wallet data', async () => {
      const mockSeedPhrase = 'test seed phrase';
      const mockPassword = 'securePassword123!';
      const mockEncryptedSeedPhrase = 'encryptedSeedPhrase';
      const mockWalletAddress = '0x1234567890123456789012345678901234567890';

      (cryptoUtils.generateSeedPhrase as jest.Mock).mockResolvedValue(mockSeedPhrase);
      (cryptoUtils.isValidSeedPhrase as jest.Mock).mockReturnValue(true);
      (cryptoUtils.encryptSeedPhrase as jest.Mock).mockResolvedValue(mockEncryptedSeedPhrase);
      (Wallet.fromPhrase as jest.Mock).mockReturnValue({ address: mockWalletAddress });

      render(<WalletSetup initialStep="create" onComplete={mockOnComplete} onBack={mockOnBack} />);
      
      // Create wallet
      fireEvent.click(screen.getByText('Create New Wallet'));
      
      // Move through seed phrase display and confirmation
      await waitFor(() => {
        fireEvent.click(screen.getByText('I have written down my seed phrase'));
        fireEvent.click(screen.getByText('Continue'));
      });

      // Confirm seed phrase
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase'), { target: { value: mockSeedPhrase } });
        fireEvent.click(screen.getByText('Confirm Seed Phrase'));
      });

      // Set password
      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: mockPassword } });
        fireEvent.change(screen.getByPlaceholderText('Confirm password'), { target: { value: mockPassword } });
        fireEvent.click(screen.getByText('Set Password'));
      });

      // Check if chrome.storage.local.set was called with correct data
      await waitFor(() => {
        expect(mockChromeStorage.set).toHaveBeenCalledWith(
          {
            encryptedSeedPhrase: mockEncryptedSeedPhrase,
            walletAddress: mockWalletAddress,
          },
          expect.any(Function)
        );
      });
    });
  });
});