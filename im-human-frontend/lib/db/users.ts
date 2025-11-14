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
    },
  })
}
