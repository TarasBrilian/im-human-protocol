"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  getVerification,
  bindAddress,
  isAddressBound,
  getAddressBinding,
} from "../../lib/verification-storage";
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

  // Check verification status and address binding
  useEffect(() => {
    const verification = getVerification();
    setVerificationData(verification);

    if (currentAccount?.address) {
      setIsBound(isAddressBound(currentAccount.address));
    } else {
      setIsBound(false);
    }
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

      bindAddress(currentAccount.address, verificationData.userId, signature, message);
      setIsBound(true);
    } catch (error: any) {
      console.error("Error binding address:", error);
      setBindError(error.message || "Failed to sign message. Please try again.");
    } finally {
      setIsBinding(false);
    }
  };

  // Handle activity analysis
  const handleAnalyze = async () => {
    if (!currentAccount?.address) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      console.log("Analyzing transactions for address:", currentAccount.address);

      // Call the main analysis function
      const result = await analyzeUserTransactions(currentAccount.address);

      console.log("Analysis complete:", result);
      setAnalysisResult(result);
    } catch (error: any) {
      console.error('Error analyzing address:', error);
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
        addressBinding: getAddressBinding(currentAccount.address),
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

      console.log('JSON data wrapped successfully');
    } catch (error) {
      console.error('Error creating JSON data:', error);
    }
  };

  // Handle uploading to Walrus testnet
  const handleUploadToWalrus = async () => {
    if (!jsonData || !currentAccount?.address) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Parse JSON data back to object
      const data = JSON.parse(jsonData);

      console.log('Encrypting data with AES-256...');

      // Encrypt data using wallet address as key
      const encryptedData = await encryptWithSeal(data, currentAccount.address);

      console.log('Uploading to Walrus testnet...');

      // Upload encrypted data to Walrus
      const blobId = await uploadToWalrus(encryptedData);

      console.log('Upload successful! Blob ID:', blobId);

      setWalrusBlobId(blobId);
    } catch (error: any) {
      console.error('Error uploading to Walrus:', error);
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

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0a0a0f] via-[#1a1a1a] to-[#0a0a0f] px-4 pt-16 relative">
        <div className="w-full max-w-2xl space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d4af37] via-[#c41e3a] to-[#8b0000] opacity-20 blur-xl absolute top-0 left-0 animate-pulse"></div>
                <svg className="w-16 h-16 relative z-10" fill="none" viewBox="0 0 24 24" stroke="#d4af37" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 gradient-text">
              Onchain Verification
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Analyze your wallet activity to verify <span className="text-[#d4af37]">human behavior</span>
            </p>
          </div>

          <div className="holographic rounded-2xl px-8 py-10 shadow-2xl">
            <div className="space-y-6">
              {/* Connected Address */}
              <div>
                <label className="block text-sm font-semibold text-[#c41e3a] mb-2 uppercase tracking-wide">
                  Connected Address
                </label>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-[#c41e3a]/30 bg-black/50 px-4 py-3">
                  <code className="text-sm font-mono text-white truncate">{displayAddress}</code>
                  {currentAccount && (
                    <button
                      onClick={() => navigator.clipboard.writeText(fullAddress)}
                      className="ml-2 flex-shrink-0 rounded-md p-1 text-[#c41e3a] hover:bg-[#c41e3a]/10 transition-colors"
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
                <label className="block text-sm font-semibold text-[#d4af37] mb-2 uppercase tracking-wide">
                  CEX Verification Status
                </label>
                <div className={`mt-2 rounded-lg border px-4 py-3 ${
                  hasVerification ? "border-[#c41e3a]/50 bg-black/50 glow-border" : "border-gray-600/30 bg-black/30"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {hasVerification ? (
                        <span className="text-[#c41e3a] flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse"></div>
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-400">Not Verified</span>
                      )}
                    </span>
                    {!hasVerification && (
                      <button
                        onClick={() => router.push('/cex-verify')}
                        className="text-sm text-[#c41e3a] hover:text-[#d4af37] transition-colors font-semibold"
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
                <label className="block text-sm font-semibold text-[#8b0000] mb-2 uppercase tracking-wide">
                  Address Binding Status
                </label>
                <div className={`mt-2 rounded-lg border px-4 py-3 ${
                  isBound ? "border-[#c41e3a]/50 bg-black/50 glow-border" : "border-gray-600/30 bg-black/30"
                }`}>
                  <span className="text-sm font-medium">
                    {isBound ? (
                      <span className="text-[#c41e3a] flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse"></div>
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
                    className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#c41e3a] px-4 py-3 text-sm font-bold text-[#c41e3a] hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <div className="absolute inset-0 bg-[#c41e3a] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>

                  {bindError && (
                    <div className="rounded-lg border border-[#8b0000]/30 bg-black/30 p-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-pulse mt-1"></div>
                        <p className="text-sm text-[#8b0000]">{bindError}</p>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg glow-border p-4 bg-black/30">
                    <div className="flex gap-3">
                      <svg className="h-5 w-5 text-[#c41e3a] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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
                <div className="mt-2 rounded-lg border border-[#d4af37]/50 bg-black/50 glow-border-purple p-8">
                  <div className="text-center space-y-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37] via-[#c41e3a] to-[#8b0000] opacity-20 blur-xl absolute top-0 left-0 animate-pulse-glow"></div>
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
                        <div className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-300">Getting transaction data...</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <span className="text-sm text-gray-300">Analyzing behavior patterns...</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        <span className="text-sm text-gray-300">Detecting bot activity...</span>
                      </div>
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        <span className="text-sm text-gray-300">Calculating the human score...</span>
                      </div>
                    </div>

                    {/* Loading Bar */}
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-[#c41e3a] via-[#d4af37] to-[#c41e3a] animate-pulse" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analysis Results */}
              {!isAnalyzing && analysisResult ? (
                <div>
                  <label className="block text-sm font-semibold text-[#d4af37] mb-2 uppercase tracking-wide">
                    Analysis Results
                  </label>

                  {/* Human Score Display */}
                  <div className="mt-2 rounded-lg border border-[#c41e3a]/50 bg-black/50 glow-border p-6">
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
                        <div className="text-2xl font-bold text-[#c41e3a]">{analysisResult.successfulTransactions}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#8b0000]">{analysisResult.failedTransactions}</div>
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
                          className="h-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#c41e3a]"
                          style={{ width: `${analysisResult.successRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="rounded-lg bg-black/50 border border-[#d4af37]/30 p-4">
                      <div className="flex gap-2 mb-2">
                        <svg className="w-5 h-5 text-[#d4af37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wide">AI Analysis</div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{analysisResult.aiAnalysis}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-[#d4af37] mb-2 uppercase tracking-wide">
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
                <div className="rounded-lg border border-[#8b0000]/30 bg-black/30 p-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-pulse mt-1"></div>
                    <p className="text-sm text-[#8b0000]">{analysisError}</p>
                  </div>
                </div>
              )}

              {/* Analyze Button or Wrap to JSON Button */}
              {!jsonData ? (
                <button
                  onClick={analysisResult && !isAnalyzing ? handleWrapToJson : handleAnalyze}
                  disabled={isAnalyzing || (!analysisResult && !canAnalyze)}
                  className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#d4af37] px-4 py-3 text-sm font-bold text-[#d4af37] hover:shadow-[0_0_30px_rgba(182,0,255,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <div className="absolute inset-0 bg-[#d4af37] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              ) : !walrusBlobId ? (
                <div className="space-y-4">
                  {/* JSON Data Display */}
                  <div className="rounded-lg border border-[#c41e3a]/50 bg-black/50 glow-border p-4">
                    <label className="text-sm font-semibold text-[#d4af37] uppercase tracking-wide mb-3 block">
                      JSON Data Ready
                    </label>
                    <pre className="text-xs text-gray-300 font-mono overflow-x-auto max-h-60 overflow-y-auto bg-black/50 rounded p-3 border border-gray-700/30">
                      {jsonData}
                    </pre>
                  </div>

                  {/* Upload Error */}
                  {uploadError && (
                    <div className="rounded-lg border border-[#8b0000]/30 bg-black/30 p-4">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-pulse mt-1"></div>
                        <p className="text-sm text-[#8b0000]">{uploadError}</p>
                      </div>
                    </div>
                  )}

                  {/* Upload to Walrus Button */}
                  <button
                    onClick={handleUploadToWalrus}
                    disabled={isUploading}
                    className="group relative flex w-full justify-center rounded-lg bg-transparent border-2 border-[#c41e3a] px-4 py-3 text-sm font-bold text-[#c41e3a] hover:shadow-[0_0_30px_rgba(196,30,58,0.5)] focus:outline-none uppercase tracking-wider overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          Submit to Walrus Testnet
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-[#c41e3a] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </button>

                  {/* Info about encryption */}
                  <div className="rounded-lg glow-border p-4 bg-black/30">
                    <div className="flex gap-3">
                      <svg className="h-5 w-5 text-[#d4af37] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-300">
                        Your data will be encrypted using <span className="text-[#d4af37]">Seal</span> before being uploaded to <span className="text-[#c41e3a]">Walrus testnet</span>. Only you can decrypt it.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Success Message */}
                  <div className="rounded-lg border border-[#c41e3a]/50 bg-black/50 glow-border p-6">
                    <div className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-[#c41e3a]/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
                        <label className="text-xs text-[#d4af37] uppercase tracking-wide mb-2 block">
                          Blob ID
                        </label>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-sm font-mono text-white break-all">{walrusBlobId}</code>
                          <button
                            onClick={() => navigator.clipboard.writeText(walrusBlobId)}
                            className="flex-shrink-0 rounded-md p-2 text-[#c41e3a] hover:bg-[#c41e3a]/10 transition-colors"
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
                        className="inline-flex items-center gap-2 text-sm text-[#c41e3a] hover:text-[#d4af37] transition-colors"
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
                <div className="rounded-lg border border-[#8b0000]/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-[#8b0000]">Step 1:</strong> Please connect your Sui wallet to continue
                  </p>
                </div>
              )}

              {currentAccount && !hasVerification && (
                <div className="rounded-lg border border-[#8b0000]/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-[#8b0000]">Step 2:</strong> Complete CEX verification first before binding your address
                  </p>
                </div>
              )}

              {currentAccount && hasVerification && !isBound && (
                <div className="rounded-lg border border-[#8b0000]/30 bg-black/30 p-4">
                  <p className="text-sm text-gray-300">
                    <strong className="text-[#8b0000]">Step 3:</strong> Bind your wallet address to your CEX verification to continue
                  </p>
                </div>
              )}

              {/* Info Section */}
              <div className="rounded-lg glow-border p-4 bg-black/30">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-[#c41e3a] flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
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
                className="text-sm font-semibold text-[#d4af37] hover:text-[#c41e3a] transition-colors uppercase tracking-wide"
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
