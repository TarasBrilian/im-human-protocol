import { prisma } from '../prisma'
import { getOrCreateUser, updateUserCompletionFlags } from './users'

/**
 * Save CEX verification data
 */
export async function saveVerification(
  walletAddress: string,
  cexType: string,
  userId: string,
  proofs: any[],
  sessionId?: string
) {
  // Ensure user exists
  await getOrCreateUser(walletAddress)

  const verification = await prisma.verification.upsert({
    where: {
      userWalletAddress_cexType: {
        userWalletAddress: walletAddress,
        cexType,
      },
    },
    update: {
      proofs,
      verified: true,
      sessionId,
      timestamp: new Date(),
    },
    create: {
      cexType,
      userId,
      proofs,
      verified: true,
      sessionId,
      userWalletAddress: walletAddress,
    },
  })

  // Update user completion flag
  await updateUserCompletionFlags(walletAddress, {
    hasCompletedVerification: true,
  })

  return verification
}

/**
 * Get verification for a specific CEX
 */
export async function getVerificationByCex(walletAddress: string, cexType: string) {
  return await prisma.verification.findUnique({
    where: {
      userWalletAddress_cexType: {
        userWalletAddress: walletAddress,
        cexType,
      },
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
 * Get all verifications for a wallet
 */
export async function getAllVerifications(walletAddress: string) {
  return await prisma.verification.findMany({
    where: { userWalletAddress: walletAddress },
    orderBy: { timestamp: 'desc' },
  })
}

/**
 * Check if wallet has verification for specific CEX
 */
export async function hasVerificationForCex(
  walletAddress: string,
  cexType: string
): Promise<boolean> {
  const verification = await getVerificationByCex(walletAddress, cexType)
  return verification !== null && verification.verified
}

/**
 * Check if wallet has any verification
 */
export async function hasVerification(walletAddress: string): Promise<boolean> {
  const verification = await getLatestVerification(walletAddress)
  return verification !== null && verification.verified
}
