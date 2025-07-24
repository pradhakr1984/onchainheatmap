import useSWR from 'swr';

// Types for API responses
export interface FlowData {
  date: number;
  value: number;
}

export interface HeatmapData {
  asset: string;
  cohort: string;
  value: number;
  date: string;
}

interface GlassnodeResponse {
  t: number;
  v: number;
}

// Fetcher with rate-limit retries
const fetcher = async (url: string) => {
  const maxRetries = 3;
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait and retry
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError!;
};

// Glassnode API functions
export async function getExchangeFlows(asset: string, start: number, end: number): Promise<FlowData[]> {
  const url = `https://api.glassnode.com/v2/metrics/transactions/volume_change_from_exchanges?asset=${asset}&api_key=${process.env.GLASSNODE_API_KEY}&s=${start}&u=${end}&i=1d`;
  const data = await fetcher(url) as GlassnodeResponse[];
  return data.map((d: GlassnodeResponse) => ({ date: d.t, value: d.v }));
}

export async function getWhaleFlows(asset: string, start: number, end: number): Promise<FlowData[]> {
  const url = `https://api.glassnode.com/v2/metrics/transactions/volume_change_whale?asset=${asset}&api_key=${process.env.GLASSNODE_API_KEY}&s=${start}&u=${end}&i=1d`;
  const data = await fetcher(url) as GlassnodeResponse[];
  return data.map((d: GlassnodeResponse) => ({ date: d.t, value: d.v }));
}

export async function getMinerFlows(asset: string, start: number, end: number): Promise<FlowData[]> {
  const url = `https://api.glassnode.com/v2/metrics/transactions/volume_change_miners?asset=${asset}&api_key=${process.env.GLASSNODE_API_KEY}&s=${start}&u=${end}&i=1d`;
  const data = await fetcher(url) as GlassnodeResponse[];
  return data.map((d: GlassnodeResponse) => ({ date: d.t, value: d.v }));
}

export async function getSmartContractFlows(asset: string, start: number, end: number): Promise<FlowData[]> {
  const url = `https://api.glassnode.com/v2/metrics/transactions/volume_change_smart_contracts?asset=${asset}&api_key=${process.env.GLASSNODE_API_KEY}&s=${start}&u=${end}&i=1d`;
  const data = await fetcher(url) as GlassnodeResponse[];
  return data.map((d: GlassnodeResponse) => ({ date: d.t, value: d.v }));
}

export async function getRetailFlows(asset: string, start: number, end: number): Promise<FlowData[]> {
  const url = `https://api.glassnode.com/v2/metrics/transactions/volume_change_retail?asset=${asset}&api_key=${process.env.GLASSNODE_API_KEY}&s=${start}&u=${end}&i=1d`;
  const data = await fetcher(url) as GlassnodeResponse[];
  return data.map((d: GlassnodeResponse) => ({ date: d.t, value: d.v }));
}

// SWR hooks for data fetching
export function useFlows(asset: string, cohort: string, start: number, end: number) {
  const getFlowFunction = {
    'exchanges': getExchangeFlows,
    'whales': getWhaleFlows,
    'miners': getMinerFlows,
    'smart-contracts': getSmartContractFlows,
    'retail': getRetailFlows,
  }[cohort];

  const { data, error, isLoading } = useSWR(
    getFlowFunction ? `${asset}-${cohort}-${start}-${end}` : null,
    () => getFlowFunction!(asset, start, end),
    {
      revalidateOnFocus: false,
      refreshInterval: 30 * 60 * 1000, // 30 minutes
    }
  );

  return { data, error, isLoading };
}

// Get all assets from environment
export function getAssets(): string[] {
  return process.env.NEXT_PUBLIC_ASSETS?.split(',') || ['BTC', 'ETH', 'SOL', 'XRP', 'USDT', 'USDC'];
}

// Get all cohorts
export const COHORTS = [
  { id: 'exchanges', label: 'Exchanges', description: 'Centralized exchanges' },
  { id: 'whales', label: 'Whales', description: '> 1K BTC equivalent' },
  { id: 'miners', label: 'Miners', description: 'Mining pools' },
  { id: 'smart-contracts', label: 'Smart Contracts', description: 'DeFi protocols' },
  { id: 'retail', label: 'Retail', description: '< 1 BTC equivalent' },
]; 

// Real API integration with CoinGecko and Messari (Free alternatives)
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const MESSARI_API_BASE = 'https://data.messari.io/api/v1';

// Messari API is completely free, no API key required
const MESSARI_API_KEY = process.env.NEXT_PUBLIC_MESSARI_API_KEY || '';

export interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  circulating_supply: number;
  total_supply: number;
}

export interface MessariAssetData {
  id: string;
  symbol: string;
  name: string;
  metrics: {
    market_data: {
      price_usd: number;
      market_cap_usd: number;
      volume_last_24_hours: number;
      percent_change_usd_24h: number;
    };
    on_chain_data: {
      active_addresses_24h: number;
      network_transactions_24h: number;
    };
  };
}

export interface RealFlowData {
  asset: string;
  cohort: string;
  value: number;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  dataSource: string;
}

// Get real asset data from Messari API (Free)
export async function getMessariAssetData(assetId: string): Promise<MessariAssetData | null> {
  try {
    const response = await fetch(`${MESSARI_API_BASE}/assets/${assetId}/metrics`);
    
    if (!response.ok) {
      console.warn(`Messari API request failed for ${assetId}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching Messari data for ${assetId}:`, error);
    return null;
  }
}

// Get top 25 cryptocurrencies by market cap
export async function getTopCoins(): Promise<CoinGeckoCoin[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=24h,7d,30d`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top coins:', error);
    throw error;
  }
}

// Get historical price data for a specific coin
export async function getHistoricalData(coinId: string, days: number): Promise<{
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}

// Get real fund flow estimates based on Messari on-chain data
export async function getRealFundFlows(): Promise<RealFlowData[]> {
  const flowData: RealFlowData[] = [];
  const coins = await getTopCoins();
  
  // Map CoinGecko IDs to Messari IDs
  const assetMap: { [key: string]: string } = {
    'bitcoin': 'bitcoin',
    'ethereum': 'ethereum',
    'solana': 'solana',
    'ripple': 'ripple',
    'tether': 'tether',
    'usd-coin': 'usd-coin',
    'binancecoin': 'binancecoin',
    'cardano': 'cardano',
    'avalanche-2': 'avalanche-2',
    'dogecoin': 'dogecoin',
    'matic-network': 'matic-network',
    'polkadot': 'polkadot',
    'chainlink': 'chainlink',
    'uniswap': 'uniswap',
    'cosmos': 'cosmos',
    'litecoin': 'litecoin',
    'ethereum-classic': 'ethereum-classic',
    'stellar': 'stellar',
    'algorand': 'algorand',
    'vechain': 'vechain',
    'internet-computer': 'internet-computer',
    'filecoin': 'filecoin',
    'tron': 'tron',
    'near': 'near',
    'aptos': 'aptos'
  };

  for (const coin of coins) {
    const assetSymbol = assetMap[coin.id]?.toUpperCase() || coin.symbol.toUpperCase();
    const messariId = assetMap[coin.id];
    
    // Get real on-chain data from Messari
    let messariData: MessariAssetData | null = null;
    if (messariId) {
      messariData = await getMessariAssetData(messariId);
    }

    const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];
    cohorts.forEach(cohort => {
      let value = 0;
      let dataSource = 'Volume-based estimate';

      // Use real on-chain data when available
      if (messariData) {
        const { market_data, on_chain_data } = messariData.metrics;
        const volumeFlow = (market_data.volume_last_24_hours / 1000000) * 0.1;
        const activeAddresses = on_chain_data.active_addresses_24h || 0;
        const transactions = on_chain_data.network_transactions_24h || 0;

        switch (cohort) {
          case 'exchanges':
            value = volumeFlow * 1.0;
            dataSource = 'Messari API + Volume';
            break;
          case 'whales':
            value = (market_data.percent_change_usd_24h / 100) * market_data.market_cap_usd / 1000000 * 0.5;
            dataSource = 'Messari API + Price Change';
            break;
          case 'miners':
            value = volumeFlow * 0.1;
            dataSource = 'Messari API + Volume';
            break;
          case 'smart-contracts':
            if (['ETH', 'SOL', 'AVAX', 'MATIC', 'DOT', 'LINK', 'UNI', 'ATOM'].includes(assetSymbol)) {
              value = volumeFlow * 0.2 + (transactions / 10000);
              dataSource = 'Messari API + On-chain Activity';
            } else {
              value = volumeFlow * 0.05;
              dataSource = 'Messari API + Volume';
            }
            break;
          case 'retail':
            value = volumeFlow * 0.05 + (activeAddresses / 100000);
            dataSource = 'Messari API + Active Addresses';
            break;
        }
      } else {
        // Fallback to volume-based estimates
        const volumeFlow = (coin.total_volume / 1000000) * 0.1;
        
        switch (cohort) {
          case 'exchanges':
            value = volumeFlow * 1.0;
            break;
          case 'whales':
            value = (coin.price_change_percentage_24h / 100) * coin.market_cap / 1000000 * 0.5;
            break;
          case 'miners':
            value = volumeFlow * 0.1;
            break;
          case 'smart-contracts':
            if (['ETH', 'SOL', 'AVAX', 'MATIC', 'DOT', 'LINK', 'UNI', 'ATOM'].includes(assetSymbol)) {
              value = volumeFlow * 0.2;
            } else {
              value = volumeFlow * 0.05;
            }
            break;
          case 'retail':
            value = volumeFlow * 0.05;
            break;
        }
      }

      flowData.push({
        asset: assetSymbol,
        cohort,
        value: Math.round(value),
        price: messariData?.metrics.market_data.price_usd || coin.current_price,
        marketCap: messariData?.metrics.market_data.market_cap_usd || coin.market_cap,
        volume24h: messariData?.metrics.market_data.volume_last_24_hours || coin.total_volume,
        priceChange24h: messariData?.metrics.market_data.percent_change_usd_24h || coin.price_change_percentage_24h,
        dataSource
      });
    });
  }
  
  return flowData;
}

// Rate limiting helper (CoinGecko has rate limits)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1200; // 1.2 seconds between requests

export async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return fetch(url);
} 