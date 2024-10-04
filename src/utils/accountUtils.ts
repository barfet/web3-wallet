import { ethers } from 'ethers';
import { encryptSeedPhrase } from './cryptoUtils';

interface UserAccount {
  address: string;
  encryptedSeedPhrase: string;
}

export async function createUserAccount(seedPhrase: string, password: string): Promise<UserAccount> {
  const wallet = ethers.Wallet.fromPhrase(seedPhrase);
  const address = wallet.address;
  const encryptedSeedPhrase = await encryptSeedPhrase(seedPhrase, password);
  return { address, encryptedSeedPhrase };
}

export async function saveUserAccount(account: UserAccount): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('Web3WalletDB', 1);

    request.onerror = (event) => {
      reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['accounts'], 'readwrite');
      const store = transaction.objectStore('accounts');

      const addRequest = store.add(account);

      addRequest.onerror = () => {
        reject('Error adding account to IndexedDB');
      };

      addRequest.onsuccess = () => {
        resolve();
      };
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('accounts', { keyPath: 'address' });
    };
  });
}

export async function getUserAccount(): Promise<UserAccount | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('Web3WalletDB', 1);

    request.onerror = (event) => {
      reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['accounts'], 'readonly');
      const store = transaction.objectStore('accounts');

      const getRequest = store.getAll();

      getRequest.onerror = () => {
        reject('Error getting account from IndexedDB');
      };

      getRequest.onsuccess = () => {
        const accounts = getRequest.result;
        resolve(accounts.length > 0 ? accounts[0] : null);
      };
    };
  });
}