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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#c41e3a]/30 bg-gradient-to-b from-black/95 to-[#1a1a1a]/90 backdrop-blur-xl shadow-lg shadow-[#c41e3a]/10">
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c41e3a] to-transparent opacity-60"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a1a1a] to-black border border-[#c41e3a]/50 overflow-hidden group-hover:border-[#d4af37] transition-all duration-300 shadow-md shadow-[#c41e3a]/20">
                {/* Glowing background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#c41e3a]/20 to-[#8b0000]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="text-lg font-bold text-[#c41e3a] group-hover:text-[#d4af37] relative z-10 font-mono transition-colors duration-300">
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
              className="group relative rounded-lg border border-[#c41e3a]/40 px-4 py-2 text-sm font-semibold text-[#c41e3a] transition-all duration-300 hover:border-[#d4af37] hover:text-[#d4af37] hover:shadow-[0_0_15px_rgba(196,30,58,0.4)] overflow-hidden uppercase tracking-wide"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#c41e3a]/5 to-[#8b0000]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">CEX Verify</span>
            </button>
            <button
              onClick={handleOnchainVerify}
              className="group relative rounded-lg border border-[#d4af37]/40 px-4 py-2 text-sm font-semibold text-[#d4af37] transition-all duration-300 hover:border-[#c41e3a] hover:text-[#c41e3a] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] overflow-hidden uppercase tracking-wide"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-[#c0c0c0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Onchain Verify</span>
            </button>
          </div>

          {/* Right: Connect Button */}
          <div className="flex items-center gap-3">
            {currentAccount && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300 font-mono border border-[#c41e3a]/30 rounded-lg px-3 py-1.5 bg-gradient-to-r from-black/60 to-[#1a1a1a]/40 shadow-inner">
                <div className="w-2 h-2 bg-[#c41e3a] rounded-full animate-pulse shadow-sm shadow-[#c41e3a]"></div>
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </div>
            )}
            <div className="[&_button]:!bg-gradient-to-br [&_button]:!from-[#1a1a1a] [&_button]:!to-black [&_button]:!border-[#c41e3a] [&_button]:!text-[#c41e3a] [&_button]:!font-semibold [&_button]:!uppercase [&_button]:!tracking-wide [&_button]:hover:!shadow-[0_0_20px_rgba(196,30,58,0.5)] [&_button]:hover:!border-[#d4af37] [&_button]:hover:!text-[#d4af37] [&_button]:!transition-all [&_button]:!duration-300">
              <ConnectButton />
            </div>
          </div>
        </div>

        {/* Mobile menu for verify buttons */}
        <div className="flex md:hidden items-center justify-center space-x-3 pb-3">
          <button
            onClick={handleCexVerify}
            className="group relative flex-1 rounded-lg border border-[#c41e3a]/40 px-3 py-2 text-xs font-semibold text-[#c41e3a] transition-all duration-300 hover:border-[#d4af37] hover:text-[#d4af37] hover:shadow-[0_0_15px_rgba(196,30,58,0.4)] overflow-hidden uppercase"
          >
            <div className="absolute inset-0 bg-[#c41e3a] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative z-10">CEX</span>
          </button>
          <button
            onClick={handleOnchainVerify}
            className="group relative flex-1 rounded-lg border border-[#d4af37]/40 px-3 py-2 text-xs font-semibold text-[#d4af37] transition-all duration-300 hover:border-[#c41e3a] hover:text-[#c41e3a] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] overflow-hidden uppercase"
          >
            <div className="absolute inset-0 bg-[#d4af37] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <span className="relative z-10">Onchain</span>
          </button>
        </div>
      </div>

      {/* Bottom glowing border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent"></div>
    </nav>
  );
}
