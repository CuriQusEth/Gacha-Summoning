/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WagmiProvider, useAccount, useSendTransaction } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseEther } from 'viem';
import { config } from './lib/web3/config';
import { GameProvider } from './store';
import { TitleScreen } from './components/TitleScreen';
import { ShrineView } from './components/ShrineView';
import { Sun } from 'lucide-react';
import { withAttribution } from './lib/erc8021/Attribution';

const queryClient = new QueryClient();

function SayGMButton() {
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const [loading, setLoading] = useState(false);

  if (!isConnected) return null;

  const sendGMTransaction = async () => {
    try {
      setLoading(true);
      await sendTransactionAsync({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: parseEther('0'),
        data: withAttribution("0xGM") as `0x${string}`,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <button 
        onClick={sendGMTransaction}
        disabled={loading}
        className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
      >
        <Sun size={14} />
        {loading ? 'Sending...' : 'Say GM'}
      </button>
    </div>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <div className="min-h-screen w-full bg-[#0A0510] text-white overflow-hidden relative">
            <SayGMButton />
            {!started ? (
              <TitleScreen onStart={() => setStarted(true)} />
            ) : (
              <ShrineView />
            )}
          </div>
        </GameProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

