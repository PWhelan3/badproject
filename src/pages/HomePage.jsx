
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Map, Coins, User, ArrowRight } from 'lucide-react'
import WalletConnect from '../components/WalletConnect'

export default function HomePage() {
  const { isConnected } = useAccount()

  const features = [
    {
      icon: Map,
      title: 'Explore Map',
      description: 'Discover art and artists from around the world on our interactive map.',
      href: '/map',
      color: 'bg-blue-500'
    },
    {
      icon: Coins,
      title: 'Mint NFTs',
      description: 'Create and mint your digital art as NFTs on the blockchain.',
      href: '/mint',
      color: 'bg-purple-500'
    },
    {
      icon: User,
      title: 'Artist Profiles',
      description: 'Showcase your work and connect with other artists and collectors.',
      href: '/profile',
      color: 'bg-pink-500'
    }
  ]

  const stats = [
    { label: 'NFTs Minted', value: '1,234' },
    { label: 'Active Artists', value: '567' },
    { label: 'Countries', value: '89' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo/Brand */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  {/* <span className="text-white font-bold text-xl">⚡</span> */}
                  <img src="../../public/icon.png"></img>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Art on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">Blockchain</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with artists, explore NFT collections, and discover digital art from around the world. Mint, trade, and showcase your creations.
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {!isConnected ? (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <WalletConnect />
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/map"
                    className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <span>Explore Map</span>
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/mint"
                    className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Start Minting
                  </Link>
                </div>
              )}
            </div>

            {isConnected && (
              <p className="text-blue-200 mt-4">
                ✨ Wallet connected! Ready to explore the platform.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create and discover
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete platform for digital artists and collectors to mint, trade, and showcase NFT art.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Link
                  key={index}
                  to={feature.href}
                  className="group bg-gray-50 hover:bg-white rounded-2xl p-8 transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-200"
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    <span>Learn more</span>
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Wallet CTA */}
      {!isConnected && (
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect your wallet to start exploring, minting, and trading NFTs.
            </p>
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
              <WalletConnect />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}