import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import { ReclaimProofRequest, verifyProof } from '@reclaimprotocol/js-sdk';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store sessions in memory (in production, use Redis or database)
const sessions = new Map();

// ============================================
// BINANCE API HELPER FUNCTIONS (OPTIONAL)
// ============================================
// NOTE: Binance API credentials are OPTIONAL and only needed for direct API testing
// Reclaim Protocol will fetch KYC data through user's browser, not through API

/**
 * Generate Binance API signature
 */
function generateBinanceSignature(queryString, secretKey) {
  if (!secretKey) {
    throw new Error('BINANCE_SECRET_KEY is not configured');
  }
  return crypto
    .createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex');
}

/**
 * Call Binance API with authentication
 */
async function callBinanceAPI(endpoint, params = {}) {
  if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_SECRET_KEY) {
    throw new Error('Binance API credentials not configured. This is optional - only needed for direct API testing.');
  }

  const timestamp = Date.now();
  const queryParams = new URLSearchParams({
    ...params,
    timestamp,
    recvWindow: 5000
  });

  const signature = generateBinanceSignature(
    queryParams.toString(),
    process.env.BINANCE_SECRET_KEY
  );

  queryParams.append('signature', signature);

  const url = `https://api.binance.com${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      'X-MBX-APIKEY': process.env.BINANCE_API_KEY
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Binance API Error: ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Get user's KYC status from Binance (Direct API - for testing only)
 */
async function getBinanceKYCStatus() {
  try {
    const accountInfo = await callBinanceAPI('/sapi/v1/account/status');
    return accountInfo;
  } catch (error) {
    console.error('Error fetching Binance KYC status:', error);
    throw error;
  }
}

// ============================================
// RECLAIM PROTOCOL ENDPOINTS
// ============================================

/**
 * Endpoint to initiate Reclaim proof request
 * GET /api/reclaim/init
 */
app.get('/api/reclaim/init', async (req, res) => {
  try {
    const { userId, userAddress } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    // Clean APP_SECRET - remove 0x prefix if present
    const appSecret = process.env.RECLAIM_APP_SECRET.startsWith('0x')
      ? process.env.RECLAIM_APP_SECRET.slice(2)
      : process.env.RECLAIM_APP_SECRET;

    // Initialize Reclaim proof request
    const reclaimProofRequest = await ReclaimProofRequest.init(
      process.env.RECLAIM_APP_ID,
      appSecret,
      process.env.RECLAIM_PROVIDER_ID
    );

    // Set callback URL
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    reclaimProofRequest.setAppCallbackUrl(`${baseUrl}/api/reclaim/callback`);

    // Set context with user information
    if (userAddress) {
      reclaimProofRequest.setContext(
        userAddress,
        JSON.stringify({ userId, timestamp: Date.now() })
      );
    }

    // Get the request URL and status URL
    const requestUrl = await reclaimProofRequest.getRequestUrl();
    const statusUrl = reclaimProofRequest.getStatusUrl();
    const sessionId = reclaimProofRequest.getSessionId();

    // Store session info
    sessions.set(sessionId, {
      userId,
      userAddress,
      createdAt: new Date(),
      status: 'PENDING'
    });

    res.json({
      success: true,
      data: {
        requestUrl,
        statusUrl,
        sessionId,
        reclaimProofRequestConfig: reclaimProofRequest.toJsonString()
      }
    });

  } catch (error) {
    console.error('Error initializing Reclaim request:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Callback endpoint to receive proofs from Reclaim
 * POST /api/reclaim/callback
 */
app.post('/api/reclaim/callback', async (req, res) => {
  try {
    console.log('Received callback from Reclaim Protocol');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);

    // Handle different body formats
    let proofs;

    if (typeof req.body === 'string') {
      // If body is a string, try to decode and parse
      const decodedBody = decodeURIComponent(req.body);
      proofs = JSON.parse(decodedBody);
    } else if (Array.isArray(req.body)) {
      // If body is already an array
      proofs = req.body;
    } else if (req.body && typeof req.body === 'object') {
      // If body is an object, check for common structures
      if (req.body.proofs) {
        proofs = req.body.proofs;
      } else if (req.body.session) {
        // Handle session update format
        console.log('Session update received:', req.body);
        const { sessionId, status } = req.body;

        if (sessions.has(sessionId)) {
          const session = sessions.get(sessionId);
          session.status = status === 'PROOF_GENERATION_SUCCESS' ? 'PENDING' : status;
          session.updatedAt = new Date();
          sessions.set(sessionId, session);

          console.log(`Session ${sessionId} updated to status: ${status}`);
        }

        return res.json({ success: true, message: 'Session updated' });
      } else {
        // Treat the whole body as a single proof
        proofs = [req.body];
      }
    } else {
      console.error('Invalid body format:', req.body);
      return res.status(400).json({
        success: false,
        error: 'Invalid request body format'
      });
    }

    // if (!proofs || proofs.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'No proofs provided'
    //   });
    // }

    // Verify each proof
    const verifiedProofs = [];

    for (const proof of proofs) {
      try {
        // Verify the proof
        const isValid = await verifyProof(proof);

        if (isValid) {
          // Parse context to get user info
          const context = JSON.parse(proof.claimData.context);
          const { contextAddress, contextMessage, extractedParameters } = context;

          // Extract KYC data from Binance
          // Based on provider config: kycStatus, firstName, lastName, dob
          const kycData = {
            kycStatus: extractedParameters.kycStatus || extractedParameters.KYC_status,
            firstName: extractedParameters.firstName || extractedParameters.Name,
            lastName: extractedParameters.lastName || extractedParameters.Surname,
            dob: extractedParameters.dob || extractedParameters.DOB,
            verified: (extractedParameters.kycStatus === 'PASS' ||
                      extractedParameters.kycStatus === 'Verified' ||
                      extractedParameters.KYC_status === 'Verified')
          };

          verifiedProofs.push({
            valid: true,
            contextAddress,
            contextMessage: contextMessage ? JSON.parse(contextMessage) : null,
            kycData,
            proof
          });

          // Update session status if we have the session ID
          const sessionId = proof.identifier;
          if (sessions.has(sessionId)) {
            const session = sessions.get(sessionId);
            session.status = 'VERIFIED';
            session.kycData = kycData;
            session.verifiedAt = new Date();
            sessions.set(sessionId, session);
          }

          console.log('Proof verified successfully:', {
            address: contextAddress,
            kycStatus: kycData.kycStatus
          });
        } else {
          verifiedProofs.push({
            valid: false,
            error: 'Proof verification failed'
          });
        }
      } catch (error) {
        console.error('Error verifying individual proof:', error);
        verifiedProofs.push({
          valid: false,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      verifiedProofs
    });

  } catch (error) {
    console.error('Error processing callback:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Check session status
 * GET /api/reclaim/status/:sessionId
 */
app.get('/api/reclaim/status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      session
    });

  } catch (error) {
    console.error('Error fetching session status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Verify user's KYC status from stored proof
 * GET /api/verify-kyc/:userId
 */
app.get('/api/verify-kyc/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find session by userId
    let userSession = null;
    for (const [sessionId, session] of sessions.entries()) {
      if (session.userId === userId) {
        userSession = { sessionId, ...session };
        break;
      }
    }

    if (!userSession) {
      return res.status(404).json({
        success: false,
        error: 'No KYC verification found for this user'
      });
    }

    if (userSession.status !== 'VERIFIED') {
      return res.json({
        success: true,
        verified: false,
        status: userSession.status,
        message: 'KYC verification is pending or incomplete'
      });
    }

    res.json({
      success: true,
      verified: userSession.kycData.verified,
      kycData: userSession.kycData,
      verifiedAt: userSession.verifiedAt
    });

  } catch (error) {
    console.error('Error verifying KYC:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get Binance account KYC status (direct API call - for testing)
 * GET /api/binance/kyc-status
 */
app.get('/api/binance/kyc-status', async (_req, res) => {
  try {
    const kycStatus = await getBinanceKYCStatus();

    res.json({
      success: true,
      data: kycStatus
    });

  } catch (error) {
    console.error('Error fetching Binance KYC:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Reclaim Protocol + Binance KYC Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Reclaim init: http://localhost:${PORT}/api/reclaim/init?userId=<USER_ID>`);
  console.log(`\n✅ Reclaim Protocol configured with:`);
  console.log(`   - App ID: ${process.env.RECLAIM_APP_ID}`);
  console.log(`   - Provider ID: ${process.env.RECLAIM_PROVIDER_ID}`);
  console.log(`\n🔑 Binance API configured\n`);
});

export default app;