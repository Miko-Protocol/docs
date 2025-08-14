---
title: Risks & Transparency
---

# Risk Factors, Security, and Transparency

As the MIKO Protocol combines autonomous systems with financial incentives, it prioritizes security and fairness, and has established multi-layered measures to protect users and maintain trust.

## 1. Smart Contract Security and Token Immutability

-   **Token Contract Ensuring Immutability:** MIKO's SPL token has no backdoors. The mint authority is permanently renounced and the freeze authority is disabled, meaning the total supply cannot be changed, and it is impossible to freeze specific wallets. This guarantees that the MIKO token cannot be arbitrarily manipulated by the development team.
-   **Permissioned Off-Chain Execution and On-Chain Verification:** The Keeper Bot is a centralized component, but its actions are thoroughly audited and verified through on-chain logs. All fund movements require the Keeper's secure key signature, and any unintended activity is immediately identifiable on-chain. Additionally, 'Verification Contracts' are introduced during the development process to ensure that core logic (e.g., 5% fee accuracy, system account exclusion) is mechanically verified at each deployment stage, providing an extra layer of trust.

## 2. Safeguards for Fair Reward Distribution

-   **System Account Exclusion:** Rewards are for the MIKO community. To this end, the initial liquidity pool accounts provided by the team, as well as system accounts related to the team and development, are excluded from reward distribution. This ensures that the limited reward funds are efficiently distributed only to actual community holders.
-   **Multi-Filtering for High-Quality Reward Token Selection:** The system employs strict filtering based on various on-chain metrics such as trading volume, liquidity, market cap, and holder count when selecting reward tokens. This prevents scam tokens or inactive tokens with virtually no trading from being selected as rewards, thereby providing real value to holders. Furthermore, in the unlikely event of a sudden, unpredictable serious issue with a selected token, such as a rug-pull, the team holds a limited authority to make an emergency change to the reward token once a week to protect community assets. This is a final safeguard to protect the community's assets.

## 3. Market Risks and Management Functions

-   **Market Volatility Risk:** The cryptocurrency market is inherently highly volatile. The value of the $MIKO token and the weekly reward tokens selected by the AI can fluctuate dramatically depending on market conditions. There is no guarantee that the AI's selections will always lead to profits, and losses may occur.
-   **Mitigation Strategies:**
    -   **Inherent Diversification:** The protocol's dynamic reward mechanism itself is part of the risk mitigation strategy. By distributing a different asset as a reward each week, holders naturally diversify their portfolios, reducing their exposure to the price decline of a single asset.
    -   **Emphasis on Long-Term Perspective:** The protocol's value is emphasized to depend not on the short-term performance of reward tokens, but on whether the AI's analytical ability can generate alpha that outperforms the market average over the long term.
    -   **Emergency Safeguards and Management Functions:** Minimal management functions exist to ensure the stable operation of the protocol and protect community assets. These functions are limited to actions that do not harm the token's economic structure, such as an emergency reward token change limited to once a week or fund recovery due to system errors. The execution history of all management functions is transparently recorded on-chain, ensuring their use is restricted solely to the purpose of protecting holder assets.
