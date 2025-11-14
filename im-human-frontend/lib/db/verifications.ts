import { prisma } from '../prisma'
import { getOrCreateUser } from './users'

/**
 * Save CEX verification data
 */
export async function saveVerification(
  walletAddress: string,
  userId: string,
  proofs: any[]
) {
  // Ensure user exists
  await getOrCreateUser(walletAddress)

  return await prisma.verification.create({
    data: {
      userId,
      proofs,
      verified: true,
      userWalletAddress: walletAddress,
    },
  })
}

/**
 * Get latest verification for a wallet
 */
export async function getLatestVerification(walletAddress: string) {
  return await prisma.verification.findFirst({
    where: { userWalletAddress: walletAddress },
    orderBy: { timestamp: 'desc' },
  })
}

/**
 * Check if wallet has verification
 */
export async function hasVerification(walletAddress: string): Promise<boolean> {
  const verification = await getLatestVerification(walletAddress)
  return verification !== null && verification.verified
}
