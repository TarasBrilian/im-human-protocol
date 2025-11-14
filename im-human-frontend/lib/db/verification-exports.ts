import { prisma } from '../prisma'

/**
 * Save verification export data
 */
export async function saveVerificationExport(
  walletAddress: string,
  exportData: any
) {
  return await prisma.verificationExport.create({
    data: {
      walletAddress,
      exportData,
    },
  })
}

/**
 * Get latest export for a wallet
 */
export async function getLatestExport(walletAddress: string) {
  return await prisma.verificationExport.findFirst({
    where: { walletAddress },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get all exports for a wallet
 */
export async function getAllExports(walletAddress: string) {
  return await prisma.verificationExport.findMany({
    where: { walletAddress },
    orderBy: { createdAt: 'desc' },
  })
}
