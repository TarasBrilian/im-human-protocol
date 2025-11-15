import { NextRequest, NextResponse } from 'next/server'
import {
  saveVerification,
  getVerificationByCex,
  getAllVerifications,
  canUserPerformAction,
} from '@/lib/db'

/**
 * POST /api/db/verification
 * Save verification to database (alongside localStorage)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { walletAddress, cexType, userId, proofs, sessionId } = body

    if (!walletAddress || !cexType || !userId || !proofs) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user can verify (prevent duplicate)
    const canVerify = await canUserPerformAction(walletAddress, 'verification')
    if (!canVerify) {
      return NextResponse.json(
        {
          error: 'User has already completed verification',
          canProceed: false,
        },
        { status: 409 }
      )
    }

    // Save to database
    const verification = await saveVerification(
      walletAddress,
      cexType,
      userId,
      proofs,
      sessionId
    )

    return NextResponse.json({
      success: true,
      data: verification,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save verification' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/db/verification?walletAddress=xxx&cexType=yyy
 * Get verification from database
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')
    const cexType = searchParams.get('cexType')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 }
      )
    }

    // Get verification for specific CEX or all verifications
    const data = cexType
      ? await getVerificationByCex(walletAddress, cexType)
      : await getAllVerifications(walletAddress)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get verification' },
      { status: 500 }
    )
  }
}
