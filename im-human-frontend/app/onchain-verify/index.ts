import axios from 'axios';

interface TransactionNode {
  digest: string;
  effects: {
    status: string;
    timestamp?: string;
  };
  sender: {
    address: string;
  };
}

interface TransactionData {
  data: {
    address: {
      transactions: {
        nodes: TransactionNode[];
      };
    };
  };
}

export interface AnalysisResult {
  humanScore: number;
  successRate: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  aiAnalysis: string | null;
}

export const fetchUserActivities = async (addressUser: string) => {
  try {
    const query = `
      query GetUserActivities($address: SuiAddress!) {
        address(address: $address) {
          transactions(first: 20) {
            nodes {
              digest
              effects {
                status
                timestamp
              }
              sender {
                address
              }
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://graphql.mainnet.sui.io/graphql',
      {
        query,
        variables: {
          address: addressUser
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Activities fetched successfully:', response.data);
    return response.data;
  } catch (err: any) {
    console.error('Error fetching activities:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Analyzes transaction success rate from the fetched data
 */
export const analyzeTransactionSuccessRate = (transactionData: TransactionData) => {
  const transactions = transactionData.data.address.transactions.nodes;
  const totalTransactions = transactions.length;

  if (totalTransactions === 0) {
    return {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      successRate: 0
    };
  }

  const successfulTransactions = transactions.filter(
    (tx) => tx.effects.status.toLowerCase() === 'success'
  ).length;
  const failedTransactions = totalTransactions - successfulTransactions;
  const successRate = (successfulTransactions / totalTransactions) * 100;

  return {
    totalTransactions,
    successfulTransactions,
    failedTransactions,
    successRate
  };
};

/**
 * Calculates human score based on transaction success rate
 * - If 51% or more transactions failed: score below 40/100
 * - If 51% or more transactions succeeded: score above 60/100
 */
export const calculateHumanScore = (successRate: number): number => {
  if (successRate >= 51) {
    // Success rate >= 51%, score between 60-100
    // Linear interpolation: 51% -> 60, 100% -> 100
    return Math.round(60 + ((successRate - 51) / 49) * 40);
  } else {
    // Success rate < 51%, score between 0-40
    // Linear interpolation: 0% -> 0, 50% -> 40
    return Math.round((successRate / 50) * 40);
  }
};

/**
 * Generates a rule-based analysis when AI is unavailable
 */
const generateFallbackAnalysis = (stats: {
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
}): string => {
  const { successRate, totalTransactions, failedTransactions } = stats;

  if (totalTransactions === 0) {
    return "No transaction history found. Unable to determine behavior patterns.";
  }

  if (successRate >= 90) {
    return `Excellent transaction success rate of ${successRate.toFixed(1)}%. This pattern suggests careful, deliberate transaction behavior typical of human users who verify details before submission. High confidence in human-like behavior.`;
  } else if (successRate >= 51) {
    return `Good transaction success rate of ${successRate.toFixed(1)}%. The presence of some failed transactions (${failedTransactions}) suggests natural human error patterns, such as incorrect inputs or network timing issues. Moderate to high confidence in human behavior.`;
  } else if (successRate >= 20) {
    return `Lower success rate of ${successRate.toFixed(1)}% with ${failedTransactions} failed transactions. This could indicate experimentation, learning curve, or automated testing patterns. Additional verification recommended.`;
  } else {
    return `Very low success rate of ${successRate.toFixed(1)}%. High failure rate may suggest bot-like behavior, automated testing, or technical issues. Low confidence in human behavior patterns.`;
  }
};

/**
 * Uses OpenAI API to analyze transaction data and provide insights
 * Returns null if API is unavailable (rate limit, no key, etc.)
 */
export const analyzeWithAI = async (
  transactionData: TransactionData,
  stats: {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    successRate: number;
  }
): Promise<string | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      console.warn('OpenAI API key is not configured. Using fallback analysis.');
      return null;
    }

    const transactions = transactionData.data.address.transactions.nodes;

    const prompt = `You are analyzing blockchain transaction data from the Sui network to determine if this wallet behavior appears human or bot-like.

Transaction Statistics:
- Total Transactions: ${stats.totalTransactions}
- Successful Transactions: ${stats.successfulTransactions}
- Failed Transactions: ${stats.failedTransactions}
- Success Rate: ${stats.successRate.toFixed(2)}%

Transaction Details:
${transactions.map((tx, idx) => `${idx + 1}. Status: ${tx.effects.status}, Digest: ${tx.digest.substring(0, 16)}...`).join('\n')}

Please analyze this transaction pattern and provide insights on:
1. Whether the success/failure pattern suggests human or bot behavior
2. Any notable patterns in the transaction activity
3. Risk assessment based on the transaction history
4. Overall confidence in the human score

Provide a concise analysis in 3-4 sentences.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a blockchain analysis expert specializing in detecting human vs bot behavior patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 10000 // 10 second timeout
      }
    );

    return response.data.choices[0].message.content;
  } catch (err: any) {
    const errorMessage = err.response?.data?.error?.message || err.message;
    const statusCode = err.response?.status;

    return null;
  }
};

/**
 * Main analysis function that combines all features
 * Fetches transactions, calculates human score, and provides AI analysis
 */
export const analyzeUserTransactions = async (addressUser: string): Promise<AnalysisResult> => {
  try {
    // Fetch transaction data
    const transactionData = await fetchUserActivities(addressUser);

    // Analyze success rate
    const stats = analyzeTransactionSuccessRate(transactionData);

    // Calculate human score
    const humanScore = calculateHumanScore(stats.successRate);

    // Try to get AI analysis, fall back to rule-based if unavailable
    let aiAnalysis = await analyzeWithAI(transactionData, stats);

    // If AI analysis failed, use fallback
    if (!aiAnalysis) {
      aiAnalysis = generateFallbackAnalysis(stats);
    }

    return {
      humanScore,
      successRate: stats.successRate,
      totalTransactions: stats.totalTransactions,
      successfulTransactions: stats.successfulTransactions,
      failedTransactions: stats.failedTransactions,
      aiAnalysis
    };
  } catch (err: any) {
    console.error('Error analyzing user transactions:', err);
    throw err;
  }
};
