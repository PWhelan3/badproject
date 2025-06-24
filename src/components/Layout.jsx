
import { Link, useLocation } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Home, Map, User, Coins, Wallet } from 'lucide-react'

export default function Layout({ children }) {
  const location = useLocation()
  const { isConnected } = useAccount()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Mint', href: '/mint', icon: Coins },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-50 to-white-50 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    <img src="../../public/icon.png"></img>
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">Current</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 hidden sm:inline">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-500 hidden sm:inline">Not Connected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
        <div className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        {children}
      </main>
    </div>
  )
}