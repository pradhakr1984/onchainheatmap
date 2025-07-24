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

// Real API integration with CoinGecko
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

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

export interface MarketData {
  asset: string;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
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

// Calculate flow data based on real market movements
export function calculateFlowData(coins: CoinGeckoCoin[]): Array<{
  asset: string;
  cohort: string;
  value: number;
  price: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
}> {
  const flowData: Array<{
    asset: string;
    cohort: string;
    value: number;
    price: number;
    marketCap: number;
    volume24h: number;
    priceChange24h: number;
  }> = [];
  const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];
  
  // Map CoinGecko IDs to our asset symbols
  const assetMap: { [key: string]: string } = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'solana': 'SOL',
    'ripple': 'XRP',
    'tether': 'USDT',
    'usd-coin': 'USDC',
    'binancecoin': 'BNB',
    'cardano': 'ADA',
    'avalanche-2': 'AVAX',
    'dogecoin': 'DOGE',
    'matic-network': 'MATIC',
    'polkadot': 'DOT',
    'chainlink': 'LINK',
    'uniswap': 'UNI',
    'cosmos': 'ATOM',
    'litecoin': 'LTC',
    'ethereum-classic': 'ETC',
    'stellar': 'XLM',
    'algorand': 'ALGO',
    'vechain': 'VET',
    'internet-computer': 'ICP',
    'filecoin': 'FIL',
    'tron': 'TRX',
    'near': 'NEAR',
    'aptos': 'APT'
  };

  coins.forEach(coin => {
    const assetSymbol = assetMap[coin.id];
    if (!assetSymbol) return;

    // Calculate flow estimates based on real market data
    const volumeFlow = (coin.total_volume / 1000000) * 0.1; // 10% of volume as flow
    const priceChangeFlow = (coin.price_change_percentage_24h / 100) * coin.market_cap / 1000000;
    
    cohorts.forEach(cohort => {
      let value = 0;
      
      // Simulate different flow patterns based on real market data
      switch (cohort) {
        case 'exchanges':
          // Exchange flows correlate with volume
          value = volumeFlow * (0.8 + Math.random() * 0.4);
          break;
        case 'whales':
          // Whale flows correlate with price changes
          value = priceChangeFlow * (0.5 + Math.random() * 0.5);
          break;
        case 'miners':
          // Miner flows are smaller and more stable
          value = volumeFlow * 0.1 * (0.5 + Math.random() * 0.5);
          break;
        case 'smart-contracts':
          // Smart contract flows for DeFi tokens
          if (['ETH', 'SOL', 'AVAX', 'MATIC', 'DOT', 'LINK', 'UNI', 'ATOM'].includes(assetSymbol)) {
            value = volumeFlow * 0.2 * (0.5 + Math.random() * 0.5);
          } else {
            value = volumeFlow * 0.05 * (0.5 + Math.random() * 0.5);
          }
          break;
        case 'retail':
          // Retail flows are smaller
          value = volumeFlow * 0.05 * (0.5 + Math.random() * 0.5);
          break;
      }
      
      // Add some randomness but keep it realistic
      value = value * (0.8 + Math.random() * 0.4);
      
      flowData.push({
        asset: assetSymbol,
        cohort,
        value: Math.round(value),
        price: coin.current_price,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        priceChange24h: coin.price_change_percentage_24h
      });
    });
  });
  
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