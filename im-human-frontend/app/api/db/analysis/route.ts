import { NextRequest, NextResponse } from 'next/server'
import {
  saveAnalysisResult,
  getAnalysisResult,
  canUserPerformAction,
} from '@/lib/db'

/**
 * POST /api/db/analysis
 * Save analysis result to database (alongside localStorage)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      walletAddress,
      humanScore,
      successRate,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      aiAnalysis,
    } = body

    if (
      !walletAddress ||
      humanScore === undefined ||
      successRate === undefined ||
      totalTransactions === undefined ||
      successfulTransactions === undefined ||
      failedTransactions === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user can analyze (prevent duplicate)
    const canAnalyze = await canUserPerformAction(walletAddress, 'analysis')
    if (!canAnalyze) {
      return NextResponse.json(
        {
          error: 'User has already completed analysis',
          canProceed: false,
        },
        { status: 409 }
      )
    }

    // Save to database
    const analysis = await saveAnalysisResult(
      walletAddress,
      humanScore,
      successRate,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      aiAnalysis
    )

    return NextResponse.json({
      success: true,
      data: analysis,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save analysis' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/db/analysis?walletAddress=xxx
 * Get analysis result from database
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 }
      )
    }

    // Get analysis result
    const data = await getAnalysisResult(walletAddress)

    return NextResponse.json({
      success: true,
      data,
      hasAnalysis: data !== null,
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get analysis' },
      { status: 500 }
    )
  }
}
