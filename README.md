# 🌊 On-Chain Fund Flow Heatmap

Real-time visualization of cryptocurrency fund movements across top 25 assets and wallet cohorts using actual on-chain data.

## 🎯 Real Data Sources

### **CryptoQuant API** - Real Fund Flows
- **Exchange flows**: Real exchange inflow/outflow data
- **Whale flows**: Large transaction movements
- **Miner flows**: Mining pool fund movements
- **Source**: https://cryptoquant.com/
- **Coverage**: Bitcoin (BTC) has complete real data

### **CoinGecko API** - Market Data
- **Prices**: Real-time cryptocurrency prices
- **Volumes**: 24h trading volumes
- **Market caps**: Current market capitalization
- **Price changes**: 24h, 7d, 30d percentage changes
- **Source**: https://www.coingecko.com/en/api

## 🚀 Setup

### 1. Get CryptoQuant API Key (Free)
1. Visit https://cryptoquant.com/
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_CRYPTOQUANT_API_KEY=your_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

## 📊 Data Accuracy

### **Real Data (BTC)**:
- ✅ Exchange flows from CryptoQuant
- ✅ Whale flows from CryptoQuant  
- ✅ Miner flows from CryptoQuant
- ✅ All market data from CoinGecko

### **Estimated Data (Other Assets)**:
- 📊 Volume-based estimates for other cryptocurrencies
- 📊 Clearly labeled as estimates
- 📊 Based on real market volumes and price changes

## 🎨 Features

- **Real-time data**: Live fund flow updates
- **Top 25 cryptocurrencies**: By market cap
- **5 wallet cohorts**: Exchanges, whales, miners, smart contracts, retail
- **Colorblind-friendly**: Blue/orange color scheme
- **Responsive design**: Works on all devices
- **Date range selection**: 7 days, 30 days, custom ranges

## 🛠️ Tech Stack

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **CryptoQuant API**: Real fund flow data
- **CoinGecko API**: Market data

## 📈 What You'll See

### **Real Fund Flows**:
- **Exchange movements**: Money entering/leaving exchanges
- **Whale transactions**: Large holder movements
- **Miner flows**: Mining pool fund movements
- **Smart contract activity**: DeFi protocol flows
- **Retail movements**: Small holder activity

### **External Flow Calculation**:
- **Exchanges + Retail**: Money entering/leaving the crypto ecosystem
- **Real data for BTC**: Actual on-chain measurements
- **Estimates for others**: Based on market activity

## 🔍 Transparency

- **BTC flows**: 100% real on-chain data from CryptoQuant
- **Other assets**: Volume-based estimates (clearly labeled)
- **Market data**: All real from CoinGecko
- **No fake data**: Everything is either real or clearly marked as estimated

## 📝 License

MIT License - feel free to use and modify!
