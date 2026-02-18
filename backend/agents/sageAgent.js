import { GoogleGenAI } from '@google/genai';

class SageAgent {
    constructor() {
        try {
            if (process.env.GEMINI_API_KEY) {
                const genAI = new GoogleGenAI({
                    apiKey: process.env.GEMINI_API_KEY,
                });
                this.model = genAI.getGenerativeModel({
                    model: 'gemini-1.5-flash',
                });
            } else {
                console.warn('⚠️ GEMINI_API_KEY missing. Sage Agent will not function correctly.');
                this.model = null;
            }
        } catch (error) {
            console.error('Error initializing Gemini:', error);
            this.model = null;
        }

        this.personality = `You are "The Sage" - a wise, empathetic financial behavioral coach.
Your role:
- Help users make emotionally intelligent financial decisions
- Remember and reference their financial goals
- Provide gentle nudges against impulsive spending
- Encourage long-term thinking over short-term gratification
- Consider the psychological impact of financial decisions
- Be supportive but honest about financial realities

Tone: Warm, understanding, but firm when needed. Like a caring mentor.`;
    }

    async reply(userMessage, userContext = {}) {
        if (!this.model) {
            return {
                success: false,
                message: 'Sage Agent is offline (Missing API Key)',
                agent: 'sage',
            };
        }
        try {
            // Build context from user's financial profile and goals
            let contextInfo = '';

            if (userContext.monthlyIncome) {
                const disposableIncome = userContext.disposableIncome || 0;
                contextInfo += `\n\nUser's Financial Profile:
- Monthly Income: ₹${userContext.monthlyIncome}
- Disposable Income: ₹${disposableIncome}
- Current Savings: ₹${userContext.currentSavings || 0}`;
            }

            if (userContext.goals && userContext.goals.length > 0) {
                contextInfo += '\n\nUser\'s Financial Goals:';
                userContext.goals.forEach((goal, index) => {
                    const progress = goal.targetAmount > 0
                        ? ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)
                        : 0;
                    contextInfo += `\n${index + 1}. ${goal.name} - Target: ₹${goal.targetAmount}, Progress: ${progress}%, Priority: ${goal.priority}`;
                    if (goal.deadline) {
                        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                        contextInfo += ` (${daysLeft} days remaining)`;
                    }
                });
            }

            if (userContext.conversationHistory && userContext.conversationHistory.length > 0) {
                contextInfo += '\n\nRecent Conversation Context:';
                userContext.conversationHistory.slice(-3).forEach(conv => {
                    contextInfo += `\n- User asked: "${conv.message}"`;
                    contextInfo += `\n  You advised: "${conv.response.substring(0, 100)}..."`;
                });
            }

            const prompt = `${this.personality}${contextInfo}

User's current question/situation: ${userMessage}

Provide thoughtful, personalized advice that:
1. References their specific goals if relevant
2. Considers the emotional/behavioral aspects of the decision
3. Gently challenges impulsive spending if detected
4. Encourages alignment with long-term goals
5. Provides actionable next steps

Be conversational and empathetic, not preachy.`;

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            return {
                success: true,
                response: result.response.text(),
                agent: 'sage',
            };
        } catch (error) {
            console.error('Sage Agent error:', error);
            return {
                success: false,
                message: 'Error processing request',
                error: error.message,
            };
        }
    }

    async analyzeSpendingDecision(itemName, itemPrice, userContext = {}) {
        if (!this.model) {
            return {
                success: false,
                message: 'Sage Agent is offline (Missing API Key)',
                agent: 'sage',
            };
        }
        try {
            const disposableIncome = userContext.disposableIncome || 0;
            const hourlyWage = userContext.hourlyWage || 0;
            const laborHours = hourlyWage > 0 ? (itemPrice / hourlyWage).toFixed(1) : 0;

            let impact = 'SAFE BUY ✅';
            if (itemPrice > userContext.currentSavings) {
                impact = 'BANKRUPTCY RISK ⚠️';
            } else if (itemPrice > disposableIncome) {
                impact = 'EMI TRAP 📉';
            }

            const prompt = `${this.personality}

User Context:
- Monthly Income: ₹${userContext.monthlyIncome}
- Disposable Income: ₹${disposableIncome}
- Current Savings: ₹${userContext.currentSavings}
- Hourly Wage: ₹${hourlyWage}

User is considering buying: ${itemName}
Price: ₹${itemPrice}
Labor Cost: ${laborHours} hours of work
Financial Impact: ${impact}

Active Goals: ${userContext.goals?.map(g => g.name).join(', ') || 'None set'}

Provide a behavioral analysis of this purchase decision. Should they buy it? How does it affect their goals? What's the emotional vs. rational perspective?`;

            const result = await this.model.generateContent({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            });

            return {
                success: true,
                response: result.response.text(),
                analysis: {
                    laborHours,
                    impact,
                    affordability: itemPrice <= disposableIncome,
                },
                agent: 'sage',
            };
        } catch (error) {
            console.error('Sage Agent spending analysis error:', error);
            return {
                success: false,
                message: 'Error analyzing spending decision',
                error: error.message,
            };
        }
    }
}

export default new SageAgent();
