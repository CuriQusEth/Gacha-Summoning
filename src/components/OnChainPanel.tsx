import React, { useState } from 'react';
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';
import { parseEther } from 'viem';
import { useGame } from '../store';
import { ERC8021_CONFIG, withAttribution } from '../lib/erc8021/Attribution';

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
            // Example real transaction (sending 0 ETH to self to trigger on-chain attribution)
            // withAttribution simulates adding ERC-8021 tracking info
            const tx = await sendTransactionAsync({
                to: address,
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
                message: `Record Best Summon on Base\n\nApp_ID: 68f656f1b6320e0dd0819cee\nBuilder: ${ERC8021_CONFIG.BUILDER_CODE}\nUnit: ${best.name} (${best.rarity})`
            });
            if (signature) {
                recordOnChain(best.id);
                alert("Recorded Successfully!");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full bg-[#0a0510] flex flex-col pt-20 px-6 pb-24 overflow-y-auto">
            <h2 className="font-serif text-3xl text-center text-[#0052FF] mb-2 font-bold drop-shadow-[0_0_10px_rgba(0,82,255,0.5)]">
                Base Mainnet
            </h2>
            <p className="text-center text-xs text-blue-300 font-mono mb-8">On-Chain Integration features</p>

            <div className="space-y-6">
                
                {/* Say GM Block */}
                <div className="p-4 border border-blue-900/50 bg-blue-950/20 rounded-xl">
                    <h3 className="font-serif text-lg text-white mb-2">Say "GM" On-Chain</h3>
                    <p className="text-xs text-gray-400 mb-4">Send a 0 value transation with ERC-8021 attribution code to the network.</p>
                    <button 
                        onClick={handleSayGM}
                        disabled={loading}
                        className="w-full bg-[#0052FF] text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Send GM Transaction'}
                    </button>
                    {txHash && (
                        <p className="text-[10px] text-green-400 mt-2 break-all font-mono">
                            Tx: {txHash}
                        </p>
                    )}
                </div>

                {/* Best Summon Recorder */}
                <div className="p-4 border border-yellow-900/50 bg-yellow-950/20 rounded-xl">
                    <h3 className="font-serif text-lg text-[#FFE066] mb-2">Engrave Best Summon</h3>
                    <p className="text-xs text-gray-400 mb-4">Sign a message to formally anchor your luckiest pull on the chain using SIWE.</p>
                    <button 
                        onClick={handleRecordBestSummon}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        Sign & Record Rarest
                    </button>
                    {rarestSummonOnChain && (
                        <p className="text-[10px] text-yellow-400 mt-2 text-center font-mono">
                            Best Summon Locked!
                        </p>
                    )}
                </div>

                {/* Info Block */}
                <div className="p-4 rounded-xl space-y-2 text-xs font-mono text-gray-500 bg-black/40">
                    <p>ERC-8021 Builder: {ERC8021_CONFIG.BUILDER_CODE}</p>
                    <p>App ID: 68f656f1b6320e0dd0819cee</p>
                    <p>Wallet: {isConnected ? `${address?.substring(0,8)}...` : 'Not Connected'}</p>
                </div>

            </div>
        </div>
    );
};
