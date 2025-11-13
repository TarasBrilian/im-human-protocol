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

      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#1a1a1a] to-[#0a0a0f] relative overflow-hidden">
        {/* Hero Section */}
        <section className="px-4 pt-32 pb-20 relative grid-background">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Floating ninja icon */}
            <div className="flex justify-center mb-8 animate-float">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c41e3a] via-[#8b0000] to-[#d4af37] opacity-25 blur-xl absolute top-0 left-0 animate-pulse-glow"></div>
                <svg className="w-24 h-24 relative z-10" fill="none" viewBox="0 0 24 24" stroke="#c41e3a" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 animate-fade-in gradient-text glitch">
              Im Human
            </h1>
            <div className="h-1 w-32 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#c41e3a] to-transparent animate-pulse"></div>

            <p className="text-xl md:text-3xl text-[#c41e3a] mb-4 max-w-3xl mx-auto animate-slide-up stagger-1 font-mono">
              Privacy-Preserving Human Verification Protocol
            </p>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto animate-slide-up stagger-2 leading-relaxed">
              Verify you&apos;re human using your existing CEX KYC data without revealing your identity through advanced zero-knowledge cryptography
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-slide-up stagger-3">
              <button
                onClick={() => router.push("/cex-verify")}
                className="group relative px-8 py-4 bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#c41e3a] text-[#c41e3a] rounded-lg font-semibold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(196,30,58,0.6)] hover:scale-105 hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <span className="relative z-10">Verify with CEX KYC</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c41e3a]/10 to-[#d4af37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => router.push("/onchain-verify")}
                className="group relative px-8 py-4 bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#d4af37] text-[#d4af37] rounded-lg font-semibold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 hover:border-[#c41e3a] hover:text-[#c41e3a]"
              >
                <span className="relative z-10">Onchain Verification</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-[#c41e3a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Decorative elements - Ninja theme */}
            <div className="absolute top-20 left-10 w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse opacity-60 shadow-sm shadow-[#c41e3a]"></div>
            <div className="absolute top-40 right-20 w-2 h-2 bg-[#d4af37] rounded-full animate-pulse opacity-60 shadow-sm shadow-[#d4af37]" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 left-20 w-2 h-2 bg-[#8b0000] rounded-full animate-pulse opacity-60 shadow-sm shadow-[#8b0000]" style={{animationDelay: '1s'}}></div>
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
                Im Human is a revolutionary identity verification protocol that leverages <span className="text-[#c41e3a] font-bold">zero-knowledge proofs</span> and <span className="text-[#d4af37] font-bold">zkTLS (Zero-Knowledge Transport Layer Security)</span> to prove you&apos;re a verified human without exposing your personal information.
              </p>
              <p className="text-gray-300 text-center text-lg leading-relaxed">
                By utilizing your existing KYC verification from centralized exchanges (CEX), you can generate cryptographic proofs that confirm your humanity while maintaining <span className="text-[#c41e3a] font-bold">complete privacy</span>.
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
                  <svg className="w-8 h-8 text-[#c41e3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="text-center mb-3">
                  <span className="text-[#c41e3a] text-sm font-mono font-bold">STEP 01</span>
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
                  <svg className="w-8 h-8 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-center mb-3">
                  <span className="text-[#d4af37] text-sm font-mono font-bold">STEP 02</span>
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
                  <svg className="w-8 h-8 text-[#8b0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center mb-3">
                  <span className="text-[#8b0000] text-sm font-mono font-bold">STEP 03</span>
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

        {/* AI-Powered Onchain Analysis Section */}
        <section className="px-4 py-20 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4af37]/30 bg-black/30 mb-6">
                <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-[#d4af37] uppercase tracking-wide">AI-Powered Analysis</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                <span className="gradient-text">Intelligent Onchain Behavior Verification</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Our advanced AI analyzes your onchain transaction history to verify genuine human behavior patterns
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Left: Main Feature Card */}
              <div className="holographic rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 glow-border-purple rounded-lg flex items-center justify-center bg-black/50 animate-pulse-glow">
                    <svg className="w-8 h-8 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">AI Transaction Analysis</h3>
                    <p className="text-sm text-[#d4af37] font-mono">Powered by OpenAI</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-[#c41e3a]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#c41e3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Pattern Recognition</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Identifies organic transaction patterns vs automated bot behavior through sophisticated ML algorithms
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-[#c41e3a]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#c41e3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Spam Detection</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Automatically flags suspicious activities including airdrop farming, wash trading, and sybil attacks
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-[#c41e3a]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#c41e3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Human Score Rating</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Generates a comprehensive 0-100 trust score based on transaction diversity, timing patterns, and wallet age
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Stats & Benefits */}
              <div className="space-y-6">
                <div className="holographic rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#c41e3a]/20 to-[#8b0000]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#c41e3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Real-time Analysis</h4>
                      <p className="text-gray-400 text-sm">
                        Instant evaluation of your entire transaction history across multiple chains with actionable insights
                      </p>
                    </div>
                  </div>
                </div>

                <div className="holographic rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#d4af37]/20 to-[#c0c0c0]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Sybil Resistance</h4>
                      <p className="text-gray-400 text-sm">
                        Advanced detection of coordinated multi-wallet attacks and farming operations to protect protocols
                      </p>
                    </div>
                  </div>
                </div>

                <div className="holographic rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b0000]/20 to-[#c41e3a]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#8b0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2">Transparent Metrics</h4>
                      <p className="text-gray-400 text-sm">
                        Clear breakdown of transaction success rates, interaction diversity, and behavioral consistency
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <div className="inline-block glow-border rounded-2xl p-8 bg-black/30">
                <p className="text-lg text-gray-300 mb-4">
                  Combine <span className="text-[#c41e3a] font-bold">CEX KYC verification</span> with <span className="text-[#d4af37] font-bold">AI-powered onchain analysis</span> for the strongest proof of humanity
                </p>
                <button
                  onClick={() => router.push("/onchain-verify")}
                  className="group relative px-8 py-3 bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#d4af37] text-[#d4af37] rounded-lg font-semibold uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 hover:border-[#c41e3a] hover:text-[#c41e3a]"
                >
                  <span className="relative z-10">Try AI Analysis Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/10 to-[#c41e3a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
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
                    <svg className="w-6 h-6 text-[#c41e3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                    <svg className="w-6 h-6 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

              <div className="flex gap-4 holographic p-6 rounded-xl animate-slide-up stagger-4 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 glow-border rounded-lg flex items-center justify-center bg-black/50 group-hover:animate-pulse-glow transition-all">
                    <svg className="w-6 h-6 text-[#c41e3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

              <div className="flex gap-4 holographic p-6 rounded-xl animate-slide-up stagger-6 group">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 glow-border-pink rounded-lg flex items-center justify-center bg-black/50 group-hover:animate-pulse-glow transition-all">
                    <svg className="w-6 h-6 text-[#8b0000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Human Score Rating
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Comprehensive trust scoring system (0-100) based on transaction diversity, timing patterns, wallet age, and interaction quality.
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
                    <div className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse shadow-sm shadow-[#c41e3a]"></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#c41e3a] transition-colors">
                      zkTLS (Zero-Knowledge TLS)
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    Enables secure verification of data from HTTPS connections without exposing the actual data or credentials.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-pulse shadow-sm shadow-[#8b0000]" style={{animationDelay: '0.4s'}}></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#8b0000] transition-colors">
                      OpenAI Integration
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    Advanced AI models analyze transaction patterns to detect bots, spam, and verify authentic human behavior with high accuracy.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse shadow-sm shadow-[#c41e3a]" style={{animationDelay: '0.6s'}}></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#c41e3a] transition-colors">
                      Smart Contracts
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    Onchain verification system for permanent, trustless human verification records on Sui blockchain.
                  </p>
                </div>
                <div className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-[#8b0000] rounded-full animate-pulse shadow-sm shadow-[#8b0000]" style={{animationDelay: '1s'}}></div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#8b0000] transition-colors">
                      Privacy First
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed pl-5">
                    No personal data is stored or transmitted - only cryptographic proofs that you control with zero-knowledge privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-25">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#c41e3a] rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#d4af37] rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 gradient-text">
              Ready to Prove You&apos;re Human?
            </h2>
            <div className="h-1 w-48 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#c41e3a] to-transparent"></div>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Start verifying your humanity with <span className="text-[#c41e3a]">privacy-preserving</span> zero-knowledge proofs
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => router.push("/cex-verify")}
                className="group relative px-10 py-5 bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#c41e3a] text-[#c41e3a] rounded-lg font-bold text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(196,30,58,0.7)] hover:scale-105 hover:border-[#d4af37] hover:text-[#d4af37]"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#c41e3a]/15 to-[#d4af37]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <a
                href="https://reclaimprotocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-10 py-5 bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#d4af37] text-[#d4af37] rounded-lg font-bold text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] hover:scale-105 hover:border-[#c41e3a] hover:text-[#c41e3a]"
              >
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/15 to-[#c41e3a]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
