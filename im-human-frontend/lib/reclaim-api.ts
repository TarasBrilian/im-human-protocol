import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_RECLAIM_API_URL;

export interface ReclaimInitResponse {
  success: boolean;
  data?: {
    requestUrl: string;
    statusUrl: string;
    sessionId: string;
    proofRequest: string;
  };
  error?: string;
}

export interface SessionStatus {
  success: boolean;
  session?: {
    userId: string;
    userAddress?: string;
    createdAt: string;
    status: 'PENDING' | 'VERIFIED' | 'FAILED';
    kycData?: {
      kycStatus: string;
      firstName: string;
      lastName: string;
      dob: string;
      verified: boolean;
    };
    verifiedAt?: string;
  };
  error?: string;
}

export interface KYCVerificationResponse {
  success: boolean;
  verified?: boolean;
  kycData?: {
    kycStatus: string;
    firstName: string;
    lastName: string;
    dob: string;
    verified: boolean;
  };
  verifiedAt?: string;
  status?: string;
  message?: string;
  error?: string;
}

/**
 * Initialize Reclaim proof request
 */
export async function initReclaimVerification(userId: string, userAddress?: string): Promise<ReclaimInitResponse> {
  try {
    const params = new URLSearchParams({ userId });
    if (userAddress) {
      params.append('userAddress', userAddress);
    }

    const response = await axios.get(`${API_BASE_URL}/api/reclaim/init?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error initializing Reclaim verification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initialize verification'
    };
  }
}

/**
 * Check session status
 */
export async function checkSessionStatus(sessionId: string): Promise<SessionStatus> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/reclaim/status/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking session status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check status'
    };
  }
}

/**
 * Verify user KYC status
 */
export async function verifyUserKYC(userId: string): Promise<KYCVerificationResponse> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/verify-kyc/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error verifying user KYC:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify KYC'
    };
  }
}

/**
 * Poll session status until verified or timeout
 */
export async function pollSessionStatus(
  sessionId: string,
  onStatusChange: (status: SessionStatus) => void,
  intervalMs: number = 3000,
  timeoutMs: number = 300000
): Promise<void> {
  console.log(`🔄 pollSessionStatus started for session: ${sessionId}`);
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  console.log(`⏱️  Polling interval: ${intervalMs}ms, Timeout: ${timeoutMs}ms`);

  const startTime = Date.now();
  let pollCount = 0;

  const poll = async () => {
    pollCount++;
    const elapsedTime = Date.now() - startTime;

    console.log(`\n🔍 Poll #${pollCount} - Elapsed: ${Math.round(elapsedTime / 1000)}s`);
    console.log(`📞 Checking status for session: ${sessionId}`);

    try {
      const status = await checkSessionStatus(sessionId);
      console.log(`📊 Response received:`, JSON.stringify(status, null, 2));

      onStatusChange(status);

      if (status.session?.status === 'VERIFIED' || status.session?.status === 'FAILED') {
        console.log(`✅ Polling stopped - Final status: ${status.session?.status}`);
        return;
      }

      if (Date.now() - startTime > timeoutMs) {
        console.log(`⏰ Polling timeout reached after ${Math.round(elapsedTime / 1000)}s`);
        onStatusChange({
          success: false,
          error: 'Verification timeout'
        });
        return;
      }

      console.log(`⏳ Status still ${status.session?.status || 'UNKNOWN'}, polling again in ${intervalMs}ms...`);
      setTimeout(poll, intervalMs);
    } catch (error) {
      console.error(`❌ Error during polling:`, error);
      onStatusChange({
        success: false,
        error: error instanceof Error ? error.message : 'Polling error'
      });
    }
  };

  await poll();
}