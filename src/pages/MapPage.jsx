
import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapPin, Layers, Search, Filter, Plus, Minus, Navigation } from 'lucide-react'

// Get Mapbox token from env
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN
mapboxgl.accessToken = MAPBOX_TOKEN

export default function MapPage() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const { isConnected } = useAccount()
  const [lng, setLng] = useState(-6.2603) // Dublin longitude
  const [lat, setLat] = useState(53.3498) // Dublin latitude
  const [zoom, setZoom] = useState(9)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(null)

  // Mock NFT data for demonstration
  const mockNFTs = [
    {
      id: 1,
      title: "Dublin Street Art",
      artist: "0x1234...5678",
      lat: 53.3498,
      lng: -6.2603,
      price: "0.1 ETH",
      image: "https://via.placeholder.com/200x200?text=NFT+1",
      description: "Beautiful street art in Temple Bar"
    },
    {
      id: 2,
      title: "Temple Bar Mural",
      artist: "0x2345...6789",
      lat: 53.3456,
      lng: -6.2644,
      price: "0.05 ETH",
      image: "https://via.placeholder.com/200x200?text=NFT+2",
      description: "Historic mural in Temple Bar district"
    },
    {
      id: 3,
      title: "Phoenix Park",
      artist: "0x3456...7890",
      lat: 53.3558,
      lng: -6.3298,
      price: "0.2 ETH",
      image: "https://via.placeholder.com/200x200?text=NFT+3",
      description: "Nature photography in Phoenix Park"
    }
  ]

  const filters = [
    { value: 'all', label: 'All NFTs' },
    { value: 'art', label: 'Art' },
    { value: 'photography', label: 'Photography' },
    { value: 'music', label: 'Music' },
    { value: 'collectibles', label: 'Collectibles' }
  ]

  useEffect(() => {
    // Check if Mapbox token is available
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox access token is required. Please add VITE_MAPBOX_TOKEN to your .env file')
      setMapError('Mapbox token missing')
      return
    }

    if (map.current) return // Initialize map only once

    console.log('Initializing Mapbox map...')

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // For different styling
        center: [lng, lat],
        zoom: zoom,
        pitch: 0,
        bearing: 0
      })

      // Error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e)
        setMapError('Map failed to load')
      })

      // Load event
      map.current.on('load', () => {
        console.log('Map loaded successfully!')
        setMapLoaded(true)
        addNFTMarkers()
      })

      // Navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      
      // Geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      )

      // Update state when the map moves
      map.current.on('move', () => {
        if (map.current) {
          setLng(map.current.getCenter().lng.toFixed(4))
          setLat(map.current.getCenter().lat.toFixed(4))
          setZoom(map.current.getZoom().toFixed(2))
        }
      })

    } catch (error) {
      console.error('Error initializing map:', error)
      setMapError('Failed to initialize map')
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const addNFTMarkers = () => {
    if (!map.current) return

    mockNFTs.forEach((nft) => {
      // Create custom marker element
      const markerEl = document.createElement('div')
      markerEl.style.width = '40px'
      markerEl.style.height = '40px'
      markerEl.style.backgroundColor = '#3B82F6'
      markerEl.style.borderRadius = '50%'
      markerEl.style.cursor = 'pointer'
      markerEl.style.display = 'flex'
      markerEl.style.alignItems = 'center'
      markerEl.style.justifyContent = 'center'
      markerEl.style.border = '2px solid white'
      markerEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
      markerEl.innerHTML = '📍'

      // Add click event to marker
      markerEl.addEventListener('click', () => {
        setSelectedNFT(nft)
      })

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; font-size: 14px; margin: 0 0 4px 0;">${nft.title}</h3>
          <p style="font-size: 12px; color: #666; margin: 0;">${nft.price}</p>
        </div>
      `)

      // Add marker
      new mapboxgl.Marker(markerEl)
        .setLngLat([nft.lng, nft.lat])
        .setPopup(popup)
        .addTo(map.current)
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <MapPin className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore the Map</h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect your wallet to explore geo-tagged NFTs from around the world.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-blue-800">
              Please connect your wallet from the Wallet page to access the interactive map and discover location-based NFT art.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <MapPin className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Map Configuration Required</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 mb-4">
              Mapbox access token is missing. Please add your token to continue.
            </p>
            <div className="text-sm text-red-700 space-y-2 text-left">
              <p><strong>Steps to fix:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Get your token from mapbox.com</li>
                <li>Add to .env: VITE_MAPBOX_TOKEN=pk.your_token</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <MapPin className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Map Error</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-800 mb-4">
              Error: {mapError}
            </p>
            <div className="text-sm text-red-700 space-y-2 text-left">
              <p><strong>Possible fixes:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check your Mapbox token is valid</li>
                <li>Verify token has correct permissions</li>
                <li>Check browser console for more details</li>
                <li>Try refreshing the page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <div className="bg-white border-b border-gray-200 p-4 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Explore Map</h1>
            <p className="text-gray-600">
              Discover geo-tagged NFTs from around the world 
              {mapLoaded ? '<3' : ' (Loading...)'}
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search locations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </form>
            
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              {filters.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapContainer}
          className="w-full h-full"
          style={{ backgroundColor: '#f0f0f0' }}
        />

        {/* Map Info Overlay */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-sm">
          <div>
            Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            <br />
            Status: {mapLoaded ? 'Loaded!' : 'Loading...'}
          </div>
        </div>

        {/* Loading indicator */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-2">Map Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span>Current Artworks/Events</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
              <span>Previous NFTs</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>NFTs of Interest</span>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Info Panel */}
      {selectedNFT && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedNFT.image} 
                  alt={selectedNFT.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedNFT.title}</h3>
                  <p className="text-gray-600">by {selectedNFT.artist}</p>
                  <p className="text-sm text-gray-500">{selectedNFT.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{selectedNFT.price}</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-2">
                    View Details
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-gray-400 hover:text-gray-600 ml-4"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}