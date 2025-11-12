"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  getVerification,
  bindAddress,
  isAddressBound,
} from "../../lib/verification-storage";

export default function OnchainVerifyPage() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const router = useRouter();
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isBound, setIsBound] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [bindError, setBindError] = useState<string | null>(null);
  const [isStoringProof, setIsStoringProof] = useState(false);
  const [proofStored, setProofStored] = useState(false);

  // Check verification status and address binding
  useEffect(() => {
    const verification = getVerification();
    setVerificationData(verification);

    if (currentAccount?.address) {
      const bound = isAddressBound(currentAccount.address);
      setIsBound(bound);
    } else {
      setIsBound(false);
    }
  }, [currentAccount]);

  const handleBindAddress = async () => {
    if (!currentAccount?.address || !verificationData) return;

    setIsBinding(true);
    setBindError(null);

    try {
      // Create message to sign
      const message = `Bind wallet address to Im Human verification\n\nAddress: ${currentAccount.address}\nUser ID: ${verificationData.userId}\nTimestamp: ${Date.now()}`;

      // Request signature from wallet
      const messageBytes = new TextEncoder().encode(message);
      const { signature } = await signPersonalMessage({
        message: messageBytes,
      });

      // Verify signature was provided
      if (!signature) {
        throw new Error("Signature not provided");
      }

      // Here you would typically send the signature to your backend for verification
      // For now, we'll simulate the process
      console.log("Message signed successfully:", {
        message,
        signature,
        address: currentAccount.address,
      });

      // Simulate API call to bind address with signature
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save binding with signature proof
      bindAddress(
        currentAccount.address,
        verificationData.userId,
        signature,
        message
      );
      setIsBound(true);
      setIsBinding(false);
    } catch (error: any) {
      console.error("Error binding address:", error);
      setBindError(error.message || "Failed to sign message. Please try again.");
      setIsBinding(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // TODO: Add your onchain analysis logic here
    console.log("Analyzing address:", currentAccount?.address);

    // Simulate API call and score calculation
    setTimeout(() => {
      // Mock human score between 0-100
      const mockScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      setHumanScore(mockScore);
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const handleStoreProof = async () => {
    if (!currentAccount?.address || !humanScore) return;

    setIsStoringProof(true);

    try {
      // Create proof data to store onchain
      const proofData = {
        address: currentAccount.address,
        userId: verificationData.userId,
        humanScore: humanScore,
        timestamp: Date.now(),
      };

      // Request signature for the proof
      const message = `Store Human Verification Proof\n\nAddress: ${currentAccount.address}\nUser ID: ${verificationData.userId}\nHuman Score: ${humanScore}\nTimestamp: ${Date.now()}`;

      const messageBytes = new TextEncoder().encode(message);
      const { signature } = await signPersonalMessage({
        message: messageBytes,
      });

      if (!signature) {
        throw new Error("Signature not provided");
      }

      console.log("Storing proof onchain:", {
        proofData,
        signature,
      });

      // TODO: Here you would call your smart contract to store the proof
      // Example: await contract.storeProof(proofData, signature);

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProofStored(true);
      setIsStoringProof(false);

      alert("Proof stored successfully onchain!");
    } catch (error: any) {
      console.error("Error storing proof:", error);
      alert(error.message || "Failed to store proof. Please try again.");
      setIsStoringProof(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#00fff5]";
    if (score >= 60) return "text-[#ff00e5]";
    return "text-[#ff00e5]";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "border-[#00fff5]/50 bg-black/50 glow-border";
    if (score >= 60) return "border-[#ff00e5]/50 bg-black/50 glow-border-pink";
    return "border-[#ff00e5]/50 bg-black/50 glow-border-pink";
  };

  const displayAddress = currentAccount?.address || "Not connected";
  const hasVerification = verificationData !== null;
  const canBind = currentAccount && hasVerification && !isBound;
  const canAnalyze = currentAccount && isBound;

  return (
    <>
      <Navbar />

      {/* Scanline effect */}
      <div className="scanline" />

      {/* Matrix rain background */}
      <div className="matrix-rain" />

      <div className="flex min-h-screen items-center justify-center bg-black px-4 pt-16 relative">
        <div className="w-full max-w-2xl space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b600ff] via-[#00fff5] to-[#ff00e5] opacity-20 blur-xl absolute top-0 left-0 animate-pulse"></div>
                <svg className="w-16 h-16 relative z-10" fill="none" viewBox="0 0 24 24" stroke="#b600ff" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 gradient-text">
              Onchain Verification
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Analyze your wallet activity to verify <span className="text-[#b600ff]">human behavior</span>
            </p>
          </div>

          <div className="holographic rounded-2xl px-8 py-10 shadow-2xl">
            <div className="space-y-6">
              {/* Connected Address Section */}
              <div>
                <label className="block text-sm font-semibold text-[#00fff5] mb-2 uppercase tracking-wide">
                  Connected Address
                </label>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-[#00fff5]/30 bg-black/50 px-4 py-3">
                  <code className="text-sm font-mono text-white">
                    {displayAddress}
                  </code>
                  {currentAccount && (
                    <button
                      onClick={() => navigator.clipboard.writeText(displayAddress)}
                      className="ml-2 rounded-md p-1 text-[#00fff5] hover:bg-[#00fff5]/10 transition-colors"
                      title="Copy address"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-sm font-semibold text-[#b600ff] mb-2 uppercase tracking-wide">
                  CEX Verification Status
                </label>
                <div className={`mt-2 rounded-lg border px-4 py-3 ${
                  hasVerification
                    ? "border-[#00fff5]/50 bg-black/50 glow-border"
                    : "border-gray-600/30 bg-black/30"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {hasVerification ? (
                        <span className="text-[#00fff5] flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse"></div>
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Verified</span>
                      )}
                    </span>
                    {!hasVerification && (
                      <button
                        onClick={() => router.push('/cex-verify')}
                        className="text-sm text-[#00fff5] hover:text-[#b600ff] transition-colors font-semibold"
                      >
                        Verify Now →
                      </button>
                    )}
                  </div>
                  {hasVerification && verificationData && (
                    <div className="mt-2 text-xs text-gray-400 font-mono">
                      User ID: <span className="text-white">{verificationData.userId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Binding Status */}
              <div>
                <label className="block text-sm font-semibold text-[#ff00e5] mb-2 uppercase tracking-wide">
                  Address Binding Status
                </label>
                <div className={`mt-2 rounded-lg border px-4 py-3 ${
                  isBound
                    ? "border-[#00fff5]/50 bg-black/50 glow-border"
                    : "border-gray-600/30 bg-black/30"
                }`}>
                  <span className="text-sm font-medium">
                    {isBound ? (
                      <span className="text-[#00fff5] flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse"></div>
                        Address Bound
                      </span>
                    ) : (
                      <span className="text-gray-400">Not Bound</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Bind Address Button */}
              {canBind && (
                <>
                  <button
                    onClick={handleBindAddress}
                    disabled={isBinding}
                    className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#00fff5] px-4 py-3 text-sm font-bold text-[#00fff5] hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isBinding && (
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      )}
                      {isBinding ? "Sign & Bind Address..." : "Sign & Bind Address"}
                    </span>
                    <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>

                  {/* Binding Error */}
                  {bindError && (
                    <div className="rounded-lg border border-[#ff00e5]/30 bg-black/30 p-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-[#ff00e5] rounded-full animate-pulse mt-1"></div>
                        <div className="flex-1">
                          <p className="text-sm text-[#ff00e5]">
                            {bindError}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Binding Info */}
                  <div className="rounded-lg glow-border p-4 bg-black/30">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-[#00fff5]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">
                          You will be asked to sign a message with your wallet to prove ownership of this address. This signature will bind your wallet to your verified CEX account.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Human Score Section */}
              <div>
                <label className="block text-sm font-semibold text-[#b600ff] mb-2 uppercase tracking-wide">
                  Human Score
                </label>
                <div
                  className={`mt-2 rounded-lg border px-4 py-6 text-center ${
                    humanScore !== null
                      ? `${getScoreBgColor(humanScore)}`
                      : "border-gray-600/30 bg-black/30"
                  }`}
                >
                  {humanScore !== null ? (
                    <div className="space-y-2">
                      <div
                        className={`text-5xl font-bold ${getScoreColor(
                          humanScore
                        )}`}
                      >
                        {humanScore}
                        <span className="text-2xl">/100</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {humanScore >= 80
                          ? "High confidence - Likely human behavior"
                          : humanScore >= 60
                          ? "Medium confidence - Review recommended"
                          : "Low confidence - Suspicious activity detected"}
                      </p>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <svg
                        className="mx-auto h-12 w-12 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-sm">
                        Click &quot;Analyze&quot; to calculate your human score
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Details (shown after analysis) */}
              {isAnalyzed && humanScore !== null && (
                <div className="rounded-lg glow-border p-4 bg-black/30">
                  <h3 className="text-sm font-bold text-[#00fff5] mb-3 uppercase tracking-wide">
                    Analysis Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Transaction Pattern
                      </span>
                      <span className="font-medium text-white">
                        Natural
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Activity Consistency
                      </span>
                      <span className="font-medium text-white">
                        High
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Bot Likelihood
                      </span>
                      <span className="font-medium text-white">
                        Low
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Network Activity
                      </span>
                      <span className="font-medium text-white">
                        Sui {'=>'} Walrus
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Analyze Button - Only show if not yet analyzed or if proof is already stored */}
              {(!isAnalyzed || proofStored) && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !canAnalyze}
                  className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#b600ff] px-4 py-3 text-sm font-bold text-[#b600ff] hover:shadow-[0_0_30px_rgba(182,0,255,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isAnalyzing && (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {isAnalyzing ? "Analyzing..." : !currentAccount ? "Connect Wallet to Analyze" : !hasVerification ? "Complete CEX Verification First" : !isBound ? "Bind Address to Analyze" : proofStored ? "Re-analyze" : "Analyze"}
                  </span>
                  <div className="absolute inset-0 bg-[#b600ff] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              )}

              {/* Store Proof Button - Show after analysis is complete and proof not yet stored */}
              {isAnalyzed && !proofStored && (
                <button
                  onClick={handleStoreProof}
                  disabled={isStoringProof}
                  className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#00fff5] px-4 py-3 text-sm font-bold text-[#00fff5] hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isStoringProof && (
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    )}
                    {isStoringProof ? "Storing Proof Onchain..." : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.959 11.959 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                        Store Proof Onchain
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              )}

              {/* Success message after proof is stored */}
              {proofStored && (
                <div className="rounded-lg glow-border p-4 bg-black/30">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse mt-1"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">
                        <strong className="text-[#00fff5]">Success!</strong> Your human verification proof has been stored onchain and is now publicly verifiable.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Helper Messages */}
              {!currentAccount && (
                <div className="rounded-lg border border-[#ff00e5]/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-[#ff00e5]">Step 1:</strong> Please connect your Sui wallet to continue
                  </p>
                </div>
              )}

              {currentAccount && !hasVerification && (
                <div className="rounded-lg border border-[#ff00e5]/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-[#ff00e5]">Step 2:</strong> Complete CEX verification first before binding your address
                  </p>
                </div>
              )}

              {currentAccount && hasVerification && !isBound && (
                <div className="rounded-lg border border-[#ff00e5]/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-[#ff00e5]">Step 3:</strong> Bind your wallet address to your CEX verification to continue
                  </p>
                </div>
              )}

              {/* Info Section */}
              <div className="rounded-lg glow-border p-4 bg-black/30">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-[#00fff5]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">
                      The human score is calculated based on your onchain
                      activity patterns, transaction history, and behavioral
                      analysis. Higher scores indicate more human-like behavior.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm font-semibold text-[#b600ff] hover:text-[#00fff5] transition-colors uppercase tracking-wide"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
