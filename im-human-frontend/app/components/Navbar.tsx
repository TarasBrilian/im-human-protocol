"use client";

import { useRouter } from "next/navigation";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Fingerprint } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const currentAccount = useCurrentAccount();

  const handleCexVerify = () => {
    router.push("/cex-verify");
  };

  const handleOnchainVerify = () => {
    router.push("/onchain-verify");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-900/30 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Fingerprint className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Im Human
                </span>
              </div>
            </a>
          </div>

          {/* Center: CEX Verify and Onchain Verify */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleCexVerify}
              className="group relative rounded-lg border border-cyan-500/40 px-4 py-2 text-sm font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] overflow-hidden uppercase tracking-wide"
            >
              <span className="relative z-10">CEX Verify</span>
            </button>
            <button
              onClick={handleOnchainVerify}
              className="group relative rounded-lg border border-blue-500/40 px-4 py-2 text-sm font-semibold text-blue-400 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] overflow-hidden uppercase tracking-wide"
            >
              <span className="relative z-10">Onchain Verify</span>
            </button>
          </div>

          {/* Right: Connect Button */}
          <div className="flex items-center gap-3">
            {currentAccount && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300 font-mono border border-cyan-500/30 rounded-lg px-3 py-1.5 bg-black/60 shadow-inner">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-400"></div>
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </div>
            )}
            <div className="[&_button]:!bg-gradient-to-r [&_button]:!from-cyan-500 [&_button]:!to-blue-600 [&_button]:hover:!from-cyan-600 [&_button]:hover:!to-blue-700 [&_button]:!text-white [&_button]:!font-semibold [&_button]:!shadow-lg [&_button]:!shadow-cyan-500/30 [&_button]:hover:!scale-105 [&_button]:!transition-all [&_button]:!duration-300 [&_button]:!border-0">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Mobile menu for verify buttons */}
        <div className="flex md:hidden items-center justify-center space-x-3 pb-3">
          <button
            onClick={handleCexVerify}
            className="group relative flex-1 rounded-lg border border-cyan-500/40 px-3 py-2 text-xs font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 overflow-hidden uppercase"
          >
            <span className="relative z-10">CEX</span>
          </button>
          <button
            onClick={handleOnchainVerify}
            className="group relative flex-1 rounded-lg border border-blue-500/40 px-3 py-2 text-xs font-semibold text-blue-400 transition-all duration-300 hover:border-blue-400 hover:bg-blue-500/10 overflow-hidden uppercase"
          >
            <span className="relative z-10">Onchain</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
