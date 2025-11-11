"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import {
  initReclaimVerification,
  pollSessionStatus,
  type SessionStatus,
} from "../../lib/reclaim-api";

type VerificationStep = "input" | "qr" | "verifying" | "success" | "error";

export default function CexVerifyPage() {
  const [userId, setUserId] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [step, setStep] = useState<VerificationStep>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [requestUrl, setRequestUrl] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [kycData, setKycData] = useState<any>(null);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const handleStartVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Initialize Reclaim verification
      const response = await initReclaimVerification(
        userId,
        walletAddress || undefined
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to initialize verification");
      }

      console.log("✅ Verification initialized successfully!");
      console.log("Session ID:", response.data.sessionId);
      console.log("Request URL:", response.data.requestUrl);

      setRequestUrl(response.data.requestUrl);
      setSessionId(response.data.sessionId);
      setStep("qr");

      // Start polling for status
      console.log("🔄 Starting to poll session status...");
      pollSessionStatus(
        response.data.sessionId,
        (status: SessionStatus) => {
          console.log("📊 Polling update received:", status);

          if (status.session?.status === "VERIFIED") {
            console.log("✅ Status is VERIFIED! Showing success...");
            setKycData(status.session.kycData);
            setStep("success");
            // Show success toast
            setToastMessage("✅ Verification Successful!");
            setToastType("success");
            setShowToast(true);
          } else if (status.session?.status === "FAILED") {
            console.log("❌ Status is FAILED");
            setError("Verification failed");
            setStep("error");
            // Show error toast
            setToastMessage("❌ Verification Failed");
            setToastType("error");
            setShowToast(true);
          } else if (status.error) {
            console.log("❌ Error received:", status.error);
            setError(status.error);
            setStep("error");
            // Show error toast
            setToastMessage("❌ " + status.error);
            setToastType("error");
            setShowToast(true);
          } else {
            console.log("⏳ Status still pending:", status.session?.status);
          }
        }
      );
    } catch (err) {
      console.error("❌ Error in handleStartVerification:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setUserId("");
    setWalletAddress("");
    setRequestUrl("");
    setSessionId("");
    setKycData(null);
    setError("");
  };

  const openVerificationUrl = () => {
    if (requestUrl) {
      window.open(requestUrl, "_blank");
      setStep("verifying");
    }
  };

  return (
    <>
      <Navbar />

      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
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

            {/* Step 3: Verifying */}
            {step === "verifying" && (
              <>
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <svg
                      className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    Verifying...
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Please complete the verification on your device
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="mt-6 flex w-full justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </>
            )}

            {/* Step 4: Success */}
            {step === "success" && kycData && (
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
                      Name:
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {kycData.firstName} {kycData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Date of Birth:
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {kycData.dob}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      KYC Status:
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {kycData.kycStatus}
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

            {/* Step 5: Error */}
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
