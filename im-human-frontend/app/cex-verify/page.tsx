"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../components/Navbar";
import { useReclaim } from "../../hooks/useReclaim";
import { saveVerification } from "../../lib/verification-storage";

type VerificationStep = "input" | "qr" | "success" | "error";

export default function CexVerifyPage() {
  const [userId, setUserId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [step, setStep] = useState<VerificationStep>("input");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    proofs,
    isLoading,
    error,
    requestUrl,
    startVerification,
    reset
  } = useReclaim();

  // Watch for proofs changes from useReclaim hook
  useEffect(() => {
    if (proofs) {
      // Save verification to local storage
      saveVerification(userId, proofs);
      setStep("success");
      setShowSuccessModal(true);
    }
  }, [proofs, userId]);

  // Watch for error changes
  useEffect(() => {
    if (error && !isLoading) {
      setStep("error");
    }
  }, [error, isLoading]);

  // Watch for requestUrl changes
  useEffect(() => {
    if (requestUrl && !error) {
      setStep("qr");
    }
  }, [requestUrl, error]);

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    await startVerification(userId, walletAddress || undefined);
  };

  const handleReset = () => {
    setStep("input");
    setUserId("");
    setWalletAddress("");
    setShowSuccessModal(false);
    reset();
  };

  const openVerificationUrl = () => {
    if (requestUrl) {
      window.open(requestUrl, "_blank");
    }
  };

  return (
    <>
      <Navbar />

      {/* Scanline effect */}
      <div className="scanline" />

      {/* Matrix rain background */}
      <div className="matrix-rain" />

      {/* Success Modal Pop-up */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="holographic rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in border-2 border-[#00fff5]/30">
            <div className="text-center">
              {/* Success Icon with Animation */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00fff5] bg-black/50 mb-6 animate-pulse-glow">
                <svg
                  className="h-12 w-12 text-[#00fff5]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h2 className="text-3xl font-bold text-white mb-3 gradient-text">
                Verification Successful!
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Your identity has been successfully verified
              </p>

              {/* KYC Data Display */}
              {proofs && proofs[0] && (
                <div className="glow-border rounded-lg p-4 mb-6 text-left bg-black/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Proof ID:</span>
                      <span className="font-medium text-[#00fff5] text-xs truncate max-w-[200px] font-mono">
                        {proofs[0].identifier}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className="font-bold text-[#00fff5] flex items-center gap-1">
                        <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse"></div>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/onchain-verify'}
                  className="group relative w-full px-6 py-3 bg-transparent border-2 border-[#00fff5] text-[#00fff5] font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] uppercase tracking-wide overflow-hidden"
                >
                  <span className="relative z-10">Bind Wallet Address</span>
                  <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="group relative w-full px-6 py-3 border-2 border-gray-500 text-gray-300 font-semibold rounded-lg transition-all duration-300 hover:border-gray-400 hover:text-white uppercase tracking-wide overflow-hidden"
                >
                  <span className="relative z-10">Close</span>
                  <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center bg-black px-4 pt-16 relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00fff5] via-[#b600ff] to-[#ff00e5] opacity-20 blur-xl absolute top-0 left-0 animate-pulse"></div>
                <svg className="w-16 h-16 relative z-10" fill="none" viewBox="0 0 24 24" stroke="#00fff5" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 gradient-text">
              Binance KYC Verification
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Verify your identity using <span className="text-[#00fff5]">Reclaim Protocol</span>
            </p>
          </div>

          <div className="holographic rounded-2xl px-8 py-10 shadow-2xl">
            {/* Step 1: Input User ID */}
            {step === "input" && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse"></div>
                    Start Verification
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Enter your information to begin
                  </p>
                </div>

                <form onSubmit={handleStartVerification} className="space-y-6">
                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm font-semibold text-[#00fff5] mb-2 uppercase tracking-wide"
                    >
                      User ID <span className="text-[#ff00e5]">*</span>
                    </label>
                    <input
                      id="userId"
                      name="userId"
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="block w-full rounded-lg border border-[#00fff5]/30 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#00fff5] focus:outline-none focus:ring-1 focus:ring-[#00fff5] transition-all font-mono"
                      placeholder="Enter your unique user ID"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wallet"
                      className="block text-sm font-semibold text-[#b600ff] mb-2 uppercase tracking-wide"
                    >
                      Wallet Address (Optional)
                    </label>
                    <input
                      id="wallet"
                      name="wallet"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="block w-full rounded-lg border border-[#b600ff]/30 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-[#b600ff] focus:outline-none focus:ring-1 focus:ring-[#b600ff] transition-all font-mono"
                      placeholder="0x..."
                    />
                  </div>

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
                          Reclaim Protocol uses <span className="text-[#00fff5] font-bold">zero-knowledge proofs</span> to verify
                          your Binance KYC without exposing your credentials.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#00fff5] px-4 py-3 text-sm font-bold text-[#00fff5] hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00fff5] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 uppercase tracking-wider overflow-hidden transition-all duration-300"
                  >
                    <span className="relative z-10">{isLoading ? "Initializing..." : "Start Verification"}</span>
                    <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>
                </form>
              </>
            )}

            {/* Step 2: QR Code Display */}
            {step === "qr" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#b600ff] rounded-full animate-pulse"></div>
                    Scan QR Code
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Scan with your mobile device or click to open
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="glow-border bg-white p-4 rounded-lg animate-pulse-glow">
                    <QRCodeSVG value={requestUrl} size={256} />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={openVerificationUrl}
                    className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#00fff5] px-4 py-3 text-sm font-bold text-[#00fff5] hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300"
                  >
                    <span className="relative z-10">Open Verification Page</span>
                    <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>

                  <button
                    onClick={handleReset}
                    className="group relative flex w-full justify-center rounded-lg border-2 border-gray-500 px-4 py-3 text-sm font-semibold text-gray-300 hover:border-gray-400 hover:text-white uppercase tracking-wide overflow-hidden transition-all duration-300"
                  >
                    <span className="relative z-10">Cancel</span>
                    <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>
                </div>

                <div className="mt-6 rounded-lg border border-[#ff00e5]/30 bg-black/30 p-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-[#ff00e5] rounded-full animate-pulse mt-1"></div>
                    <p className="text-sm text-gray-300">
                      Waiting for verification... This page will update
                      automatically once completed.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Success */}
            {step === "success" && proofs && (
              <>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00fff5] bg-black/50 animate-pulse-glow">
                    <svg
                      className="h-8 w-8 text-[#00fff5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-white gradient-text">
                    Verification Successful!
                  </h2>
                  <p className="mt-2 text-sm text-gray-300">
                    Your Binance KYC has been verified
                  </p>
                </div>

                <div className="mt-6 space-y-3 rounded-lg glow-border p-4 bg-black/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Proof ID:
                    </span>
                    <span className="font-medium text-[#00fff5] text-xs truncate font-mono">
                      {proofs[0]?.identifier?.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Provider:
                    </span>
                    <span className="font-medium text-white">
                      {proofs[0]?.provider || 'Binance'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Status:
                    </span>
                    <span className="font-bold text-[#00fff5] flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse"></div>
                      Verified
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="group relative mt-6 flex w-full justify-center rounded-lg bg-transparent border-2 border-[#00fff5] px-4 py-3 text-sm font-bold text-[#00fff5] hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] uppercase tracking-wider overflow-hidden transition-all duration-300"
                >
                  <span className="relative z-10">Verify Another Account</span>
                  <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </>
            )}

            {/* Step 4: Error */}
            {step === "error" && (
              <>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#ff00e5] bg-black/50">
                    <svg
                      className="h-8 w-8 text-[#ff00e5]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-white">
                    Verification Failed
                  </h2>
                  <p className="mt-2 text-sm text-[#ff00e5] border border-[#ff00e5]/30 rounded-lg p-3 bg-black/30">
                    {error || "An error occurred during verification"}
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="group relative mt-6 flex w-full justify-center rounded-lg bg-transparent border-2 border-[#ff00e5] px-4 py-3 text-sm font-bold text-[#ff00e5] hover:shadow-[0_0_30px_rgba(255,0,229,0.5)] uppercase tracking-wider overflow-hidden transition-all duration-300"
                >
                  <span className="relative z-10">Try Again</span>
                  <div className="absolute inset-0 bg-[#ff00e5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00fff5]/30 to-transparent" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-black px-3 text-gray-400 font-mono text-xs">
                    Powered by <span className="text-[#00fff5]">Reclaim Protocol</span>
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="/"
                  className="text-sm font-semibold text-[#00fff5] hover:text-[#b600ff] transition-colors uppercase tracking-wide"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
