// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GeoNFT
 * @dev Simple NFT contract for geo-tagged digital art
 * @author Current Platform
 */
contract GeoNFT is ERC721, ERC721URIStorage, Ownable {
    // Token ID counter (replacing Counters library)
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to location data
    mapping(uint256 => Location) public tokenLocations;
    
    // Mapping from token ID to price (for marketplace functionality)
    mapping(uint256 => uint256) public tokenPrices;
    
    // Mapping to track if token is for sale
    mapping(uint256 => bool) public tokenForSale;
    
    struct Location {
        int256 latitude;   // Stored as integer (multiply by 1e6 for precision)
        int256 longitude;  // Stored as integer (multiply by 1e6 for precision)
        string locationName;
        uint256 timestamp;
    }
    
    // Events
    event NFTMinted(
        uint256 indexed tokenId, 
        address indexed owner, 
        string uri,
        int256 latitude,
        int256 longitude,
        string locationName
    );
    
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event NFTUnlisted(uint256 indexed tokenId);
    
    constructor(address initialOwner) 
        ERC721("Current Geo NFT", "CGEO") 
        Ownable(initialOwner)
    {
        // Start token IDs at 1
        _tokenIdCounter = 1;
    }
    
    /**
     * @dev Mint a new geo-tagged NFT
     * @param to Address to mint the NFT to
     * @param uri IPFS URI containing NFT metadata
     * @param latitude Latitude coordinate (multiplied by 1e6)
     * @param longitude Longitude coordinate (multiplied by 1e6)
     * @param locationName Human-readable location name
     */
    function mintGeoNFT(
        address to,
        string memory uri,
        int256 latitude,
        int256 longitude,
        string memory locationName
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Mint the NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Store location data
        tokenLocations[tokenId] = Location({
            latitude: latitude,
            longitude: longitude,
            locationName: locationName,
            timestamp: block.timestamp
        });
        
        emit NFTMinted(tokenId, to, uri, latitude, longitude, locationName);
        
        return tokenId;
    }
    
    /**
     * @dev List an NFT for sale
     * @param tokenId The token ID to list
     * @param price Price in wei
     */
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can list NFT");
        require(price > 0, "Price must be greater than 0");
        
        tokenPrices[tokenId] = price;
        tokenForSale[tokenId] = true;
        
        emit NFTListed(tokenId, price);
    }
    
    /**
     * @dev Remove NFT from sale
     * @param tokenId The token ID to unlist
     */
    function unlistFromSale(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can unlist NFT");
        
        tokenForSale[tokenId] = false;
        tokenPrices[tokenId] = 0;
        
        emit NFTUnlisted(tokenId);
    }
    
    /**
     * @dev Purchase an NFT that's listed for sale
     * @param tokenId The token ID to purchase
     */
    function purchaseNFT(uint256 tokenId) public payable {
        require(tokenForSale[tokenId], "NFT is not for sale");
        require(msg.value >= tokenPrices[tokenId], "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own NFT");
        
        uint256 price = tokenPrices[tokenId];
        
        // Remove from sale
        tokenForSale[tokenId] = false;
        tokenPrices[tokenId] = 0;
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Transfer payment to seller
        payable(seller).transfer(price);
        
        // Refund excess payment
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
        
        emit NFTSold(tokenId, seller, msg.sender, price);
    }
    
    /**
     * @dev Get location data for a token
     * @param tokenId The token ID
     * @return Location struct containing coordinate and location data
     */
    function getTokenLocation(uint256 tokenId) public view returns (Location memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenLocations[tokenId];
    }
    
    /**
     * @dev Get all NFTs owned by an address
     * @param owner The owner address
     * @return Array of token IDs owned by the address
     */
    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i < _tokenIdCounter; i++) {
            if (_ownerOf(i) != address(0) && ownerOf(i) == owner) {
                tokenIds[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Get all NFTs that are currently for sale
     * @return Arrays of token IDs and their corresponding prices
     */
    function getMarketplaceNFTs() public view returns (uint256[] memory, uint256[] memory) {
        uint256 currentSupply = _tokenIdCounter - 1;
        uint256 forSaleCount = 0;
        
        // Count NFTs for sale
        for (uint256 i = 1; i <= currentSupply; i++) {
            if (_ownerOf(i) != address(0) && tokenForSale[i]) {
                forSaleCount++;
            }
        }
        
        uint256[] memory tokenIds = new uint256[](forSaleCount);
        uint256[] memory prices = new uint256[](forSaleCount);
        uint256 currentIndex = 0;
        
        // Populate arrays
        for (uint256 i = 1; i <= currentSupply; i++) {
            if (_ownerOf(i) != address(0) && tokenForSale[i]) {
                tokenIds[currentIndex] = i;
                prices[currentIndex] = tokenPrices[i];
                currentIndex++;
            }
        }
        
        return (tokenIds, prices);
    }
    
    /**
     * @dev Get the total number of tokens minted
     * @return Total supply of tokens
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    /**
     * @dev Check if a token exists
     * @param tokenId The token ID to check
     * @return Boolean indicating if token exists
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Emergency withdraw function for contract owner
     * Only to be used in emergencies
     */
    function emergencyWithdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    // Required overrides for ERC721URIStorage
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}