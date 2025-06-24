
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import { config } from './config/wagmi'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import ProfilePage from './pages/ProfilePage'
import MintPage from './pages/MintPage'
import WalletPage from './pages/WalletPage'

// Client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/mint" element={<MintPage />} />
                <Route path="/wallet" element={<WalletPage />} />
              </Routes>
            </Layout>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4aed88',
                  },
                },
              }}
            />
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App