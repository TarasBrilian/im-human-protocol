"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  getVerificationFromDb,
  saveAnalysisToDb,
  saveWalrusUploadToDb,
  getWalrusUploadFromDb,
  getAnalysisFromDb,
} from "../../lib/api/client";
import { analyzeUserTransactions } from "./index";
import type { AnalysisResult } from "./index";
import { encryptWithSeal } from "../../lib/encryption";
import { uploadToWalrus, getWalrusUrl } from "../../lib/walrus";

export default function OnchainVerifyPage() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signPersonalMessage } = useSignPersonalMessage();
  const router = useRouter();

  // State management
  const [verificationData, setVerificationData] = useState<any>(null);
  const [isBound, setIsBound] = useState(false);
  const [isBinding, setIsBinding] = useState(false);
  const [bindError, setBindError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [walrusBlobId, setWalrusBlobId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showAlreadyAnalyzedModal, setShowAlreadyAnalyzedModal] = useState(false);
  const [showAlreadyUploadedModal, setShowAlreadyUploadedModal] = useState(false);
  const [hasExistingUpload, setHasExistingUpload] = useState(false);
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState(false);

  // Check verification status and address binding from database
  useEffect(() => {
    const loadVerification = async () => {
      if (currentAccount?.address) {
        try {
          const response = await getVerificationFromDb(currentAccount.address);
          if (response.data && response.data.length > 0) {
            setVerificationData(response.data[0]);
            setIsBound(true);
          } else {
            setVerificationData(null);
            setIsBound(false);
          }
        } catch (error) {
          setVerificationData(null);
          setIsBound(false);
        }
      } else {
        setVerificationData(null);
        setIsBound(false);
      }
    };

    loadVerification();
  }, [currentAccount]);

  // Check if user already has an analysis result
  useEffect(() => {
    const checkExistingAnalysis = async () => {
      if (currentAccount?.address) {
        try {
          const response = await getAnalysisFromDb(currentAccount.address);
          if (response.data && response.hasAnalysis) {
            setHasExistingAnalysis(true);
            setAnalysisResult(response.data);
          } else {
            setHasExistingAnalysis(false);
          }
        } catch (error) {
          setHasExistingAnalysis(false);
        }
      } else {
        setHasExistingAnalysis(false);
      }
    };

    checkExistingAnalysis();
  }, [currentAccount]);

  // Check if user already has a Walrus upload
  useEffect(() => {
    const checkExistingUpload = async () => {
      if (currentAccount?.address) {
        try {
          const response = await getWalrusUploadFromDb(currentAccount.address);
          if (response.data && response.hasUpload) {
            setHasExistingUpload(true);
            setWalrusBlobId(response.data.blobId);
          } else {
            setHasExistingUpload(false);
          }
        } catch (error) {
          setHasExistingUpload(false);
        }
      } else {
        setHasExistingUpload(false);
      }
    };

    checkExistingUpload();
  }, [currentAccount]);

  // Handle wallet address binding
  const handleBindAddress = async () => {
    if (!currentAccount?.address || !verificationData) return;

    setIsBinding(true);
    setBindError(null);

    try {
      const message = `Bind wallet address to Im Human verification\n\nAddress: ${currentAccount.address}\nSources: ${verificationData.userId}\nTimestamp: ${Date.now()}`;
      const messageBytes = new TextEncoder().encode(message);
      const { signature } = await signPersonalMessage({ message: messageBytes });

      if (!signature) throw new Error("Signature not provided");

      // Note: Address binding is already saved during verification
      // This signature is just for user confirmation
      setIsBound(true);
    } catch (error: any) {
      setBindError(error.message || "Failed to sign message. Please try again.");
    } finally {
      setIsBinding(false);
    }
  };

  // Handle activity analysis
  const handleAnalyze = async () => {
    if (!currentAccount?.address) return;

    // Check if analysis already exists
    if (hasExistingAnalysis) {
      setShowAlreadyAnalyzedModal(true);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Call the main analysis function
      const result = await analyzeUserTransactions(currentAccount.address);

      setAnalysisResult(result);

      // Save analysis result to database
      try {
        await saveAnalysisToDb(
          currentAccount.address,
          result.humanScore,
          result.successRate,
          result.totalTransactions,
          result.successfulTransactions,
          result.failedTransactions,
          result.aiAnalysis || undefined
        );

        setHasExistingAnalysis(true); // Mark as analyzed
      } catch (dbError: any) {
        // Check if it's a duplicate analysis error
        if (dbError.message?.includes('already completed analysis')) {
          setShowAlreadyAnalyzedModal(true);
          setHasExistingAnalysis(true);
        } else {
          // Continue showing results even if save fails
        }
      }
    } catch (error: any) {
      setAnalysisError(error.message || 'Failed to analyze transactions. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle wrapping data to JSON file
  const handleWrapToJson = () => {
    if (!currentAccount?.address || !analysisResult) return;

    try {
      // Gather all user data including ZK proofs and onchain score
      const data = {
        walletAddress: currentAccount.address,
        verification: verificationData,
        addressBinding: {
          address: currentAccount.address,
          userId: verificationData?.userId,
          timestamp: Date.now(),
          bound: true,
        },
        onchainScore: {
          humanScore: analysisResult.humanScore,
          successRate: analysisResult.successRate,
          totalTransactions: analysisResult.totalTransactions,
          successfulTransactions: analysisResult.successfulTransactions,
          failedTransactions: analysisResult.failedTransactions,
          aiAnalysis: analysisResult.aiAnalysis,
        },
        timestamp: Date.now(),
        generatedAt: new Date().toISOString(),
      };

      // Convert to JSON string with formatting
      const jsonString = JSON.stringify(data, null, 2);
      setJsonData(jsonString);

    } catch (error) {
    }
  };

  // Handle uploading to Walrus testnet
  const handleUploadToWalrus = async () => {
    if (!jsonData || !currentAccount?.address) return;

    // Check if user already has an upload
    if (hasExistingUpload) {
      setShowAlreadyUploadedModal(true);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Parse JSON data back to object
      const data = JSON.parse(jsonData);

      // Encrypt data using wallet address as key
      const encryptedData = await encryptWithSeal(data, currentAccount.address);

      // Upload encrypted data to Walrus
      const blobId = await uploadToWalrus(encryptedData);

      setWalrusBlobId(blobId);

      // Save Walrus upload info to database
      try {
        await saveWalrusUploadToDb(
          currentAccount.address,
          blobId,
          {
            encryptedSize: encryptedData.length,
            uploadedAt: new Date().toISOString(),
          }
        );

      } catch (dbError: any) {
        // Check if it's a duplicate upload error
        if (dbError.message?.includes('already uploaded to Walrus')) {
          setShowAlreadyUploadedModal(true);
        } else {
          // Continue showing results even if save fails
        }
      }
    } catch (error: any) {
      setUploadError(error.message || 'Failed to upload to Walrus. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Computed values
  const displayAddress = currentAccount?.address
    ? `${currentAccount.address.slice(0, 8)}...${currentAccount.address.slice(-8)}`
    : "Not connected";
  const fullAddress = currentAccount?.address || "";
  const hasVerification = verificationData !== null;
  const canBind = currentAccount && hasVerification && !isBound;
  const canAnalyze = currentAccount && isBound;

  return (
    <>
      <Navbar />
      <div className="scanline" />
      <div className="matrix-rain" />

      {/* Already Analyzed Modal */}
      {showAlreadyAnalyzedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="holographic rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in border-2 border-blue-500/40">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-500 bg-black/50 mb-6">
                <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 gradient-text">Already Analyzed!</h2>
              <p className="text-lg text-gray-300 mb-6">
                You have already completed onchain analysis for this wallet
              </p>
              <div className="glow-border rounded-lg p-4 mb-6 text-left bg-black/30">
                <p className="text-sm text-gray-300">
                  Your wallet activity has already been analyzed and saved. You can proceed to the next step to upload your data to Walrus.
                </p>
              </div>
              <button
                onClick={() => setShowAlreadyAnalyzedModal(false)}
                className="group relative w-full px-6 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] uppercase tracking-wide"
              >
                <span className="relative z-10">Continue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Already Uploaded Modal */}
      {showAlreadyUploadedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="holographic rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in border-2 border-blue-500/40">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-500 bg-black/50 mb-6">
                <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 gradient-text">Already Uploaded!</h2>
              <p className="text-lg text-gray-300 mb-6">
                Your data has already been uploaded to Walrus
              </p>
              <div className="glow-border rounded-lg p-4 mb-6 text-left bg-black/30">
                <p className="text-sm text-gray-300">
                  Your encrypted verification data has already been stored on Walrus. Each wallet can only upload once.
                </p>
              </div>
              <button
                onClick={() => setShowAlreadyUploadedModal(false)}
                className="group relative w-full px-6 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] uppercase tracking-wide"
              >
                <span className="relative z-10">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#1a1a1a] to-[#0a0a0f] px-4 pt-16 relative">
        <div className="w-full max-w-2xl space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 opacity-20 blur-xl absolute top-0 left-0 animate-pulse"></div>
                <svg className="w-16 h-16 relative z-10" fill="none" viewBox="0 0 24 24" stroke="rgb(37, 99, 235)" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 gradient-text">
              Onchain Verification
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Analyze your wallet activity to verify <span className="text-blue-500">human behavior</span>
            </p>
          </div>

          <div className="holographic rounded-2xl px-8 py-10 shadow-2xl">
            <div className="space-y-6">
              {/* Connected Address */}
              <div>
                <label className="block text-sm font-semibold text-cyan-500 mb-2 uppercase tracking-wide">
                  Connected Address
                </label>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-cyan-500/30 bg-black/50 px-4 py-3">
                  <code className="text-sm font-mono text-white truncate">{displayAddress}</code>
                  {currentAccount && (
                    <button
                      onClick={() => navigator.clipboard.writeText(fullAddress)}
                      className="ml-2 flex-shrink-0 rounded-md p-1 text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                      title="Copy full address"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* CEX Verification Status */}
              <div>
                <label className="block text-sm font-semibold text-blue-500 mb-2 uppercase tracking-wide">
                  CEX Verification Status
                </label>
                <div className={`mt-2 rounded-lg border px-4 py-3 ${
                  hasVerification ? "border-cyan-500/50 bg-black/50 glow-border" : "border-gray-600/30 bg-black/30"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {hasVerification ? (
                        <span className="text-cyan-500 flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Verified</span>
                      )}
                    </span>
                    {!hasVerification && (
                      <button
                        onClick={() => router.push('/cex-verify')}
                        className="text-sm text-cyan-500 hover:text-blue-500 transition-colors font-semibold"
                      >
                        Verify Now →
                      </button>
                    )}
                  </div>
                  {hasVerification && verificationData && (
                    <div className="mt-2 text-xs text-gray-400 font-mono">
                      Sources: <span className="text-white">{verificationData.userId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Binding Status */}
              <div>
                <label className="block text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                  Address Binding Status
                </label>
                <div className={`mt-2 rounded-lg border px-4 py-3 ${
                  isBound ? "border-cyan-500/50 bg-black/50 glow-border" : "border-gray-600/30 bg-black/30"
                }`}>
                  <span className="text-sm font-medium">
                    {isBound ? (
                      <span className="text-cyan-500 flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
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
                    className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-cyan-500 px-4 py-3 text-sm font-bold text-cyan-500 hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isBinding && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      {isBinding ? "Sign & Bind Address..." : "Sign & Bind Address"}
                    </span>
                    <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>

                  {bindError && (
                    <div className="rounded-lg border border-blue-600/30 bg-black/30 p-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mt-1"></div>
                        <p className="text-sm text-blue-600">{bindError}</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg glow-border p-4 bg-black/30">
                    <div className="flex gap-3">
                      <svg className="h-5 w-5 text-cyan-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-300">
                        You will be asked to sign a message with your wallet to prove ownership of this address.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Analyzing Animation */}
              {isAnalyzing && (
                <div className="mt-2 rounded-lg border border-blue-500/50 bg-black/50 glow-border-purple p-8">
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 opacity-20 blur-xl absolute top-0 left-0 animate-pulse-glow"></div>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150"><path fill="none" stroke="#FF156D" strokeWidth="15" strokeLinecap="round" strokeDasharray="300 385" strokeDashoffset="0" d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"><animate attributeName="stroke-dashoffset" calcMode="spline" dur="2" values="685;-685" keySplines="0 0 1 1" repeatCount="indefinite"></animate></path></svg>
                      </div>
                    </div>

                    {/* Analyzing Text */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 gradient-text">
                        Analyzed onchain activity
                      </h3>
                      <p className="text-sm text-gray-400">
                        AI is conducting a comprehensive analysis
                      </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-300">Getting transaction data...</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <span className="text-sm text-gray-300">Analyzing behavior patterns...</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        <span className="text-sm text-gray-300">Detecting bot activity...</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        <span className="text-sm text-gray-300">Calculating the human score...</span>
                      </div>
                    </div>

                    {/* Loading Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 animate-pulse" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {!isAnalyzing && analysisResult ? (
                <div>
                  <label className="block text-sm font-semibold text-blue-500 mb-2 uppercase tracking-wide">
                    Analysis Results
                  </label>

                  {/* Human Score Display */}
                  <div className="mt-2 rounded-lg border border-cyan-500/50 bg-black/50 glow-border p-6">
                    <div className="text-center mb-4">
                      <div className="text-6xl font-bold gradient-text mb-2">
                        {analysisResult.humanScore}
                      </div>
                      <div className="text-sm text-gray-400 uppercase tracking-wider">Human Score</div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{analysisResult.totalTransactions}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-500">{analysisResult.successfulTransactions}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analysisResult.failedTransactions}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Failed</div>
                      </div>
                    </div>

                    {/* Success Rate Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Success Rate</span>
                        <span>{analysisResult.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          style={{ width: `${analysisResult.successRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="rounded-lg bg-black/50 border border-blue-500/30 p-4">
                      <div className="flex gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <div className="text-xs font-bold text-blue-500 uppercase tracking-wide">AI Analysis</div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{analysisResult.aiAnalysis}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-blue-500 mb-2 uppercase tracking-wide">
                    Activity Status
                  </label>
                  <div className="mt-2 rounded-lg border border-gray-600/30 bg-black/30 px-4 py-6 text-center">
                    <div className="text-gray-400">
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">Click &quot;Analyze&quot; to start the AI analysis</p>
                      <p className="text-xs text-gray-500 mt-2">We&apos;ll analyze your transaction patterns</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Error */}
              {analysisError && (
                <div className="rounded-lg border border-blue-600/30 bg-black/30 p-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mt-1"></div>
                    <p className="text-sm text-blue-600">{analysisError}</p>
                  </div>
                </div>
              )}

              {/* Analyze Button or Wrap to JSON Button */}
              {!jsonData ? (
                <button
                  onClick={analysisResult && !isAnalyzing ? handleWrapToJson : handleAnalyze}
                  disabled={isAnalyzing || (!analysisResult && !canAnalyze)}
                  className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-blue-500 px-4 py-3 text-sm font-bold text-blue-500 hover:shadow-[0_0_30px_rgba(182,0,255,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                      </>
                    ) : analysisResult ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Wrap to JSON File
                      </>
                    ) : !currentAccount ? (
                      "Connect Wallet to Analyze"
                    ) : !hasVerification ? (
                      "Complete CEX Verification First"
                    ) : !isBound ? (
                      "Bind Address to Analyze"
                    ) : (
                      "Analyze"
                    )}
                  </span>
                  <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              ) : !walrusBlobId ? (
                <div className="space-y-4">
                  {/* JSON Data Display */}
                  <div className="rounded-lg border border-cyan-500/50 bg-black/50 glow-border p-4">
                    <label className="text-sm font-semibold text-blue-500 uppercase tracking-wide mb-3 block">
                      JSON Data Ready
                    </label>
                    <pre className="text-xs text-gray-300 font-mono overflow-x-auto max-h-60 overflow-y-auto bg-black/50 rounded p-3 border border-gray-700/30">
                      {jsonData}
                    </pre>
                  </div>

                  {/* Upload Error */}
                  {uploadError && (
                    <div className="rounded-lg border border-blue-600/30 bg-black/30 p-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mt-1"></div>
                        <p className="text-sm text-blue-600">{uploadError}</p>
                      </div>
                    </div>
                  )}

                  {/* Upload to Walrus Button */}
                  <button
                    onClick={handleUploadToWalrus}
                    disabled={isUploading || hasExistingUpload}
                    className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-cyan-500 px-4 py-3 text-sm font-bold text-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Encrypting & Uploading to Walrus...
                        </>
                      ) : hasExistingUpload ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Already Uploaded to Walrus
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Submit to Walrus Testnet
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>

                  {/* Info message if already uploaded */}
                  {hasExistingUpload && (
                    <div className="rounded-lg border border-blue-500/30 bg-black/30 p-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1"></div>
                        <p className="text-sm text-gray-300">
                          You have already uploaded your verification data to Walrus. Each wallet can only upload once.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Info about encryption */}
                  <div className="rounded-lg glow-border p-4 bg-black/30">
                    <div className="flex gap-3">
                      <svg className="h-5 w-5 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-300">
                        Your data will be encrypted using <span className="text-blue-500">Seal</span> before being uploaded to <span className="text-cyan-500">Walrus testnet</span>. Only you can decrypt it.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Success Message */}
                  <div className="rounded-lg border border-cyan-500/50 bg-black/50 glow-border p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 gradient-text">
                        Successfully Uploaded to Walrus!
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        Your encrypted verification data is now stored on Walrus testnet
                      </p>

                      {/* Blob ID Display */}
                      <div className="bg-black/50 rounded-lg p-4 mb-4">
                        <label className="text-xs text-blue-500 uppercase tracking-wide mb-2 block">
                          Blob ID
                        </label>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-sm font-mono text-white break-all">{walrusBlobId}</code>
                          <button
                            onClick={() => navigator.clipboard.writeText(walrusBlobId)}
                            className="flex-shrink-0 rounded-md p-2 text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                            title="Copy Blob ID"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <a
                        href={getWalrusUrl(walrusBlobId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-cyan-500 hover:text-blue-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View on Walrus
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Helper Messages */}
              {!currentAccount && (
                <div className="rounded-lg border border-blue-600/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-600">Step 1:</strong> Please connect your Sui wallet to continue
                  </p>
                </div>
              )}

              {currentAccount && !hasVerification && (
                <div className="rounded-lg border border-blue-600/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-600">Step 2:</strong> Complete CEX verification first before binding your address
                  </p>
                </div>
              )}

              {currentAccount && hasVerification && !isBound && (
                <div className="rounded-lg border border-blue-600/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-blue-600">Step 3:</strong> Bind your wallet address to your CEX verification to continue
                  </p>
                </div>
              )}

              {/* Info Section */}
              <div className="rounded-lg glow-border p-4 bg-black/30">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-cyan-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-300">
                    Click analyze to fetch your onchain transaction data from the Sui blockchain. Our AI will analyze your transaction patterns and calculate a human behavior score.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="text-sm font-semibold text-blue-500 hover:text-cyan-500 transition-colors uppercase tracking-wide"
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
