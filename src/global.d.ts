import { Chrome } from 'chrome';

declare global {
  namespace NodeJS {
    interface Global {
      chrome: Chrome;
    }
  }

  interface Window {
    ethereum?: any;
  }
}

export {};