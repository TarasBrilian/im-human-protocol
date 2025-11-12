"use client";

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
        {/* Hero Section */}
        <section className="px-4 pt-32 pb-20">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
              Im Human
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-4 max-w-3xl mx-auto">
              Privacy-Preserving Human Verification Protocol
            </p>
            <p className="text-lg text-zinc-500 dark:text-zinc-500 max-w-2xl mx-auto">
              Verify you're human using your existing CEX KYC data without revealing your identity
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/cex-verify")}
                className="px-8 py-4 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Verify with CEX KYC
              </button>
              <button
                onClick={() => router.push("/onchain-verify")}
                className="px-8 py-4 border-2 border-zinc-900 text-zinc-900 rounded-lg font-medium hover:bg-zinc-900 hover:text-white transition-colors dark:border-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-50 dark:hover:text-zinc-900"
              >
                Onchain Verification
              </button>
            </div>
          </div>
        </section>

        {/* What is Im Human Section */}
        <section className="px-4 py-20 bg-white dark:bg-zinc-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
              What is Im Human?
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-4xl mx-auto">
              <p className="text-zinc-600 dark:text-zinc-300 text-center leading-relaxed">
                Im Human is a revolutionary identity verification protocol that leverages <strong>zero-knowledge proofs</strong> and <strong>zkTLS (Zero-Knowledge Transport Layer Security)</strong> to prove you're a verified human without exposing your personal information.
              </p>
              <p className="text-zinc-600 dark:text-zinc-300 text-center leading-relaxed mt-4">
                By utilizing your existing KYC verification from centralized exchanges (CEX), you can generate cryptographic proofs that confirm your humanity while maintaining complete privacy.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-12 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                  1. Connect Your CEX
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Connect to your Binance account (or other supported exchanges) through a secure zkTLS connection powered by Reclaim Protocol.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                  2. Generate Zero-Knowledge Proof
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Your KYC status is verified and converted into a cryptographic proof using zkTLS technology - no personal data is exposed.
                </p>
              </div>

              <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                  3. Verify Anywhere
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Use your proof to verify your humanity across DApps, DAOs, and Web3 platforms without revealing your identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 bg-white dark:bg-zinc-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-12 text-center">
              Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    CEX KYC Verification
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Leverage your existing Binance KYC verification to prove humanity without re-uploading documents.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    Onchain Verification
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Store and verify proofs onchain for permanent, decentralized human verification.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    Zero-Knowledge Privacy
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Your personal information stays private. Only cryptographic proofs are shared - never your actual data.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white dark:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    Powered by zkTLS
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Built on Reclaim Protocol's zkTLS technology for secure, verifiable proofs from web2 data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
              Technology Stack
            </h2>
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    zkTLS (Zero-Knowledge TLS)
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Enables secure verification of data from HTTPS connections without exposing the actual data or credentials.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Reclaim Protocol
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Decentralized attestation protocol that transforms web2 credentials into verifiable web3 proofs.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Smart Contracts
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Onchain verification system for permanent, trustless human verification records.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    Privacy First
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    No personal data is stored or transmitted - only cryptographic proofs that you control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 bg-zinc-900 dark:bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Prove You're Human?
            </h2>
            <p className="text-xl text-zinc-300 mb-8">
              Start verifying your humanity with privacy-preserving zero-knowledge proofs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/cex-verify")}
                className="px-8 py-4 bg-white text-zinc-900 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
              >
                Get Started
              </button>
              <a
                href="https://reclaimprotocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-zinc-900 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
