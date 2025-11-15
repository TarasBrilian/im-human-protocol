import { prisma } from '../prisma'
import { getOrCreateUser, updateUserCompletionFlags } from './users'

/**
 * Save analysis result (prevents duplicates with upsert)
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

  const result = await prisma.analysisResult.upsert({
    where: { walletAddress },
    update: {
      humanScore,
      successRate,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      aiAnalysis,
      createdAt: new Date(),
    },
    create: {
      walletAddress,
      humanScore,
      successRate,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      aiAnalysis,
    },
  })

  // Update user completion flag
  await updateUserCompletionFlags(walletAddress, {
    hasCompletedAnalysis: true,
  })

  return result
}

/**
 * Get analysis result for a wallet
 */
export async function getAnalysisResult(walletAddress: string) {
  return await prisma.analysisResult.findUnique({
    where: { walletAddress },
  })
}

/**
 * Check if wallet has analysis
 */
export async function hasAnalysisResult(walletAddress: string): Promise<boolean> {
  const result = await getAnalysisResult(walletAddress)
  return result !== null
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

/**
 * Get top human scores
 */
export async function getTopHumanScores(limit: number = 10) {
  return await prisma.analysisResult.findMany({
    orderBy: { humanScore: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          walletAddress: true,
        },
      },
    },
  })
}
