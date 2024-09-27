import { Chrome } from 'chrome';

declare global {
  namespace NodeJS {
    interface Global {
      chrome: Chrome;
    }
  }
}