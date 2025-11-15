import { prisma } from '../prisma'

/**
 * Get or create a user by wallet address
 */
export async function getOrCreateUser(walletAddress: string) {
  return await prisma.user.upsert({
    where: { walletAddress },
    update: {},
    create: { walletAddress },
  })
}

/**
 * Get user with all related data
 */
export async function getUserWithData(walletAddress: string) {
  return await prisma.user.findUnique({
    where: { walletAddress },
    include: {
      verifications: true,
      addressBindings: true,
      analysisResults: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      walrusUploads: {
        orderBy: { uploadedAt: 'desc' },
        take: 1,
      },
    },
  })
}

/**
 * Update user completion flags
 */
export async function updateUserCompletionFlags(
  walletAddress: string,
  flags: {
    hasCompletedVerification?: boolean
    hasCompletedAnalysis?: boolean
    hasUploadedToWalrus?: boolean
  }
) {
  return await prisma.user.update({
    where: { walletAddress },
    data: flags,
  })
}

/**
 * Check if user can perform action (prevent duplicates)
 */
export async function canUserPerformAction(
  walletAddress: string,
  action: 'verification' | 'analysis' | 'walrus'
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
  })

  if (!user) return true // New user can perform any action

  switch (action) {
    case 'verification':
      return !user.hasCompletedVerification
    case 'analysis':
      return !user.hasCompletedAnalysis
    case 'walrus':
      return !user.hasUploadedToWalrus
    default:
      return false
  }
}
