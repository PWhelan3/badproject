// Imports
import { useAccount, useBalance, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { ExternalLink, Wallet, Globe, Copy } from 'lucide-react'
import { getEtherscanUrl } from '../config/wagmi'
import WalletConnect from '../components/WalletConnect'
import { toast } from 'react-hot-toast'

// Exporting Component
export default function WalletPage() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const chainId = useChainId()

  const isCorrectNetwork = chainId === sepolia.id

  const copyAddress = async () => {
    if (!address) return
    
    try {
      await navigator.clipboard.writeText(address)
      toast.success('Address copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Wallet className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your MetaMask wallet to access your account, view your balance, and interact with smart contracts on Sepolia testnet.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <WalletConnect />
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Why connect your wallet?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Mint and manage your NFTs</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>View your transaction history on Etherscan</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Interact with smart contracts securely</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Access exclusive features and content</span>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet Dashboard</h1>
        <p className="text-gray-600">Manage your wallet connection and view account details</p>
      </div>

      <div className="grid gap-6">
        {/* Wallet Connection Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Wallet Connection</h2>
          </div>
          <div className="p-6">
            <WalletConnect />
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Address */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Wallet Address:</span>
              <div className="flex items-center space-x-2">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                  {address?.slice(0, 10)}...{address?.slice(-8)}
                </code>
                <button
                  onClick={copyAddress}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy address"
                >
                  <Copy size={16} />
                </button>
                <a
                  href={getEtherscanUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="View on Etherscan"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* Balance */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Balance:</span>
              <span className="text-sm font-mono bg-green-50 text-green-700 px-2 py-1 rounded">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
              </span>
            </div>

            {/* Network */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Network:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${isCorrectNetwork ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrectNetwork ? 'Sepolia Testnet' : 'Wrong Network'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href={getEtherscanUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg transition-colors"
              >
                <Globe size={18} />
                <span>View on Etherscan</span>
              </a>
              
              <a
                href="https://sepoliafaucet.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg transition-colors"
              >
                <Wallet size={18} />
                <span>Get Test ETH</span>
              </a>
              
              <button
                onClick={copyAddress}
                className="flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg transition-colors"
              >
                <Copy size={18} />
                <span>Copy Address</span>
              </button>
            </div>
          </div>
        </div>

        {/* Network Info */}
        {!isCorrectNetwork && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Wrong Network Detected</h3>
            <p className="text-yellow-700 mb-4">
              You're currently connected to the wrong network. Please switch to Sepolia testnet to interact with the platform's smart contracts.
            </p>
            <div className="bg-yellow-100 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Sepolia Testnet Details:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li><strong>Network Name:</strong> Sepolia Testnet</li>
                <li><strong>Chain ID:</strong> 11155111</li>
                <li><strong>Currency:</strong> ETH</li>
                <li><strong>Explorer:</strong> https://sepolia.etherscan.io</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}