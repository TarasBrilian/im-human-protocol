/**
 * API Client for database operations
 * Replaces localStorage with database persistence
 */

// Verification API
export async function saveVerificationToDb(
  walletAddress: string,
  cexType: string,
  userId: string,
  proofs: any[],
  sessionId?: string
) {
  const response = await fetch('/api/db/verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      cexType,
      userId,
      proofs,
      sessionId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to save verification')
  }

  return response.json()
}

export async function getVerificationFromDb(
  walletAddress: string,
  cexType?: string
) {
  const params = new URLSearchParams({ walletAddress })
  if (cexType) params.append('cexType', cexType)

  const response = await fetch(`/api/db/verification?${params}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get verification')
  }

  return response.json()
}

// Analysis API
export async function saveAnalysisToDb(
  walletAddress: string,
  humanScore: number,
  successRate: number,
  totalTransactions: number,
  successfulTransactions: number,
  failedTransactions: number,
  aiAnalysis?: string
) {
  const response = await fetch('/api/db/analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      humanScore,
      successRate,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      aiAnalysis,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to save analysis')
  }

  return response.json()
}

export async function getAnalysisFromDb(walletAddress: string) {
  const response = await fetch(
    `/api/db/analysis?walletAddress=${walletAddress}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get analysis')
  }

  return response.json()
}

// Walrus Upload API
export async function saveWalrusUploadToDb(
  walletAddress: string,
  blobId: string,
  encryptedDataMeta?: any
) {
  const response = await fetch('/api/db/walrus', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      blobId,
      encryptedDataMeta,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to save Walrus upload')
  }

  return response.json()
}

export async function getWalrusUploadFromDb(
  walletAddress?: string,
  blobId?: string
) {
  const params = new URLSearchParams()
  if (walletAddress) params.append('walletAddress', walletAddress)
  if (blobId) params.append('blobId', blobId)

  const response = await fetch(`/api/db/walrus?${params}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to get Walrus upload')
  }

  return response.json()
}
