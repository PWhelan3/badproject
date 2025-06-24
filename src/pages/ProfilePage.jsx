
import { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { User, Settings, ExternalLink, Copy, Edit3, Grid, List } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getEtherscanUrl } from '../config/wagmi'

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Enter Your Name',
    bio: 'Digital artist exploring the intersection of technology and creativity.',
    website: '',
    twitter: '',
    instagram: ''
  })

  // Mock NFT data
  const mockNFTs = [
    {
      id: 1,
      name: 'Mr Lamp',
      image: '../../images/lamp.png',
      price: '0.1 ETH',
      location: 'Dublin, Ireland',
      minted: '2024-01-15'
    },
    {
      id: 2,
      name: 'Globular',
      image: '../../images/4.jpg',
      price: '0.05 ETH',
      location: 'London, UK',
      minted: '2024-01-10'
    },
    {
      id: 3,
      name: 'Oroborous',
      image: '../../images/3.jpg',
      price: '0.2 ETH',
      location: 'Paris, France',
      minted: '2024-01-05'
    }
  ]

  const copyAddress = async () => {
    if (!address) return
    
    try {
      await navigator.clipboard.writeText(address)
      toast.success('Address copied!')
    } catch (err) {
      toast.error('Failed to copy address')
    }
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    //This should get saved to backend IPFS
    setIsEditing(false)
    toast.success('Profile updated!')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Profile</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your wallet to view and manage your NFT collection and profile.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800">
              Please connect your wallet to access your profile and view your NFT collection.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              
              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      placeholder="Your name"
                    />
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full text-gray-600 bg-transparent border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex space-x-4">
                      <input
                        type="url"
                        name="website"
                        value={profile.website}
                        onChange={handleInputChange}
                        className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Website URL"
                      />
                      <input
                        type="text"
                        name="twitter"
                        value={profile.twitter}
                        onChange={handleInputChange}
                        className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Twitter username"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                    <p className="text-gray-600 mb-4">{profile.bio}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>Address:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-xs">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </code>
                        <button
                          onClick={copyAddress}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={14} />
                        </button>
                        <a
                          href={getEtherscanUrl(address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Balance:</span>
                        <span className="font-medium">
                          {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <Edit3 size={16} />
                  <span>Edit</span>
                </button>
              )}
              <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">{mockNFTs.length}</div>
          <div className="text-sm text-gray-600">NFTs Owned</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
          <div className="text-sm text-gray-600">NFTs Sold</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">0.35</div>
          <div className="text-sm text-gray-600">Total Volume (ETH)</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">Locations</div>
        </div>
      </div>

      {/* NFT Collection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My NFT Collection</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {mockNFTs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No NFTs yet</h3>
              <p className="text-gray-600 mb-4">
                You haven't minted any NFTs yet. Start creating your first NFT!
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Mint Your First NFT
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {mockNFTs.map((nft) => (
                <div key={nft.id} className={`border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className={`object-cover ${viewMode === 'grid' ? 'w-full h-48' : 'w-32 h-32'}`}
                  />
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{nft.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{nft.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{nft.price}</span>
                      <span className="text-xs text-gray-500">{nft.minted}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}