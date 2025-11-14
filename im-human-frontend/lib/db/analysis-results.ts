import { prisma } from '../prisma'
import { getOrCreateUser } from './users'

/**
 * Save analysis result
 */
export async function saveAnalysisResult(
  walletAddress: string,
  humanScore: number,
  successRate: number,
  totalTransactions: number,
  successfulTransactions: number,
  failedTransactions: number,
  aiAnalysis?: string
) {
  // Ensure user exists
  await getOrCreateUser(walletAddress)

  return await prisma.analysisResult.create({
    data: {
      walletAddress,
      humanScore,
      successRate,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      aiAnalysis,
    },
  })
}

/**
 * Get latest analysis result for a wallet
 */
export async function getLatestAnalysisResult(walletAddress: string) {
  return await prisma.analysisResult.findFirst({
    where: { walletAddress },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get all analysis results for a wallet
 */
export async function getAllAnalysisResults(walletAddress: string) {
  return await prisma.analysisResult.findMany({
    where: { walletAddress },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get analysis results by human score range
 */
export async function getAnalysisResultsByScoreRange(minScore: number, maxScore: number) {
  return await prisma.analysisResult.findMany({
    where: {
      humanScore: {
        gte: minScore,
        lte: maxScore,
      },
    },
    orderBy: { humanScore: 'desc' },
  })
}
