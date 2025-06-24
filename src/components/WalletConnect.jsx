
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { toast } from 'react-hot-toast'
import { Wallet, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { getEtherscanUrl } from '../config/wagmi'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const chainId = useChainId()
  const [copied, setCopied] = useState(false)

  // Check if on correct network (Sepolia)
  const isCorrectNetwork = chainId === sepolia.id

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Format balance
  const formatBalance = (bal) => {
    if (!bal) return '0.00'
    return parseFloat(bal.formatted).toFixed(4)
  }

  // Copy address to clipboard
  const copyAddress = async () => {
    if (!address) return
    
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      toast.success('Address copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  // Handle connection
  const handleConnect = () => {
    const metamaskConnector = connectors.find(
      connector => connector.name === 'MetaMask' || connector.id === 'injected'
    )
    
    if (metamaskConnector) {
      connect({ connector: metamaskConnector })
    } else {
      toast.error('MetaMask not found. Please install MetaMask.')
    }
  }

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected')
  }

  // Switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xAA36A7' }], // Sepolia chain ID in hex
      })
      toast.success('Switched to Sepolia network')
    } catch (error) {
      if (error.code === 4902) {
        // Network not added to MetaMask, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xAA36A7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            }],
          })
          toast.success('Sepolia network added and switched')
        } catch (addError) {
          toast.error('Failed to add Sepolia network')
        }
      } else {
        toast.error('Failed to switch network')
      }
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleConnect}
          disabled={isPending}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          <Wallet size={20} />
          <span>{isPending ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
        
        {!window.ethereum && (
          <p className="text-sm text-gray-600">
            Please install{' '}
            <a 
              href="https://metamask.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              MetaMask
            </a>
            {' '}to continue
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Wallet Connected</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600">Connected</span>
        </div>
      </div>

      {/* Network Status */}
      {!isCorrectNetwork && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800 mb-2">
            Please switch to Sepolia testnet to interact with contracts
          </p>
          <button
            onClick={switchToSepolia}
            className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded font-medium"
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      {/* Account Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Address:</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono">{formatAddress(address)}</span>
            <button
              onClick={copyAddress}
              className="text-gray-400 hover:text-gray-600"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <a
              href={getEtherscanUrl(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600"
              title="View on Etherscan"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Balance:</span>
          <span className="text-sm font-medium">
            {formatBalance(balance)} {balance?.symbol || 'ETH'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Network:</span>
          <span className={`text-sm font-medium ${isCorrectNetwork ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrectNetwork ? 'Sepolia Testnet' : 'Wrong Network'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={handleDisconnect}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  )
}