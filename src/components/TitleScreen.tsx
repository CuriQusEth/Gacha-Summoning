import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { formatEther } from 'viem';

export const TitleScreen = ({ onStart }: { onStart: () => void }) => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const handleConnect = async () => {
    if (isConnected) {
      // SIWE concept
      try {
        const signature = await signMessageAsync({ 
            account: address as `0x${string}`,
            message: `Gacha Shrine Sign In\n\nApp_ID: 68f656f1b6320e0dd0819cee` 
        });
        if (signature) onStart();
      } catch (e) {
        console.error("Sign in failed", e);
      }
    } else {
      // Pick first connector (usually injected/browser wallet)
      const connector = connectors[0];
      if (connector) connect({ connector });
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-[#0A0510] to-[#0A0510]">
      {/* Background magical elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-yellow-200/20"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-[#FFE066] to-[#E63946] filter drop-shadow-[0_0_15px_rgba(255,224,102,0.8)] tracking-wider">
          GACHA SUMMONING
          <br/>
          SHRINE
        </h1>
        <p className="mt-4 text-xl font-sans text-indigo-300 italic max-w-md mx-auto">
          Become the Shrine Keeper. Summon legends, forge destinies.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="z-10 mt-16 flex flex-col items-center gap-6"
      >
        {isConnected ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-mono text-green-400">Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}</p>
            <button
              onClick={handleConnect}
              className="px-8 py-4 bg-gradient-to-b from-[#FFE066] to-[#E63946] text-[#0A0510] font-serif font-bold text-xl rounded-full shadow-[0_0_20px_rgba(255,224,102,0.6)] hover:scale-105 active:scale-95 transition-all w-64"
            >
              ENTER SHRINE
            </button>
            <button
              onClick={() => disconnect()}
              className="text-xs text-gray-400 hover:text-white"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
             <button
              onClick={handleConnect}
              className="px-8 py-4 bg-transparent border-2 border-[#FFE066] text-[#FFE066] font-serif font-bold text-xl rounded-full shadow-[0_0_15px_rgba(255,224,102,0.3)] hover:bg-[#FFE066]/10 active:scale-95 transition-all w-64"
            >
              CONNECT WALLET
            </button>
            <button
              onClick={onStart}
              className="text-sm text-gray-500 hover:text-indigo-300 transition-colors"
            >
              Skip & Play Locally
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
