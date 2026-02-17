import { GoogleGenAI } from '@google/genai';
import wolfAgent from './wolfAgent.js';
import sageAgent from './sageAgent.js';

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

/**
 * The Sniper Agent - Intelligent Coordinator
 * Routes user queries to the appropriate specialist agent
 */
class SniperAgent {
    constructor() {
        this.model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });
    }

    async analyzeIntent(userMessage) {
        try {
            const prompt = `You are an intent classifier for a financial AI system.
Analyze the user's message and determine which agent should handle it:

1. "wolf" - For investment questions, stock analysis, market data, buy/sell decisions
2. "sage" - For budgeting, spending decisions, financial goals, behavioral coaching
3. "both" - If the question requires both investment analysis AND behavioral coaching

User message: "${userMessage}"

Respond with ONLY one word: wolf, sage, or both`;

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            const intent = result.response.text().trim().toLowerCase();

            // Validate response
            if (['wolf', 'sage', 'both'].includes(intent)) {
                return intent;
            }

            // Default to sage for general questions
            return 'sage';
        } catch (error) {
            console.error('Intent analysis error:', error);
            return 'sage'; // Default fallback
        }
    }

    async route(userMessage, userContext = {}) {
        try {
            // Analyze user intent
            const intent = await this.analyzeIntent(userMessage);

            console.log(`🎯 Sniper routing to: ${intent}`);

            let responses = [];

            // Route to appropriate agent(s)
            if (intent === 'wolf' || intent === 'both') {
                const wolfResponse = await wolfAgent.reply(userMessage, userContext);
                responses.push({
                    agent: 'wolf',
                    agentName: 'The Wolf',
                    agentRole: 'Investment Analyst',
                    agentIcon: '🐺',
                    ...wolfResponse,
                });
            }

            if (intent === 'sage' || intent === 'both') {
                const sageResponse = await sageAgent.reply(userMessage, userContext);
                responses.push({
                    agent: 'sage',
                    agentName: 'The Sage',
                    agentRole: 'Financial Coach',
                    agentIcon: '🧘',
                    ...sageResponse,
                });
            }

            return {
                success: true,
                intent,
                responses,
                timestamp: new Date(),
            };
        } catch (error) {
            console.error('Sniper routing error:', error);
            return {
                success: false,
                message: 'Error routing your request',
                error: error.message,
            };
        }
    }

    async handleStockComparison(stock1, stock2, userContext = {}) {
        try {
            // Wolf handles the comparison
            const wolfResponse = await wolfAgent.compareStocks(stock1, stock2);

            // Sage provides behavioral perspective if user context available
            let sageResponse = null;
            if (userContext.monthlyIncome) {
                const avgPrice = wolfResponse.stockData
                    ? (wolfResponse.stockData.stock1.price + wolfResponse.stockData.stock2.price) / 2
                    : 0;

                const message = `I'm considering investing around $${avgPrice.toFixed(2)} in either ${stock1} or ${stock2}. What should I consider from a behavioral perspective?`;
                sageResponse = await sageAgent.reply(message, userContext);
            }

            return {
                success: true,
                intent: 'stock_comparison',
                responses: [
                    {
                        agent: 'wolf',
                        agentName: 'The Wolf',
                        agentRole: 'Investment Analyst',
                        agentIcon: '🐺',
                        ...wolfResponse,
                    },
                    ...(sageResponse ? [{
                        agent: 'sage',
                        agentName: 'The Sage',
                        agentRole: 'Financial Coach',
                        agentIcon: '🧘',
                        ...sageResponse,
                    }] : []),
                ],
            };
        } catch (error) {
            console.error('Stock comparison error:', error);
            return {
                success: false,
                message: 'Error comparing stocks',
                error: error.message,
            };
        }
    }
}

export default new SniperAgent();
