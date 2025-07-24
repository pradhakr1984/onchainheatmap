# 🚀 Deployment Guide

This guide will help you deploy the On-Chain Fund-Flow Heatmap to Vercel via GitHub.

## 📋 Prerequisites

1. **GitHub Account** - You'll need a GitHub account to host the repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **API Keys** - Get API keys from:
   - [Glassnode](https://glassnode.com) - For on-chain data
   - [CryptoQuant](https://cryptoquant.com) - For additional metrics

## 🔧 Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   cd onchain-heatmap
   git init
   git add .
   git commit -m "Initial commit: On-Chain Fund-Flow Heatmap"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `onchain-heatmap`
   - Make it public or private (your choice)
   - Don't initialize with README (we already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/onchain-heatmap.git
   git branch -M main
   git push -u origin main
   ```

## 🌐 Step 2: Deploy to Vercel

1. **Connect Vercel to GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your `onchain-heatmap` repository

2. **Configure Environment Variables**:
   - In the Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     GLASSNODE_API_KEY=your_glassnode_api_key
     CRYPTOQUANT_API_KEY=your_cryptoquant_api_key
     NEXT_PUBLIC_ASSETS=BTC,ETH,SOL,XRP,USDT,USDC
     ```

3. **Deploy**:
   - Vercel will automatically detect it's a Next.js project
   - Click "Deploy"
   - Wait for the build to complete

## 🔑 Step 3: Get API Keys

### Glassnode API Key
1. Go to [glassnode.com](https://glassnode.com)
2. Sign up for an account
3. Navigate to "API" section
4. Generate a new API key
5. Copy the key to your Vercel environment variables

### CryptoQuant API Key
1. Go to [cryptoquant.com](https://cryptoquant.com)
2. Sign up for an account
3. Navigate to "API" section
4. Generate a new API key
5. Copy the key to your Vercel environment variables

## 🎯 Step 4: Test Your Deployment

1. **Visit your deployed site** (Vercel will provide a URL like `https://your-project.vercel.app`)
2. **Test the features**:
   - Change date ranges
   - Toggle different cohorts
   - Verify the heatmap displays correctly
   - Check dark/light mode

## 🔄 Step 5: Continuous Deployment

- Every time you push to the `main` branch on GitHub, Vercel will automatically redeploy
- You can also set up preview deployments for pull requests

## 🛠 Troubleshooting

### Build Errors
- Check that all environment variables are set correctly
- Verify API keys are valid and have proper permissions
- Check the Vercel build logs for specific error messages

### Data Not Loading
- Verify your API keys are working by testing them directly
- Check the browser console for any CORS or network errors
- Ensure the API endpoints are accessible from Vercel's servers

### Performance Issues
- The app uses SWR for caching, so subsequent loads should be faster
- Consider upgrading to a paid Vercel plan for better performance
- Monitor API rate limits to avoid hitting limits

## 📊 Monitoring

- **Vercel Analytics**: Built-in analytics in your Vercel dashboard
- **API Usage**: Monitor your Glassnode/CryptoQuant API usage
- **Error Tracking**: Consider adding Sentry for error monitoring

## 🔒 Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Consider using Vercel's edge functions for API proxying if needed
- Regularly rotate your API keys

## 🎉 Success!

Your On-Chain Fund-Flow Heatmap is now live! Share the URL with your team and start getting those data-driven talking points for your crypto conversations.

---

**Next Steps:**
- Add custom domains if needed
- Set up monitoring and alerts
- Consider adding more assets or cohorts
- Implement CSV export functionality
- Add transaction explorer links 