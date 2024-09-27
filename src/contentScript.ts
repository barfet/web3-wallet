console.log('Content script injected');

// Implement a more secure provider injection
const injectProvider = () => {
  const provider = {
    isMetaMask: true,
    // Add more properties and methods as needed, adhering to EIP-1193
    request: async ({ method, params }: { method: string; params?: unknown[] }) => {
      // Implement secure message passing to background script
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: 'ETHEREUM_REQUEST', method, params }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
    },
    // ... other necessary methods
  };

  Object.defineProperty(window, 'ethereum', {
    value: provider,
    writable: false,
    configurable: false,
  });
};

// Only inject the provider if it doesn't already exist
if (!window.ethereum) {
  injectProvider();
}

// Listen for messages from the injected provider
window.addEventListener('message', (event) => {
  // Ensure the message is from the same origin
  if (event.source !== window) return;

  if (event.data.type && event.data.type === 'ETHEREUM_PROVIDER_MESSAGE') {
    // Handle provider messages securely
    // Implement message validation and processing
  }
});

export {};