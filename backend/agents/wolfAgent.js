import { GoogleGenAI } from '@google/genai';
import yahooFinance from 'yahoo-finance2';

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * The Wolf Agent - Aggressive Investment Analyst
 * Specializes in stock analysis, market data, and buy/sell recommendations
 */
class WolfAgent {
    constructor() {
        this.model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });
        this.personality = `You are "The Wolf" - a sharp, data-driven investment analyst.
Your role:
- Analyze stocks using real market data
- Provide buy/sell recommendations based on fundamentals
- Compare investment options objectively
- Focus on P/E ratios, analyst ratings, and market trends
- Be direct and confident in your analysis
- Always cite specific numbers and data points

Tone: Professional, analytical, slightly aggressive`;
    }

    async analyzeStock(stockSymbol, userContext = {}) {
        try {
            // Fetch real stock data from Yahoo Finance
            const quote = await yahooFinance.quote(stockSymbol);
            const summary = await yahooFinance.quoteSummary(stockSymbol, {
                modules: ['price', 'summaryDetail', 'financialData', 'recommendationTrend']
            });

            const stockData = {
                symbol: quote.symbol,
                price: quote.regularMarketPrice,
                change: quote.regularMarketChange,
                changePercent: quote.regularMarketChangePercent,
                peRatio: summary.summaryDetail?.trailingPE,
                marketCap: quote.marketCap,
                fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
                analystRating: summary.financialData?.recommendationMean,
                targetPrice: summary.financialData?.targetMeanPrice,
            };

            return stockData;
        } catch (error) {
            console.error('Error fetching stock data:', error);
            return null;
        }
    }

    async compareStocks(stock1Symbol, stock2Symbol) {
        try {
            const [stock1Data, stock2Data] = await Promise.all([
                this.analyzeStock(stock1Symbol),
                this.analyzeStock(stock2Symbol),
            ]);

            if (!stock1Data || !stock2Data) {
                return {
                    success: false,
                    message: 'Unable to fetch stock data. Please check the symbols.',
                };
            }

            const prompt = `${this.personality}

Compare these two stocks and provide a buy/sell recommendation:

**${stock1Data.symbol}:**
- Current Price: $${stock1Data.price}
- P/E Ratio: ${stock1Data.peRatio || 'N/A'}
- Market Cap: $${stock1Data.marketCap}
- 52-Week Range: $${stock1Data.fiftyTwoWeekLow} - $${stock1Data.fiftyTwoWeekHigh}
- Analyst Rating: ${stock1Data.analystRating || 'N/A'} (1=Strong Buy, 5=Sell)
- Target Price: $${stock1Data.targetPrice || 'N/A'}

**${stock2Data.symbol}:**
- Current Price: $${stock2Data.price}
- P/E Ratio: ${stock2Data.peRatio || 'N/A'}
- Market Cap: $${stock2Data.marketCap}
- 52-Week Range: $${stock2Data.fiftyTwoWeekLow} - $${stock2Data.fiftyTwoWeekHigh}
- Analyst Rating: ${stock2Data.analystRating || 'N/A'}
- Target Price: $${stock2Data.targetPrice || 'N/A'}

Provide a detailed comparison and recommendation in markdown format. Include:
1. Key metrics comparison
2. Which stock is better and why
3. Clear BUY/SELL/HOLD recommendation for each
4. Risk assessment`;

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            return {
                success: true,
                analysis: result.response.text(),
                stockData: { stock1: stock1Data, stock2: stock2Data },
            };
        } catch (error) {
            console.error('Wolf Agent error:', error);
            return {
                success: false,
                message: 'Error analyzing stocks',
                error: error.message,
            };
        }
    }

    async reply(userMessage, userContext = {}) {
        try {
            const contextInfo = userContext.monthlyIncome
                ? `\n\nUser Context:\n- Monthly Income: ₹${userContext.monthlyIncome}\n- Current Savings: ₹${userContext.currentSavings}\n- Risk Tolerance: ${userContext.riskTolerance || 'medium'}`
                : '';

            const prompt = `${this.personality}${contextInfo}

User question: ${userMessage}

Provide a detailed financial analysis. If the question is about specific stocks, mention that you can provide real-time data if they provide stock symbols.`;

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            return {
                success: true,
                response: result.response.text(),
                agent: 'wolf',
            };
        } catch (error) {
            console.error('Wolf Agent error:', error);
            return {
                success: false,
                message: 'Error processing request',
                error: error.message,
            };
        }
    }
}

export default new WolfAgent();
