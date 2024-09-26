# Technical Architecture Document for Web3 Wallet Chrome Extension

---

## Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Technology Stack](#technology-stack)
   - [Languages](#languages)
   - [Frameworks](#frameworks)
   - [Tools](#tools)
4. [Architecture Components](#architecture-components)
   - [Frontend Components](#frontend-components)
   - [Backend Services](#backend-services)
   - [Blockchain Interaction](#blockchain-interaction)
5. [Data Model and Entities](#data-model-and-entities)
6. [Data Flow and Interaction](#data-flow-and-interaction)
7. [Smart Contracts](#smart-contracts)
8. [Component Interaction and Communication](#component-interaction-and-communication)
9. [Security Considerations](#security-considerations)
10. [Deployment Strategy](#deployment-strategy)
11. [Conclusion](#conclusion)

---

## Introduction

This Technical Architecture Document outlines the detailed technical blueprint for developing a Web3 wallet Chrome extension that supports the Ethereum (ETH) network. It specifies the technologies, components, data models, and interactions necessary to build a secure, efficient, and user-friendly wallet as described in the Product Design document.

---

## System Overview

The wallet is a browser extension that allows users to manage their Ethereum assets and interact with decentralized applications (DApps) directly from their browser. The system consists of:

- A **frontend** component (the Chrome extension UI).
- **Backend services** for optional features like user analytics and updates (though minimal to maintain decentralization).
- **Blockchain interaction layer** to communicate with the Ethereum network.

---

## Technology Stack

### Languages

- **JavaScript/TypeScript**: For both frontend and backend development.
  - TypeScript is preferred for type safety and better code maintainability.

### Frameworks

- **React**: For building the user interface of the Chrome extension.
- **Redux**: For state management within the extension.
- **Node.js**: For any backend services (if required).
- **Express.js**: For building backend APIs (if required).

### Tools

- **Webpack**: For bundling the extension's assets.
- **Babel**: For transpiling modern JavaScript/TypeScript code.
- **Ethers.js**: For interacting with the Ethereum blockchain.
- **MetaMask's Web3 Provider Engine**: For managing blockchain providers and middleware.
- **Jest**: For unit testing.
- **ESLint**: For code linting and style enforcement.
- **Prettier**: For code formatting.
- **Git**: For version control.
- **GitHub Actions**: For continuous integration and deployment (CI/CD).
- **Sentry**: For error tracking and monitoring.

---

## Architecture Components

### Frontend Components

The frontend is the Chrome extension itself, which includes:

- **UI Components**: Built with React, encompassing all user interface elements.
- **State Management**: Using Redux to manage the application state.
- **Encryption Module**: For encrypting/decrypting sensitive data like private keys.
- **Interaction Layer**: For communication between the extension and web pages (DApps).

### Backend Services

- **Optional Backend API**: For features like update notifications, user feedback, or remote configuration.
  - Built with Node.js and Express.js.
  - Hosted on a scalable platform like AWS, Heroku, or Google Cloud Platform.

*Note: To maintain decentralization and user privacy, backend services should be minimal.*

### Blockchain Interaction

- **Ethers.js Library**: For interacting with the Ethereum network.
- **Provider Management**: Handling connections to Ethereum nodes (Infura, Alchemy, or self-hosted nodes).
- **Transaction Processing**: Crafting, signing, and sending transactions.

---

## Data Model and Entities

### Entities

1. **User**
   - Password
   - Seed Phrase
   - Wallet Addresses
   - Private Keys (encrypted)
   - Settings Preferences
   - Contacts List

2. **Wallet**
   - Address
   - Balance
   - Transaction History
   - Tokens Held

3. **Transaction**
   - Transaction Hash
   - From Address
   - To Address
   - Amount
   - Gas Price
   - Gas Limit
   - Timestamp
   - Status (Pending, Confirmed, Failed)

4. **DApp Connection**
   - DApp Origin URL
   - Permissions Granted
   - Connection Timestamp

5. **Settings**
   - Security Options (e.g., biometric authentication)
   - Network Settings
   - Language Preferences

### Data Model

#### User Schema

- `userId`: UUID
- `passwordHash`: String
- `encryptedSeedPhrase`: String
- `settings`: Object
- `contacts`: Array of Contact Objects

#### Wallet Schema

- `address`: String
- `encryptedPrivateKey`: String
- `balance`: BigNumber
- `tokens`: Array of Token Objects
- `transactionHistory`: Array of Transaction Objects

#### Transaction Schema

- `transactionHash`: String
- `from`: String
- `to`: String
- `amount`: BigNumber
- `gasPrice`: BigNumber
- `gasLimit`: BigNumber
- `timestamp`: DateTime
- `status`: Enum (Pending, Confirmed, Failed)

#### DApp Connection Schema

- `dappId`: UUID
- `origin`: String
- `permissions`: Object
- `connectedAt`: DateTime

---

## Data Flow and Interaction

### Data Flow Overview

1. **User Actions**: User interacts with the UI (e.g., sends ETH).
2. **State Update**: Actions dispatch Redux actions to update the state.
3. **Blockchain Interaction**: Uses Ethers.js to interact with the Ethereum network.
4. **Data Persistence**: Sensitive data is encrypted and stored locally using browser storage APIs.
5. **Background Scripts**: Handle long-running tasks and communicate with content scripts.

### Detailed Data Flows

#### Wallet Creation

1. User selects "Create New Wallet."
2. User sets a password.
3. Seed phrase is generated using a secure random number generator.
4. Seed phrase is encrypted with the user's password.
5. Encrypted seed phrase is stored locally.
6. Wallet addresses are derived from the seed phrase.
7. UI updates to show the main dashboard.

#### Sending ETH

1. User inputs recipient address and amount.
2. UI validates inputs (e.g., address format, sufficient balance).
3. User confirms transaction details.
4. Transaction object is created.
5. Transaction is signed using the user's private key.
6. Signed transaction is sent to the Ethereum network via a provider.
7. Transaction status is updated based on network confirmation.

#### Receiving ETH

1. User navigates to "Receive" section.
2. Wallet address is displayed.
3. QR code is generated from the wallet address.
4. User shares the address to receive funds.

#### DApp Interaction

1. User visits a DApp website.
2. DApp requests connection to the wallet via injected provider.
3. Extension prompts the user for permission.
4. User grants permission.
5. DApp can now interact with the wallet within the permissions granted.

---

## Smart Contracts

### Necessity of Smart Contracts

- **Not Required for Core Functionality**: Since the wallet primarily interacts with the Ethereum network and existing smart contracts, there is no immediate need to develop custom smart contracts.
- **Future Enhancements**: If features like token swaps or social recovery are implemented, custom smart contracts may be required.

### Interaction with Smart Contracts

- **ERC-20 Token Support**: Interact with existing ERC-20 token contracts to display balances and facilitate transfers.
- **DApp Interactions**: Enable users to interact with third-party smart contracts via DApps.

---

## Component Interaction and Communication

### Overview

- **Content Scripts**: Injected into web pages to facilitate communication between the DApp and the extension.
- **Background Scripts**: Run in the background to manage long-term tasks like transaction monitoring.
- **Popup Scripts**: Control the UI elements displayed when the extension icon is clicked.
- **Messaging**: Components communicate using Chrome's messaging APIs.

### Communication Flow

#### DApp to Extension

1. **DApp**: Sends a request to the Ethereum provider (window.ethereum).
2. **Content Script**: Intercepts the request and forwards it to the background script.
3. **Background Script**: Processes the request (e.g., transaction signing, data retrieval).
4. **User Prompt**: If user approval is needed, the extension UI is triggered.
5. **Response**: After processing, the background script sends a response back through the content script to the DApp.

#### Extension UI to Background

1. **User Action**: User interacts with the extension UI.
2. **Popup Script**: Dispatches actions to the background script.
3. **State Update**: Background script updates the state and performs necessary operations.
4. **UI Refresh**: UI components are updated based on the new state.

### Data Storage

- **Local Storage**: Encrypted seed phrases, settings, and other sensitive data are stored using the browser's local storage APIs.
- **Redux Store**: Manages the application state in memory during runtime.

---

## Security Considerations

### Encryption and Key Management

- **Encryption Algorithms**: Use AES-256-GCM for encrypting sensitive data.
- **Key Derivation**: Derive encryption keys from the user's password using PBKDF2 with a high iteration count and a unique salt.
- **Private Key Storage**: Private keys and seed phrases are never stored in plain text.

### Authentication

- **Password Policies**: Enforce strong passwords (minimum length, complexity requirements).
- **Biometric Authentication**: Utilize browser APIs for biometric authentication where available.
- **Auto-Lock**: Implement an auto-lock feature that locks the wallet after a period of inactivity.

### Secure Communication

- **HTTPS Only**: Ensure all network communications occur over HTTPS.
- **Content Security Policy (CSP)**: Define strict CSP to prevent cross-site scripting attacks.
- **Input Validation**: Validate all user inputs to prevent injection attacks.

### Phishing Protection

- **Domain Verification**: Display warnings when interacting with known phishing sites.
- **Transaction Confirmation**: Provide clear transaction details for user confirmation.

### Code Security

- **Code Signing**: Sign the extension code to prevent tampering.
- **Dependency Management**: Regularly update dependencies to patch security vulnerabilities.
- **Security Audits**: Conduct periodic security assessments and code reviews.

---

## Deployment Strategy

### Development Environment

- **Version Control**: Use Git for source code management.
- **Branching Strategy**: Implement GitFlow or similar for managing development, staging, and production branches.
- **Continuous Integration**: Use GitHub Actions to automate testing and builds on each commit.

### Testing

- **Unit Tests**: Write comprehensive unit tests using Jest.
- **Integration Tests**: Test interactions between components.
- **User Acceptance Testing**: Conduct testing with a group of beta users.
- **Automated Testing**: Set up automated test suites to run on every build.

### Packaging

- **Webpack Configuration**: Optimize bundling for performance and security.
- **Minification and Obfuscation**: Minify code to reduce size and obfuscate to protect intellectual property.

### Release Management

- **Versioning**: Follow semantic versioning for releases.
- **Chrome Web Store Deployment**: Package the extension according to Chrome's guidelines and submit for review.
- **Monitoring**: Set up monitoring tools like Sentry to track errors and performance issues post-deployment.

### Rollback Plan

- **Backup Versions**: Keep backups of previous stable releases.
- **Rollback Procedures**: Establish protocols for rolling back to a previous version in case of critical issues.

---

## Conclusion

This Technical Architecture Document provides a comprehensive guide for developing the Web3 wallet Chrome extension. It covers all aspects from technology selection to component interaction, ensuring a consistent and secure implementation. By following this blueprint, the development team can build a robust wallet that meets user needs and adheres to best practices in software development and security.

---

*Verification:* All components and interactions have been defined to align with the product design requirements. The architecture ensures consistency between frontend and backend components, specifies necessary entities and data models, and provides clear guidance on the interactions with the Ethereum blockchain. Security considerations have been thoroughly addressed to protect user assets and data.