"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../components/Navbar";
import { useReclaim } from "../../hooks/useReclaim";

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
      setStep("success");
      setShowSuccessModal(true);
    }
  }, [proofs]);

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

      {/* Success Modal Pop-up */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center">
              {/* Success Icon with Animation */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-6 animate-bounce">
                <svg
                  className="h-12 w-12 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                Verification Successful!
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                Your identity has been successfully verified
              </p>

              {/* KYC Data Display */}
              {proofs && proofs[0] && (
                <div className="bg-zinc-50 dark:bg-zinc-700 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Proof ID:</span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50 text-xs truncate max-w-[200px]">
                        {proofs[0].identifier}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Status:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 pt-16 dark:bg-zinc-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Binance KYC Verification
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Verify your identity using Reclaim Protocol
            </p>
          </div>

          <div className="rounded-lg bg-white px-8 py-10 shadow-lg dark:bg-zinc-800">
            {/* Step 1: Input User ID */}
            {step === "input" && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Start Verification
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Enter your information to begin
                  </p>
                </div>

                <form onSubmit={handleStartVerification} className="space-y-6">
                  <div>
                    <label
                      htmlFor="userId"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      User ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="userId"
                      name="userId"
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                      placeholder="Enter your unique user ID"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wallet"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Wallet Address (Optional)
                    </label>
                    <input
                      id="wallet"
                      name="wallet"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="mt-2 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                      placeholder="0x..."
                    />
                  </div>

                  <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-400"
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
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Reclaim Protocol uses zero-knowledge proofs to verify
                          your Binance KYC without exposing your credentials.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400"
                  >
                    {isLoading ? "Initializing..." : "Start Verification"}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: QR Code Display */}
            {step === "qr" && (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Scan QR Code
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Scan with your mobile device or click to open
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG value={requestUrl} size={256} />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={openVerificationUrl}
                    className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Open Verification Page
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex w-full justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mt-6 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Waiting for verification... This page will update
                    automatically once completed.
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Success */}
            {step === "success" && proofs && (
              <>
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <svg
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Verification Successful!
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Your Binance KYC has been verified
                  </p>
                </div>

                <div className="mt-6 space-y-3 rounded-md bg-zinc-50 p-4 dark:bg-zinc-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Proof ID:
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 text-xs truncate">
                      {proofs[0]?.identifier?.substring(0, 20)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Provider:
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {proofs[0]?.provider || 'Binance'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Status:
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      Verified
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="mt-6 flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Verify Another Account
                </button>
              </>
            )}

            {/* Step 4: Error */}
            {step === "error" && (
              <>
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                    <svg
                      className="h-6 w-6 text-red-600 dark:text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Verification Failed
                  </h2>
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error || "An error occurred during verification"}
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="mt-6 flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Try Again
                </button>
              </>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-300 dark:border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    Powered by Reclaim Protocol
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <a
                  href="/"
                  className="text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
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
