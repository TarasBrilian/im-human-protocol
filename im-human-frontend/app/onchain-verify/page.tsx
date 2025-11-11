"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function OnchainVerifyPage() {
  const [connectedAddress, setConnectedAddress] = useState("");
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  // Simulate wallet connection - replace with actual wallet connection logic
  const mockAddress = "0x7...";

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // TODO: Add your onchain analysis logic here
    console.log("Analyzing address:", connectedAddress || mockAddress);

    // Simulate API call and score calculation
    setTimeout(() => {
      // Mock human score between 0-100
      const mockScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
      setHumanScore(mockScore);
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50 dark:bg-green-900/20";
    if (score >= 60) return "bg-yellow-50 dark:bg-yellow-900/20";
    return "bg-red-50 dark:bg-red-900/20";
  };

  const displayAddress = connectedAddress || mockAddress;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 pt-16 dark:bg-zinc-900">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Onchain Verification
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Analyze your wallet activity to verify human behavior
            </p>
          </div>

          <div className="rounded-lg bg-white px-8 py-10 shadow-lg dark:bg-zinc-800">
            <div className="space-y-6">
              {/* Connected Address Section */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Connected Address
                </label>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <code className="text-sm font-mono text-zinc-900 dark:text-zinc-50">
                    {displayAddress}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(displayAddress)}
                    className="ml-2 rounded-md p-1 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                    title="Copy address"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Human Score Section */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Human Score
                </label>
                <div
                  className={`mt-2 rounded-lg border px-4 py-6 text-center ${
                    humanScore !== null
                      ? `${getScoreBgColor(humanScore)} border-transparent`
                      : "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
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
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {humanScore >= 80
                          ? "High confidence - Likely human behavior"
                          : humanScore >= 60
                          ? "Medium confidence - Review recommended"
                          : "Low confidence - Suspicious activity detected"}
                      </p>
                    </div>
                  ) : (
                    <div className="text-zinc-500 dark:text-zinc-400">
                      <svg
                        className="mx-auto h-12 w-12 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
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
                <div className="rounded-lg border border-zinc-300 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Analysis Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Transaction Pattern
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        Natural
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Activity Consistency
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        High
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Bot Likelihood
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        Low
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Network Activity
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        Ethereum, Polygon
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-400"
              >
                {isAnalyzing ? (
                  <span className="flex items-center">
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
                    Analyzing...
                  </span>
                ) : isAnalyzed ? (
                  "Re-analyze"
                ) : (
                  "Analyze"
                )}
              </button>

              {/* Info Section */}
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
                className="text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
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
