"use client";

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      {/* Scanline effect */}
      <div className="scanline" />

      {/* Matrix rain background */}
      <div className="matrix-rain" />

      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Hero Section */}
        <section className="px-4 pt-32 pb-20 relative grid-background">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Floating security icon */}
            <div className="flex justify-center mb-8 animate-float">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00fff5] via-[#b600ff] to-[#ff00e5] opacity-20 blur-xl absolute top-0 left-0 animate-pulse-glow"></div>
                <svg className="w-24 h-24 relative z-10" fill="none" viewBox="0 0 24 24" stroke="#00fff5" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 animate-fade-in gradient-text glitch">
              Im Human
            </h1>
            <div className="h-1 w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#00fff5] to-transparent animate-pulse"></div>

            <p className="text-xl md:text-3xl text-[#00fff5] mb-4 max-w-3xl mx-auto animate-slide-up stagger-1 font-mono">
              Privacy-Preserving Human Verification Protocol
            </p>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto animate-slide-up stagger-2 leading-relaxed">
              Verify you&apos;re human using your existing CEX KYC data without revealing your identity through advanced zero-knowledge cryptography
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-slide-up stagger-3">
              <button
                onClick={() => router.push("/cex-verify")}
                className="group relative px-8 py-4 bg-transparent border-2 border-[#00fff5] text-[#00fff5] rounded-lg font-semibold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,245,0.5)] hover:scale-105"
              >
                <span className="relative z-10">Verify with CEX KYC</span>
                <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => router.push("/onchain-verify")}
                className="group relative px-8 py-4 bg-transparent border-2 border-[#b600ff] text-[#b600ff] rounded-lg font-semibold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(182,0,255,0.5)] hover:scale-105"
              >
                <span className="relative z-10">Onchain Verification</span>
                <div className="absolute inset-0 bg-[#b600ff] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-[#00fff5] rounded-full animate-pulse opacity-60"></div>
            <div className="absolute top-40 right-20 w-2 h-2 bg-[#ff00e5] rounded-full animate-pulse opacity-60" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 left-20 w-2 h-2 bg-[#b600ff] rounded-full animate-pulse opacity-60" style={{animationDelay: '1s'}}></div>
          </div>
        </section>

        {/* What is Im Human Section */}
        <section className="px-4 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center animate-slide-up">
              <span className="gradient-text">What is Im Human?</span>
            </h2>
            <div className="max-w-4xl mx-auto holographic rounded-2xl p-8 md:p-12 animate-scale-in">
              <p className="text-gray-300 text-center text-lg leading-relaxed mb-6">
                Im Human is a revolutionary identity verification protocol that leverages <span className="text-[#00fff5] font-bold">zero-knowledge proofs</span> and <span className="text-[#b600ff] font-bold">zkTLS (Zero-Knowledge Transport Layer Security)</span> to prove you&apos;re a verified human without exposing your personal information.
              </p>
              <p className="text-gray-300 text-center text-lg leading-relaxed">
                By utilizing your existing KYC verification from centralized exchanges (CEX), you can generate cryptographic proofs that confirm your humanity while maintaining <span className="text-[#ff00e5] font-bold">complete privacy</span>.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 py-20 relative grid-background">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">
              <span className="gradient-text">How It Works</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="holographic p-8 rounded-xl animate-slide-up stagger-1 group">
                <div className="w-16 h-16 glow-border rounded-lg flex items-center justify-center mb-6 mx-auto bg-black/50 group-hover:animate-pulse-glow transition-all duration-300">
                  <svg className="w-8 h-8 text-[#00fff5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-center mb-3">
                  <span className="text-[#00fff5] text-sm font-mono font-bold">STEP 01</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Connect Your CEX
                </h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  Connect to your Binance account (or other supported exchanges) through a secure zkTLS connection powered by Reclaim Protocol.
                </p>
              </div>

              <div className="holographic p-8 rounded-xl animate-slide-up stagger-2 group">
                <div className="w-16 h-16 glow-border-purple rounded-lg flex items-center justify-center mb-6 mx-auto bg-black/50 group-hover:animate-pulse-glow transition-all duration-300">
                  <svg className="w-8 h-8 text-[#b600ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-center mb-3">
                  <span className="text-[#b600ff] text-sm font-mono font-bold">STEP 02</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Generate Zero-Knowledge Proof
                </h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  Your KYC status is verified and converted into a cryptographic proof using zkTLS technology - no personal data is exposed.
                </p>
              </div>

              <div className="holographic p-8 rounded-xl animate-slide-up stagger-3 group">
                <div className="w-16 h-16 glow-border-pink rounded-lg flex items-center justify-center mb-6 mx-auto bg-black/50 group-hover:animate-pulse-glow transition-all duration-300">
                  <svg className="w-8 h-8 text-[#ff00e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center mb-3">
                  <span className="text-[#ff00e5] text-sm font-mono font-bold">STEP 03</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Verify Anywhere
                </h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  Use your proof to verify your humanity across DApps, DAOs, and Web3 platforms without revealing your identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">
              <span className="gradient-text">Features</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="flex gap-4 holographic p-6 rounded-xl animate-slide-up stagger-1 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 glow-border rounded-lg flex items-center justify-center bg-black/50 group-hover:animate-pulse-glow transition-all">
                    <svg className="w-6 h-6 text-[#00fff5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    CEX KYC Verification
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Leverage your existing Binance KYC verification to prove humanity without re-uploading documents.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 holographic p-6 rounded-xl animate-slide-up stagger-2 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 glow-border-purple rounded-lg flex items-center justify-center bg-black/50 group-hover:animate-pulse-glow transition-all">
                    <svg className="w-6 h-6 text-[#b600ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Onchain Verification
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Store and verify proofs onchain for permanent, decentralized human verification.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 holographic p-6 rounded-xl animate-slide-up stagger-3 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 glow-border-pink rounded-lg flex items-center justify-center bg-black/50 group-hover:animate-pulse-glow transition-all">
                    <svg className="w-6 h-6 text-[#ff00e5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Zero-Knowledge Privacy
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Your personal information stays private. Only cryptographic proofs are shared - never your actual data.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 holographic p-6 rounded-xl animate-slide-up stagger-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 glow-border rounded-lg flex items-center justify-center bg-black/50 group-hover:animate-pulse-glow transition-all">
                    <svg className="w-6 h-6 text-[#00fff5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Powered by zkTLS
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Built on Reclaim Protocol&apos;s zkTLS technology for secure, verifiable proofs from web2 data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="px-4 py-20 relative grid-background">
          <div className="max-w-6xl mx-auto relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">
              <span className="gradient-text">Technology Stack</span>
            </h2>
            <div className="holographic rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00fff5] transition-colors">
                      zkTLS (Zero-Knowledge TLS)
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    Enables secure verification of data from HTTPS connections without exposing the actual data or credentials.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#b600ff] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#b600ff] transition-colors">
                      Reclaim Protocol
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    Decentralized attestation protocol that transforms web2 credentials into verifiable web3 proofs.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#ff00e5] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#ff00e5] transition-colors">
                      Smart Contracts
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    Onchain verification system for permanent, trustless human verification records.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00fff5] transition-colors">
                      Privacy First
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    No personal data is stored or transmitted - only cryptographic proofs that you control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00fff5] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#b600ff] rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 gradient-text">
              Ready to Prove You&apos;re Human?
            </h2>
            <div className="h-1 w-48 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#00fff5] to-transparent"></div>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Start verifying your humanity with <span className="text-[#00fff5]">privacy-preserving</span> zero-knowledge proofs
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => router.push("/cex-verify")}
                className="group relative px-10 py-5 bg-transparent border-2 border-[#00fff5] text-[#00fff5] rounded-lg font-bold text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,245,0.6)] hover:scale-105"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              <a
                href="https://reclaimprotocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 bg-transparent border-2 border-[#b600ff] text-[#b600ff] rounded-lg font-bold text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(182,0,255,0.6)] hover:scale-105"
              >
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-[#b600ff] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
