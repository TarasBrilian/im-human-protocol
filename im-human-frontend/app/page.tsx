"use client";

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import { Shield, Wallet, Brain, Database, CheckCircle, ArrowRight, ChevronDown, Fingerprint, Key, Eye, EyeOff, Zap, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.3;

  return (
    <>
      <Navbar />

      <div className="bg-black text-white overflow-hidden">
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Floating Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Floating Kanji */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translateY(${parallaxOffset}px)` }}
          >
            <div className="absolute top-32 left-1/4 text-9xl text-cyan-900/10 font-bold" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              人
            </div>
            <div className="absolute top-64 right-1/4 text-8xl text-blue-900/10 font-bold" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              証
            </div>
            <div className="absolute bottom-32 left-1/3 text-7xl text-cyan-900/10 font-bold" style={{ fontFamily: "'Noto Serif JP', serif" }}>
              明
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-6 max-w-6xl">
            <div className="inline-block mb-6">
              <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                <span className="text-cyan-400 text-sm tracking-wide">Powered by zkTLS Reclaim Protocol</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Im Human
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-3xl mx-auto leading-relaxed">
              Prove Your Humanity Without Revealing Your Identity
            </p>

            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Privacy-preserving human verification using zero-knowledge proofs and AI-powered on-chain analysis
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push("/cex-verify")}
                className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 flex items-center gap-2"
              >
                <span className="text-lg font-semibold">Start Verification</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/onchain-verify")}
                className="px-8 py-4 border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-all transform hover:scale-105"
              >
                <span className="text-lg">Onchain Verification</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-500">Privacy Protected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  0-100
                </div>
                <div className="text-sm text-gray-500">Human Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  zkTLS
                </div>
                <div className="text-sm text-gray-500">Zero-Knowledge</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="relative py-32 px-6 bg-gradient-to-b from-black via-gray-900/50 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-block mb-4">
                <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase">Verification Process</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6">
                How It Works
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Four simple steps to prove your humanity while maintaining complete privacy
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/20 via-cyan-500/40 to-cyan-500/20 transform -translate-y-1/2"></div>

              {/* Steps */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Step 1: CEX Verification */}
                <div className="relative group">
                  <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/30">
                      1
                    </div>
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shield className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">CEX Verification</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      Connect your Binance account using zkTLS Reclaim Protocol
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Privacy-preserving verification</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>No identity disclosure</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Instant proof generation</span>
                      </div>
                    </div>
                    <div className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-cyan-500/50" />
                    </div>
                  </div>
                </div>

                {/* Step 2: Wallet Connection */}
                <div className="relative group">
                  <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/30">
                      2
                    </div>
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Wallet className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Wallet Connection</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      Connect your Sui wallet and bind your address
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Sui network integration</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Secure address binding</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Proof association</span>
                      </div>
                    </div>
                    <div className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-cyan-500/50" />
                    </div>
                  </div>
                </div>

                {/* Step 3: AI Analysis */}
                <div className="relative group">
                  <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/30">
                      3
                    </div>
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">AI Analysis</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      AI analyzes your on-chain transactions and activities
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Transaction pattern analysis</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Activity verification</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Human score calculation (0-100)</span>
                      </div>
                    </div>
                    <div className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2">
                      <ArrowRight className="w-8 h-8 text-cyan-500/50" />
                    </div>
                  </div>
                </div>

                {/* Step 4: Walrus Storage */}
                <div className="relative group">
                  <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 h-full">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-500/30">
                      4
                    </div>
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database className="w-8 h-8 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Walrus Storage</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      Encrypt and submit your verification to Walrus
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>JSON data wrapping</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Seal encryption</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>Decentralized storage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <button
                onClick={() => router.push("/cex-verify")}
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 text-lg font-semibold"
              >
                Start Your Verification Now
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-32 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase">Core Features</span>
              <h2 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
                Why Im Human
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature 1: Zero-Knowledge Privacy */}
              <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                <div
                  className="absolute top-0 right-0 text-9xl text-cyan-900/5 font-bold -mr-8 -mt-4 group-hover:text-cyan-900/10 transition-colors"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  秘密
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <EyeOff className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Zero-Knowledge Privacy</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Verify your humanity without revealing your identity using zkTLS technology
                  </p>
                </div>
              </div>

              {/* Feature 2: AI-Powered Analysis */}
              <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                <div
                  className="absolute top-0 right-0 text-9xl text-cyan-900/5 font-bold -mr-8 -mt-4 group-hover:text-cyan-900/10 transition-colors"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  知能
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Brain className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">AI-Powered Analysis</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Advanced on-chain analysis determines authentic human behavior patterns
                  </p>
                </div>
              </div>

              {/* Feature 3: Decentralized Storage */}
              <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                <div
                  className="absolute top-0 right-0 text-9xl text-cyan-900/5 font-bold -mr-8 -mt-4 group-hover:text-cyan-900/10 transition-colors"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  分散
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Lock className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Decentralized Storage</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Your verification data is encrypted and stored on Walrus network
                  </p>
                </div>
              </div>

              {/* Feature 4: Instant Verification */}
              <div className="group relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                <div
                  className="absolute top-0 right-0 text-9xl text-cyan-900/5 font-bold -mr-8 -mt-4 group-hover:text-cyan-900/10 transition-colors"
                  style={{ fontFamily: "'Noto Serif JP', serif" }}
                >
                  瞬時
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Instant Verification</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Get your human score in seconds, from 0 to 100 based on on-chain activity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section id="technology" className="relative py-32 px-6 bg-gradient-to-b from-black via-blue-950/10 to-black">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-cyan-400 text-sm tracking-[0.3em] uppercase">Powered By</span>
              <h2 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
                Technology Stack
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Reclaim Protocol */}
              <div className="relative group bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">Reclaim Protocol</h3>
                  <p className="text-gray-400 leading-relaxed">
                    zkTLS technology for privacy-preserving CEX verification
                  </p>
                </div>
              </div>

              {/* Sui Network */}
              <div className="relative group bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">Sui Network</h3>
                  <p className="text-gray-400 leading-relaxed">
                    High-performance blockchain for wallet connection and on-chain data
                  </p>
                </div>
              </div>

              {/* Walrus Storage */}
              <div className="relative group bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-cyan-900/30 hover:border-cyan-500/50 transition-all transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">Walrus Storage</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Decentralized storage with seal encryption for verification data
                  </p>
                </div>
              </div>
            </div>

            {/* Human Score Visualization */}
            <div className="bg-gradient-to-br from-gray-900 to-black p-10 rounded-3xl border border-cyan-900/30">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">AI-Powered Human Score</h3>
                <p className="text-gray-400">Your on-chain activity determines your humanity score</p>
              </div>

              <div className="relative max-w-2xl mx-auto">
                {/* Score Bar */}
                <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 via-cyan-500 to-green-500 w-full flex items-center justify-between px-4 text-xs font-bold">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Score Labels */}
                <div className="flex justify-between mt-4 text-sm">
                  <div className="text-center">
                    <div className="text-red-400 font-bold">Bot-Like</div>
                    <div className="text-gray-600">0-40</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold">Suspicious</div>
                    <div className="text-gray-600">41-70</div>
                  </div>
                  <div className="text-center">
                    <div className="text-cyan-400 font-bold">Likely Human</div>
                    <div className="text-gray-600">71-90</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-bold">Verified Human</div>
                    <div className="text-gray-600">91-100</div>
                  </div>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                  AI analyzes transaction patterns, wallet age, activity consistency, and interaction depth
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 px-6 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            {/* Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Prove Your Humanity?
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Join the privacy-preserving human verification revolution. No identity disclosure,
                just proof of being human.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button
                  onClick={() => router.push("/cex-verify")}
                  className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30 text-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Fingerprint className="w-6 h-6" />
                  <span>Verify Now</span>
                </button>
                <button
                  onClick={() => router.push("/onchain-verify")}
                  className="px-10 py-5 border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-xl transition-all transform hover:scale-105 text-lg font-semibold"
                >
                  Onchain Analysis
                </button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <Key className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Zero-Knowledge</div>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Full Privacy</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Secure</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Google Fonts */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600;700;900&display=swap');
      `}</style>
    </>
  );
}
