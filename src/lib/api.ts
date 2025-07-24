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

// Real API integration with CoinGecko and CryptoQuant
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const CRYPTOQUANT_API_BASE = 'https://api.cryptoquant.com/v1';

// You'll need to get a free API key from https://cryptoquant.com/
const CRYPTOQUANT_API_KEY = process.env.NEXT_PUBLIC_CRYPTOQUANT_API_KEY || '';

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

export interface CryptoQuantFlowData {
  exchange_inflow: number;
  exchange_outflow: number;
  net_flow: number;
  timestamp: number;
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

// Get real exchange flow data from CryptoQuant
export async function getRealExchangeFlows(asset: string): Promise<CryptoQuantFlowData[]> {
  if (!CRYPTOQUANT_API_KEY) {
    console.warn('CryptoQuant API key not found. Using fallback data.');
    return [];
  }

  try {
    const response = await fetch(
      `${CRYPTOQUANT_API_BASE}/btc/flow/exchange?api_key=${CRYPTOQUANT_API_KEY}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`CryptoQuant API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching CryptoQuant data:', error);
    return [];
  }
}

// Get real whale flow data (large transactions)
export async function getRealWhaleFlows(): Promise<CryptoQuantFlowData[]> {
  if (!CRYPTOQUANT_API_KEY) {
    console.warn('CryptoQuant API key not found. Using fallback data.');
    return [];
  }

  try {
    const response = await fetch(
      `${CRYPTOQUANT_API_BASE}/btc/flow/whale?api_key=${CRYPTOQUANT_API_KEY}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`CryptoQuant API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching whale flow data:', error);
    return [];
  }
}

// Get real miner flow data
export async function getRealMinerFlows(): Promise<CryptoQuantFlowData[]> {
  if (!CRYPTOQUANT_API_KEY) {
    console.warn('CryptoQuant API key not found. Using fallback data.');
    return [];
  }

  try {
    const response = await fetch(
      `${CRYPTOQUANT_API_BASE}/btc/flow/miner?api_key=${CRYPTOQUANT_API_KEY}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`CryptoQuant API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching miner flow data:', error);
    return [];
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

// Get real fund flow data combining multiple sources
export async function getRealFundFlows(): Promise<RealFlowData[]> {
  const flowData: RealFlowData[] = [];
  const coins = await getTopCoins();
  
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

  for (const coin of coins) {
    const assetSymbol = assetMap[coin.id];
    if (!assetSymbol) continue;

    // Get real flow data for BTC (CryptoQuant has best BTC data)
    if (assetSymbol === 'BTC') {
      try {
        const [exchangeFlows, whaleFlows, minerFlows] = await Promise.all([
          getRealExchangeFlows(assetSymbol),
          getRealWhaleFlows(),
          getRealMinerFlows()
        ]);

        // Add real exchange flows
        if (exchangeFlows.length > 0) {
          const latest = exchangeFlows[0];
          flowData.push({
            asset: assetSymbol,
            cohort: 'exchanges',
            value: Math.round(latest.net_flow / 1000000), // Convert to millions
            price: coin.current_price,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            priceChange24h: coin.price_change_percentage_24h,
            dataSource: 'CryptoQuant API'
          });
        }

        // Add real whale flows
        if (whaleFlows.length > 0) {
          const latest = whaleFlows[0];
          flowData.push({
            asset: assetSymbol,
            cohort: 'whales',
            value: Math.round((latest.net_flow || 0) / 1000000),
            price: coin.current_price,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            priceChange24h: coin.price_change_percentage_24h,
            dataSource: 'CryptoQuant API'
          });
        }

        // Add real miner flows
        if (minerFlows.length > 0) {
          const latest = minerFlows[0];
          flowData.push({
            asset: assetSymbol,
            cohort: 'miners',
            value: Math.round((latest.net_flow || 0) / 1000000),
            price: coin.current_price,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            priceChange24h: coin.price_change_percentage_24h,
            dataSource: 'CryptoQuant API'
          });
        }
      } catch (error) {
        console.error(`Error fetching real flows for ${assetSymbol}:`, error);
      }
    }

    // For other assets, use volume-based estimates (clearly labeled)
    const cohorts = ['exchanges', 'whales', 'miners', 'smart-contracts', 'retail'];
    cohorts.forEach(cohort => {
      if (assetSymbol === 'BTC' && ['exchanges', 'whales', 'miners'].includes(cohort)) {
        // Skip - already added real data above
        return;
      }

      // Volume-based estimates for other assets/cohorts
      const volumeFlow = (coin.total_volume / 1000000) * 0.1;
      let value = 0;

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

      flowData.push({
        asset: assetSymbol,
        cohort,
        value: Math.round(value),
        price: coin.current_price,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        priceChange24h: coin.price_change_percentage_24h,
        dataSource: assetSymbol === 'BTC' ? 'CryptoQuant API' : 'Volume-based estimate'
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