import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { decryptSeedPhrase } from '@/utils/cryptoUtils'

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [balance, setBalance] = useState<ethers.BigNumber>(ethers.BigNumber.from(0))
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)

  useEffect(() => {
    const initWallet = async () => {
      try {
        // Retrieve the encrypted seed phrase and wallet address from chrome.storage.local
        const result = await chrome.storage.local.get(['encryptedSeedPhrase', 'walletAddress'])
        if (result.walletAddress) {
          setWalletAddress(result.walletAddress)
        }

        // Connect to the Ethereum network (use a testnet for development)
        const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL)
        setProvider(provider)

        // Get the balance
        if (result.walletAddress) {
          const balance = await provider.getBalance(result.walletAddress)
          setBalance(balance)
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

      const amountWei = ethers.utils.parseEther(amount)
      const gasPrice = await getGasPrice(gasSpeed)

      const tx = await wallet.sendTransaction({
        to,
        value: amountWei,
        gasPrice,
      })

      await tx.wait()

      // Update balance after transaction
      const newBalance = await provider.getBalance(wallet.address)
      setBalance(newBalance)

      return tx.hash
    } catch (error) {
      console.error('Error sending transaction:', error)
      throw error
    }
  }, [provider])

  const getGasPrice = useCallback(async (speed: string): Promise<ethers.BigNumber> => {
    if (!provider) throw new Error('Provider not initialized')

    const gasPrice = await provider.getGasPrice()
    switch (speed) {
      case 'slow':
        return gasPrice.mul(80).div(100) // 80% of standard gas price
      case 'fast':
        return gasPrice.mul(120).div(100) // 120% of standard gas price
      default:
        return gasPrice // standard gas price
    }
  }, [provider])

  return {
    walletAddress,
    balance,
    sendTransaction,
    getGasPrice,
  }
}