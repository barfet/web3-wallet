import { useState, useEffect, useCallback } from 'react'
import { ethers, JsonRpcProvider, parseEther, formatEther } from 'ethers'
import { decryptSeedPhrase } from '@/utils/cryptoUtils'

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [balance, setBalance] = useState<string>('0')
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null)

  useEffect(() => {
    const initWallet = async () => {
      try {
        // Retrieve the encrypted seed phrase and wallet address from chrome.storage.local
        const result = await chrome.storage.local.get(['encryptedSeedPhrase', 'walletAddress'])
        if (result.walletAddress) {
          setWalletAddress(result.walletAddress)
        }

        // Connect to the Ethereum network (use a testnet for development)
        const newProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL)
        setProvider(newProvider)

        // Get the balance
        if (result.walletAddress) {
          const balance = await newProvider.getBalance(result.walletAddress)
          setBalance(formatEther(balance))
        }
      } catch (error) {
        console.error('Error initializing wallet:', error)
      }
    }

    initWallet()
  }, [])

  const sendTransaction = useCallback(async (to: string, amount: string, gasSpeed: string) => {
    if (!provider) throw new Error('Provider not initialized')

    try {
      // Retrieve the encrypted seed phrase from chrome.storage.local
      const result = await chrome.storage.local.get(['encryptedSeedPhrase'])
      if (!result.encryptedSeedPhrase) throw new Error('No wallet found')

      // TODO: Implement a secure way to get the user's password
      const password = 'user_password' // This should be securely obtained from the user

      // Decrypt the seed phrase
      const seedPhrase = await decryptSeedPhrase(result.encryptedSeedPhrase, password)

      // Create a wallet instance from the seed phrase
      const wallet = ethers.Wallet.fromPhrase(seedPhrase).connect(provider)

      const amountWei = parseEther(amount)
      const gasPrice = await getGasPrice(gasSpeed)

      const tx = await wallet.sendTransaction({
        to,
        value: amountWei,
        gasPrice,
      })

      await tx.wait()

      // Update balance after transaction
      const newBalance = await provider.getBalance(wallet.address)
      setBalance(formatEther(newBalance))

      return tx.hash
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  }, [provider])

  const getGasPrice = useCallback(async (speed: string): Promise<bigint> => {
    if (!provider) throw new Error('Provider not initialized')

    const feeData = await provider.getFeeData()
    const baseGasPrice = feeData.gasPrice ?? BigInt(0)

    switch (speed) {
      case 'slow':
        return baseGasPrice * BigInt(80) / BigInt(100) // 80% of standard gas price
      case 'fast':
        return baseGasPrice * BigInt(120) / BigInt(100) // 120% of standard gas price
      default:
        return baseGasPrice // standard gas price
    }
  }, [provider])

  return {
    walletAddress,
    balance,
    sendTransaction,
    getGasPrice,
  }
}