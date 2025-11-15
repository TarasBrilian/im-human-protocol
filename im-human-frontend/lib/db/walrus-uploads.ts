import { prisma } from '../prisma'
import { getOrCreateUser, updateUserCompletionFlags } from './users'

/**
 * Save Walrus upload record (prevents duplicates)
 */
export async function saveWalrusUpload(
  walletAddress: string,
  blobId: string,
  encryptedDataMeta?: any
) {
  // Ensure user exists
  await getOrCreateUser(walletAddress)

  const upload = await prisma.walrusUpload.upsert({
    where: { walletAddress },
    update: {
      blobId,
      encryptedData: encryptedDataMeta,
      uploadedAt: new Date(),
    },
    create: {
      walletAddress,
      blobId,
      encryptedData: encryptedDataMeta,
    },
  })

  // Update user completion flag
  await updateUserCompletionFlags(walletAddress, {
    hasUploadedToWalrus: true,
  })

  return upload
}

/**
 * Get Walrus upload for a wallet
 */
export async function getWalrusUpload(walletAddress: string) {
  return await prisma.walrusUpload.findUnique({
    where: { walletAddress },
  })
}

/**
 * Get Walrus upload by blob ID
 */
export async function getWalrusUploadByBlobId(blobId: string) {
  return await prisma.walrusUpload.findUnique({
    where: { blobId },
  })
}

/**
 * Check if wallet has uploaded to Walrus
 */
export async function hasWalrusUpload(walletAddress: string): Promise<boolean> {
  const upload = await getWalrusUpload(walletAddress)
  return upload !== null
}

/**
 * Get all Walrus uploads (for admin/stats)
 */
export async function getAllWalrusUploads(limit: number = 100) {
  return await prisma.walrusUpload.findMany({
    orderBy: { uploadedAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          walletAddress: true,
          hasCompletedVerification: true,
          hasCompletedAnalysis: true,
        },
      },
    },
  })
}

/**
 * Delete Walrus upload (if needed for re-upload)
 */
export async function deleteWalrusUpload(walletAddress: string) {
  const deleted = await prisma.walrusUpload.delete({
    where: { walletAddress },
  })

  // Update user flag
  await updateUserCompletionFlags(walletAddress, {
    hasUploadedToWalrus: false,
  })

  return deleted
}
