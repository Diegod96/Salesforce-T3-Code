/// <reference types="vite/client" />

declare global {
  interface Window {
    t3?: {
      platform: NodeJS.Platform;
    };
  }
}

export {};
