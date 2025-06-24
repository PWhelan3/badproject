
import { http, createConfig } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

// Wagmi configuration focused on Sepolia testnet and MetaMask
export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    // Injected connector for MetaMask and other browser wallets
    injected({
      target: 'metaMask',
    }),

    // MetaMask connector
    metaMask({
      dappMetadata: {
        name: 'Current - NFT Platform',
        description: 'Discover and mint location-based NFT art',
        url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
        iconUrl: 'https://current-nft.app/icon.png'
      }
    }),
  ],
  transports: {
    // Sepolia testnet RPC endpoints
    [sepolia.id]: http('https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
  },
  ssr: false,
})

// Network configuration for referencing
export const NETWORKS = {
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'] },
      public: { http: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'] },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
    },
    testnet: true,
  },
}

// Contract addresses
export const CONTRACTS = {
  NFT_CONTRACT: '0x...', // To be filled out for final project
  MARKETPLACE_CONTRACT: '0x...', // Optional extra in the coming weeks
}

// Function to get Etherscan URL
export const getEtherscanUrl = (address, type = 'address') => {
  const baseUrl = 'https://sepolia.etherscan.io'
  return `${baseUrl}/${type}/${address}`
}