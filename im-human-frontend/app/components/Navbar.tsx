"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    // TODO: Implement wallet connection logic
    setIsConnected(!isConnected);
    console.log("Connect wallet clicked");
  };

  const handleCexVerify = () => {
    router.push("/cex-verify");
  };

  const handleOnchainVerify = () => {
    router.push("/onchain-verify");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
                <span className="text-lg font-bold text-white dark:text-zinc-900">
                  IH
                </span>
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                I&apos;m Human
              </span>
            </a>
          </div>

          {/* Center: CEX Verify and Onchain Verify */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleCexVerify}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              CEX Verify
            </button>
            <button
              onClick={handleOnchainVerify}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Onchain Verify
            </button>
          </div>

          {/* Right: Connect Button */}
          <div className="flex items-center">
            <button
              onClick={handleConnect}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isConnected
                  ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              }`}
            >
              {isConnected ? "Connected" : "Connect"}
            </button>
          </div>
        </div>

        {/* Mobile menu for verify buttons */}
        <div className="flex md:hidden items-center justify-center space-x-3 pb-3">
          <button
            onClick={handleCexVerify}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            CEX Verify
          </button>
          <button
            onClick={handleOnchainVerify}
            className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Onchain Verify
          </button>
        </div>
      </div>
    </nav>
  );
}
