import { NextRequest, NextResponse } from 'next/server'
import {
  saveWalrusUpload,
  getWalrusUpload,
  getWalrusUploadByBlobId,
  canUserPerformAction,
} from '@/lib/db'

/**
 * POST /api/db/walrus
 * Save Walrus upload to database (alongside localStorage)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, blobId, encryptedDataMeta } = body

    if (!walletAddress || !blobId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user can upload (prevent duplicate)
    const canUpload = await canUserPerformAction(walletAddress, 'walrus')
    if (!canUpload) {
      return NextResponse.json(
        {
          error: 'User has already uploaded to Walrus',
          canProceed: false,
        },
        { status: 409 }
      )
    }

    // Save to database
    const upload = await saveWalrusUpload(
      walletAddress,
      blobId,
      encryptedDataMeta
    )

    return NextResponse.json({
      success: true,
      data: upload,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save Walrus upload' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/db/walrus?walletAddress=xxx
 * or GET /api/db/walrus?blobId=xxx
 * Get Walrus upload from database
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    const blobId = searchParams.get('blobId')

    if (!walletAddress && !blobId) {
      return NextResponse.json(
        { error: 'walletAddress or blobId is required' },
        { status: 400 }
      )
    }

    // Get Walrus upload by wallet or blob ID
    const data = walletAddress
      ? await getWalrusUpload(walletAddress)
      : await getWalrusUploadByBlobId(blobId!)

    return NextResponse.json({
      success: true,
      data,
      hasUpload: data !== null,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get Walrus upload' },
      { status: 500 }
    )
  }
}
