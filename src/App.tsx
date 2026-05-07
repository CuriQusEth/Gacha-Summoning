/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/web3/config';
import { GameProvider } from './store';
import { TitleScreen } from './components/TitleScreen';
import { ShrineView } from './components/ShrineView';

const queryClient = new QueryClient();

export default function App() {
  const [started, setStarted] = useState(false);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <div className="min-h-screen w-full bg-[#0A0510] text-white overflow-hidden relative">
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

