import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';

export const BASE_DENIM_CONFIG = {
  chainId: 8453,
  networkName: "Base Mainnet",
  upgrade: "Denim",
  blockTimeMs: 200,
  canonicalBlocksOnly: true,
  flashblocksRetired: true,
  rpcUrl: "https://mainnet.base.org",
  explorerUrl: "https://basescan.org",
  gmContract: "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3",
};

export const config = createConfig({
  chains: [base],
  pollingInterval: 1_000,
  transports: {
    [base.id]: http('https://mainnet.base.org', {
      batch: true,
      retryCount: 3,
      retryDelay: 200,
    }),
  },
});

