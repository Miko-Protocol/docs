---
title: Smart Contracts
---

# On-Chain Implementation on Solana

The off-chain analysis results from the Miko AI Agent are executed through the organic collaboration of robust, transparent smart contracts on the Solana blockchain and intelligent automation bots. This hybrid system aims to maximize off-chain flexibility and efficiency while ensuring on-chain immutability and transparency.

```mermaid
graph TD
    subgraph "On-Chain Programs"
        A["MIKO Token-2022<br><i>6% Transfer Fee</i>"] --> B
        B[("Absolute Vault<br><i>Fee Storage & Authority Management</i>")]
        C[("Smart Dial<br><i>Stores Weekly Reward Token Address</i>")]
    end
    subgraph "Off-Chain Services"
        D["Keeper Bot<br><i>Core of Automated Operations</i>"]
    end
    subgraph "Workflow"
        A -- "1#46; Transfer Tax Occurs" --> B
        B -- "2#46; Keeper Harvests at 500k Fee Threshold" --> D
        C -- "4#46; Queries AI-Selected<br>Reward Token Address" --> D
        D -- "3#46; Processes Fees<br>(Swap & Distribution Logic)" --> E
        E>"1.5% to Team, 4.5% to Holders<br>as <b>Reward Tokens</b>"]
    end
    style A fill:#a78bfa,stroke:#6d28d9,color:#fff
    style B fill:#c4b5fd,stroke:#6d28d9
    style C fill:#c4b5fd,stroke:#6d28d9
    style D fill:#93c5fd,stroke:#1d4ed8,color:#000
    style E fill:#6ee7b7,stroke:#047857
```

## 1. Core On-Chain Components

The on-chain programs form the foundation of the protocol's trust and security, performing only the minimum necessary functions to reduce the attack surface and increase predictability.

-   **MIKO Token (Based on `Token-2022`):** The protocol's core asset, which imposes a fixed 6% fee on all transfers (buys, sells, wallet-to-wallet) without exception, via the TransferFeeConfig extension. The mint authority is renounced and the freeze authority is disabled, making the token immutable with a permanently fixed total supply.
-   **Absolute Vault:** A smart contract that acts as the protocol's central treasury. It securely manages all transferred authorities, stores the transaction fees harvested by the Keeper Bot, and records all activities on-chain for complete transparency.
-   **Smart Dial:** A simple yet crucial on-chain configuration program that stores the address of the weekly reward token. The Keeper Bot queries this contract during each weekly reward distribution to proceed with the swap for the latest AI-selected reward token.

## 2. Off-Chain Automation: The Keeper Bot

The Keeper Bot is an intelligent off-chain automation service responsible for the MIKO ecosystem's operations. By handling complex logic and periodic tasks off-chain, it reduces on-chain transaction costs and ensures system flexibility.

### Key Responsibilities:

-   **Automatic Harvesting:** Continuously monitors the accumulated withheld transaction fees on the token. When the threshold of 0.05% of the total supply (500,000 MIKO) is reached, it automatically harvests the fees and transfers them to the Absolute Vault.
-   **Swap and Distribution Execution:** Swaps the harvested MIKO tokens for the AI-selected weekly reward token, and distributes 25% to the project's operational fund and 75% to eligible holders on a pro-rata basis.
-   **Dynamic Eligibility Screening:** At the time of reward distribution, it scans holder wallets in real-time to distribute rewards only to 'Eligible Holders' with a MIKO token value of $100 or more.
-   **Smart Exclusion System:** Dynamically detects and excludes system-related addresses, such as liquidity pool (LP) accounts or routing contract addresses, from reward distribution to ensure benefits go only to actual community members.

Thus, while the on-chain programs enforce the 'rules' and protect the 'assets', the off-chain Keeper Bot acts as the heart of the ecosystem, 'executing' according to those rules.
