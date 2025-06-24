// src/pages/MintPage.jsx
import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { Upload, MapPin, Image, FileText, Coins } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getEtherscanUrl } from '../config/wagmi'

export default function MintPage() {
  const { address, isConnected, chainId } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    location: '',
    latitude: '',
    longitude: '',
    price: ''
  })
  const [dragActive, setDragActive] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLocationLoading, setIsLocationLoading] = useState(false)

  const isCorrectNetwork = chainId === sepolia.id

  // Contract interaction hooks (you'll need to implement these with your actual contract)
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      setFormData(prev => ({ ...prev, image: file }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCurrentLocation = () => {
    setIsLocationLoading(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          }))
          setIsLocationLoading(false)
          toast.success('Location captured!')
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('Unable to get location. Please enter manually.')
          setIsLocationLoading(false)
        }
      )
    } else {
      toast.error('Geolocation is not supported by this browser')
      setIsLocationLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!isCorrectNetwork) {
      toast.error('Please switch to Sepolia testnet')
      return
    }

    if (!formData.name || !formData.description || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      // In a real implementation, you would:
      // 1. Upload image and metadata to IPFS
      // 2. Call your smart contract mint function
      // 3. Wait for transaction confirmation
      
      toast.loading('Uploading to IPFS...')
      
      // Mock IPFS upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.dismiss()
      toast.loading('Minting NFT...')
      
      // Mock contract call - replace with actual contract interaction
      // writeContract({
      //   address: 'YOUR_CONTRACT_ADDRESS',
      //   abi: YOUR_CONTRACT_ABI,
      //   functionName: 'mint',
      //   args: [address, tokenURI]
      // })
      
      // Mock successful mint
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.dismiss()
      toast.success('NFT minted successfully!')
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        image: null,
        location: '',
        latitude: '',
        longitude: '',
        price: ''
      })
      setImagePreview(null)
      
    } catch (error) {
      console.error('Minting error:', error)
      toast.error('Failed to mint NFT. Please try again.')
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Coins className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mint Your NFT</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your wallet to start minting geo-tagged NFTs on the blockchain.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800">
              Please connect your MetaMask wallet to access the minting interface.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mint New NFT</h1>
        <p className="text-gray-600">Create and mint your digital art as a geo-tagged NFT</p>
      </div>

      {!isCorrectNetwork && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">
            ⚠️ Please switch to Sepolia testnet to mint NFTs
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Artwork Image *
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm text-gray-600">
                    {formData.image?.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData(prev => ({ ...prev, image: null }))
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* NFT Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NFT Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter NFT name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (ETH)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.001"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your artwork..."
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter location or coordinates"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLocationLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <MapPin size={16} />
                  <span>{isLocationLoading ? 'Getting...' : 'Use Current'}</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="53.3498"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="-6.2603"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Minting Cost Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Minting Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-medium">Sepolia Testnet</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Gas:</span>
                <span className="font-medium">~0.002 ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Storage:</span>
                <span className="font-medium">IPFS (Decentralized)</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  image: null,
                  location: '',
                  latitude: '',
                  longitude: '',
                  price: ''
                })
                setImagePreview(null)
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isPending || isConfirming || !isCorrectNetwork}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coins size={16} />
              <span>
                {isPending || isConfirming ? 'Minting...' : 'Mint NFT'}
              </span>
            </button>
          </div>

          {/* Transaction Status */}
          {hash && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Transaction Submitted</h4>
              <p className="text-sm text-blue-700 mb-2">
                Your NFT is being minted. This may take a few minutes.
              </p>
              <a
                href={getEtherscanUrl(hash, 'tx')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                View on Etherscan →
              </a>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">NFT Minted Successfully!</h4>
              <p className="text-sm text-green-700">
                Your NFT has been minted and is now available on the blockchain.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}