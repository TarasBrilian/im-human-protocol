"use client";

import { useRouter } from "next/navigation";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#00fff5]/20 bg-black/90 backdrop-blur-xl">
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00fff5] to-transparent opacity-50"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-black border border-[#00fff5]/50 overflow-hidden group-hover:border-[#00fff5] transition-all duration-300">
                {/* Glowing background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00fff5]/20 to-[#b600ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="text-lg font-bold text-[#00fff5] relative z-10 font-mono">
                  IH
                </span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">
                I&apos;m Human
              </span>
            </a>
          </div>

          {/* Center: CEX Verify and Onchain Verify */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleCexVerify}
              className="group relative rounded-lg border border-[#00fff5]/30 px-4 py-2 text-sm font-semibold text-[#00fff5] transition-all duration-300 hover:border-[#00fff5] hover:shadow-[0_0_15px_rgba(0,255,245,0.3)] overflow-hidden uppercase tracking-wide"
            >
              <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="relative z-10">CEX Verify</span>
            </button>
            <button
              onClick={handleOnchainVerify}
              className="group relative rounded-lg border border-[#b600ff]/30 px-4 py-2 text-sm font-semibold text-[#b600ff] transition-all duration-300 hover:border-[#b600ff] hover:shadow-[0_0_15px_rgba(182,0,255,0.3)] overflow-hidden uppercase tracking-wide"
            >
              <div className="absolute inset-0 bg-[#b600ff] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <span className="relative z-10">Onchain Verify</span>
            </button>
          </div>

          {/* Right: Connect Button */}
          <div className="flex items-center gap-3">
            {currentAccount && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 font-mono border border-[#00fff5]/20 rounded-lg px-3 py-1.5 bg-black/50">
                <div className="w-2 h-2 bg-[#00fff5] rounded-full animate-pulse"></div>
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </div>
            )}
            <div className="[&_button]:!bg-transparent [&_button]:!border-[#00fff5] [&_button]:!text-[#00fff5] [&_button]:!font-semibold [&_button]:!uppercase [&_button]:!tracking-wide [&_button]:hover:!shadow-[0_0_15px_rgba(0,255,245,0.4)] [&_button]:!transition-all">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Mobile menu for verify buttons */}
        <div className="flex md:hidden items-center justify-center space-x-3 pb-3">
          <button
            onClick={handleCexVerify}
            className="group relative flex-1 rounded-lg border border-[#00fff5]/30 px-3 py-2 text-xs font-semibold text-[#00fff5] transition-all duration-300 hover:border-[#00fff5] hover:shadow-[0_0_15px_rgba(0,255,245,0.3)] overflow-hidden uppercase"
          >
            <div className="absolute inset-0 bg-[#00fff5] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative z-10">CEX</span>
          </button>
          <button
            onClick={handleOnchainVerify}
            className="group relative flex-1 rounded-lg border border-[#b600ff]/30 px-3 py-2 text-xs font-semibold text-[#b600ff] transition-all duration-300 hover:border-[#b600ff] hover:shadow-[0_0_15px_rgba(182,0,255,0.3)] overflow-hidden uppercase"
          >
            <div className="absolute inset-0 bg-[#b600ff] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative z-10">Onchain</span>
          </button>
        </div>
      </div>

      {/* Bottom glowing border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#b600ff]/30 to-transparent"></div>
    </nav>
  );
}
