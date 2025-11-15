import { useState, useCallback } from 'react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

export function useReclaim() {
  const [proofs, setProofs] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestUrl, setRequestUrl] = useState<string>("");

  const startVerification = useCallback(async (userId: string, walletAddress?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch config from backend
      const params = new URLSearchParams({ userId });
      if (walletAddress) {
        params.append('userAddress', walletAddress);
      }

      const response = await fetch(`http://localhost:3001/api/reclaim/init?${params.toString()}`);
      const data = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to initialize verification');
      }

      const { reclaimProofRequestConfig } = data.data;

      // Create ReclaimProofRequest from config
      const reclaimProofRequest = await ReclaimProofRequest.fromJsonString(
        reclaimProofRequestConfig
      );

      // Get request URL for QR code
      const url = await reclaimProofRequest.getRequestUrl();
      setRequestUrl(url);

      // Start the session with callbacks
      await reclaimProofRequest.startSession({
        onSuccess: (proofs) => {
          setProofs(proofs);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message || 'Verification failed');
          setIsLoading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setProofs(null);
    setError(null);
    setRequestUrl("");
    setIsLoading(false);
  }, []);

  return {
    proofs,
    isLoading,
    error,
    requestUrl,
    startVerification,
    reset
  };
}
