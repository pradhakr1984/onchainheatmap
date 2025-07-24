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