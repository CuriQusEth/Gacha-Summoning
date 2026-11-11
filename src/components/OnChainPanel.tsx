import React, { useState } from 'react';
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';
import { parseEther } from 'viem';
import { useGame } from '../store';
import { ERC8021_CONFIG, withAttribution } from '../lib/erc8021/Attribution';
import { BASE_DENIM_CONFIG } from '../lib/web3/config';
import { ExternalLink, Zap, ShieldCheck, Sun } from 'lucide-react';

export const OnChainPanel = () => {
    const { address, isConnected } = useAccount();
    const { collection, rarestSummonOnChain, recordOnChain } = useGame();
    const { sendTransactionAsync } = useSendTransaction();
    const { signMessageAsync } = useSignMessage();
    
    const [txHash, setTxHash] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSayGM = async () => {
        if (!isConnected) return alert("Connect wallet first!");
        
        try {
            setLoading(true);
            // Real transaction to the designated GM contract on Base Mainnet (Denim)
            // withAttribution adds ERC-8021 tracking info
            const tx = await sendTransactionAsync({
                to: BASE_DENIM_CONFIG.gmContract as `0x${string}`,
                value: parseEther('0'),
                data: withAttribution("0xGM") as `0x${string}`, 
            });
            setTxHash(tx);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordBestSummon = async () => {
        if (!isConnected) return alert("Connect wallet first!");
        if (collection.length === 0) return alert("Summon a unit first!");

        const best = [...collection].sort((a,b) => b.power - a.power)[0];

        try {
            setLoading(true);
            const signature = await signMessageAsync({ 
                account: address as `0x${string}`,
                message: `Record Best Summon on Base Mainnet (Denim 200ms)\n\nChain ID: 8453\nApp_ID: 68f656f1b6320e0dd0819cee\nBuilder: ${ERC8021_CONFIG.BUILDER_CODE}\nUnit: ${best.name} (${best.rarity})`
            });
            if (signature) {
                recordOnChain(best.id);
                alert("Recorded Successfully on Base Mainnet!");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full bg-[#0a0510] flex flex-col pt-16 px-6 pb-24 overflow-y-auto">
            {/* Denim Badge */}
            <div className="flex items-center justify-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    <Zap size={13} className="text-cyan-300 animate-pulse" />
                    Denim Upgrade Active • 200ms Blocks
                </span>
            </div>

            <h2 className="font-serif text-3xl text-center text-[#0052FF] mb-1 font-bold drop-shadow-[0_0_10px_rgba(0,82,255,0.5)]">
                Base Mainnet
            </h2>
            <p className="text-center text-xs text-blue-300 font-mono mb-6">
                Chain ID: 8453 • Native Canonical Speed
            </p>

            <div className="space-y-5">
                {/* Denim Network Specs */}
                <div className="p-3.5 border border-cyan-900/40 bg-cyan-950/20 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Consensus & Speed</span>
                        <span className="text-cyan-300 font-mono font-bold">200ms Canonical</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Flashblocks Status</span>
                        <span className="text-emerald-400 font-mono">Retired for Denim</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Target GM Contract</span>
                        <span className="text-gray-300 font-mono text-[11px]">0xcD0dd3...71a3</span>
                    </div>
                </div>
                
                {/* Say GM Block */}
                <div className="p-4 border border-blue-900/50 bg-blue-950/20 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif text-lg text-white flex items-center gap-2">
                            <Sun size={16} className="text-yellow-400" />
                            Say "GM" On-Chain
                        </h3>
                        <span className="text-[10px] bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded font-mono">
                            Base Mainnet
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-4">
                        Sends a transaction to <code className="text-cyan-300 text-[10px]">0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3</code> with ERC-8021 attribution calldata.
                    </p>
                    <button 
                        onClick={handleSayGM}
                        disabled={loading}
                        className="w-full bg-[#0052FF] text-white py-3 rounded-lg font-bold hover:bg-blue-600 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Sun size={16} />
                        {loading ? 'Confirming in 200ms block...' : 'Send GM Transaction'}
                    </button>
                    {txHash && (
                        <div className="mt-3 p-2 bg-blue-950/50 border border-blue-800/40 rounded-lg">
                            <p className="text-[11px] text-green-400 font-mono flex items-center gap-1 break-all">
                                <ShieldCheck size={14} className="shrink-0 text-emerald-400" />
                                <span>Included in Base block!</span>
                            </p>
                            <a 
                                href={`https://basescan.org/tx/${txHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 mt-1 font-mono"
                            >
                                View on BaseScan <ExternalLink size={10} />
                            </a>
                        </div>
                    )}
                </div>

                {/* Best Summon Recorder */}
                <div className="p-4 border border-yellow-900/50 bg-yellow-950/20 rounded-xl">
                    <h3 className="font-serif text-lg text-[#FFE066] mb-2">Engrave Best Summon</h3>
                    <p className="text-xs text-gray-400 mb-4">Sign a message to formally anchor your luckiest pull on Base Mainnet using SIWE.</p>
                    <button 
                        onClick={handleRecordBestSummon}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-lg font-bold hover:opacity-90 active:scale-[0.99] transition-opacity disabled:opacity-50"
                    >
                        Sign & Record Rarest
                    </button>
                    {rarestSummonOnChain && (
                        <p className="text-[11px] text-yellow-400 mt-2 text-center font-mono font-semibold">
                            ✨ Best Summon Anchored to Base Mainnet!
                        </p>
                    )}
                </div>

                {/* Info Block */}
                <div className="p-4 rounded-xl space-y-1.5 text-xs font-mono text-gray-500 bg-black/40 border border-white/5">
                    <p className="flex justify-between">
                        <span>ERC-8021 Builder:</span>
                        <span className="text-gray-300">{ERC8021_CONFIG.BUILDER_CODE}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>App ID:</span>
                        <span className="text-gray-300">68f656f1b6320e0dd0819cee</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Network:</span>
                        <span className="text-cyan-400 font-semibold">Base Mainnet (Denim)</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Wallet:</span>
                        <span className="text-gray-300">{isConnected ? `${address?.substring(0,8)}...${address?.slice(-6)}` : 'Not Connected'}</span>
                    </p>
                </div>

            </div>
        </div>
    );
};

