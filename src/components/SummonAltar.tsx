import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, Unit } from '../store';

export const SummonAltar: React.FC<{ onSummonStart: () => void, onSummonEnd: () => void }> = ({ onSummonStart, onSummonEnd }) => {
    const { summon, gems } = useGame();
    const [summoning, setSummoning] = useState(false);
    const [result, setResult] = useState<Unit[] | null>(null);

    const handleSummon = (amount: number) => {
        if (gems < amount * 100) return;
        setSummoning(true);
        onSummonStart();
        
        // Wait for visual build-up
        setTimeout(() => {
            const res = summon(amount);
            setResult(res);
        }, 3000);
    };

    const closeSummon = () => {
        setResult(null);
        setSummoning(false);
        onSummonEnd();
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="w-full h-full relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#2a0a3a_0%,_#0a0510_100%)]"
        >
            {/* The Altar Core */}
            {!summoning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div 
                        animate={{ 
                            boxShadow: ['0px 0px 20px 5px rgba(255, 224, 102, 0.2)', '0px 0px 60px 15px rgba(255, 224, 102, 0.5)', '0px 0px 20px 5px rgba(255, 224, 102, 0.2)']
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-64 h-64 rounded-full border border-[#FFF8D6]/20 flex flex-col items-center justify-center relative backdrop-blur-sm"
                    >
                        <div className="absolute inset-0 rounded-full border border-[#FFE066]/40 border-dashed animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-4 rounded-full border border-[#E63946]/30 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
                        
                        <div className="text-center z-10 space-y-4 pt-10">
                            <h2 className="font-serif text-[#FFE066] text-2xl tracking-widest uppercase">Sacred Altar</h2>
                            <p className="text-xs text-indigo-300 px-8">Draw runes to bridge the realms.</p>
                        </div>
                    </motion.div>

                    <div className="absolute bottom-32 flex gap-6">
                        <button 
                            onClick={() => handleSummon(1)}
                            disabled={gems < 100}
                            className="bg-black/50 border border-[#FFE066] px-6 py-3 rounded-xl font-serif text-[#FFE066] hover:bg-[#FFE066]/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex flex-col items-center"
                        >
                            <span>Summon 1x</span>
                            <span className="text-xs font-mono opacity-80 mt-1">100 Gems</span>
                        </button>
                        <button 
                            onClick={() => handleSummon(10)}
                            disabled={gems < 1000}
                            className="bg-gradient-to-t from-[#E63946]/40 to-transparent border border-[#E63946] px-6 py-3 rounded-xl font-serif text-white shadow-[0_0_15px_rgba(230,57,70,0.4)] hover:bg-[#E63946]/60 active:scale-95 disabled:opacity-50 flex flex-col items-center"
                        >
                            <span>Summon 10x</span>
                            <span className="text-xs font-mono opacity-80 mt-1">1000 Gems</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Summoning Animation Seq */}
            <AnimatePresence>
                {summoning && !result && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0, transition: {duration: 0.5} }}
                        className="absolute inset-0 bg-white"
                    >
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#FFE066_50%,_#E63946_100%)] flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, rotate: 0 }}
                                animate={{ scale: [0.8, 1.2, 0.5, 20], rotate: [0, 180, 360, 720] }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                                className="w-20 h-20 bg-white rounded-full mix-blend-overlay blur-sm"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Result Screen */}
            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="absolute inset-0 z-50 bg-[#0a0510]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 overflow-y-auto"
                    >
                        <h2 className="font-serif text-3xl text-white mb-8 mt-10">Summon Complete</h2>
                        <div className="flex flex-wrap justify-center gap-4 max-w-lg mb-20">
                            {result.map((unit, idx) => (
                                <motion.div 
                                    key={unit.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1, type: 'spring' }}
                                    className="w-[100px] h-[140px] rounded-lg border-2 flex flex-col items-center justify-end pb-2 relative overflow-hidden bg-black/50"
                                    style={{
                                        borderColor: 
                                            unit.rarity === 'Common' ? '#C0C0C0' :
                                            unit.rarity === 'Rare' ? '#00BFFF' :
                                            unit.rarity === 'Epic' ? '#A020F0' :
                                            unit.rarity === 'Legendary' ? '#FFD700' : '#FF1053',
                                        boxShadow: unit.rarity === 'Legendary' || unit.rarity === 'Divine' ? `0 0 15px ${unit.rarity === 'Legendary' ? '#FFD700' : '#FF1053'}` : 'none'
                                    }}
                                >
                                    <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{background: unit.image}} />
                                    {unit.rarity === 'Legendary' && <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/40 to-transparent" />}
                                    {unit.rarity === 'Divine' && <div className="absolute inset-0 bg-gradient-to-t from-[#FF1053]/40 to-transparent animate-pulse" />}
                                    
                                    <span className="relative z-10 text-[10px] uppercase font-bold tracking-wider rounded px-1 bg-black/60" style={{
                                        color: 
                                            unit.rarity === 'Common' ? '#C0C0C0' :
                                            unit.rarity === 'Rare' ? '#00BFFF' :
                                            unit.rarity === 'Epic' ? '#A020F0' :
                                            unit.rarity === 'Legendary' ? '#FFD700' : '#FF1053',
                                    }}>
                                        {unit.rarity}
                                    </span>
                                    <span className="relative z-10 text-xs font-serif font-bold text-center mt-1 leading-tight px-1 drop-shadow-md pb-1">{unit.name}</span>
                                </motion.div>
                            ))}
                        </div>

                        <button 
                            onClick={closeSummon}
                            className="fixed bottom-10 px-8 py-3 bg-white/10 border border-white/30 rounded-full font-serif text-white hover:bg-white/20 active:scale-95 transition-all"
                        >
                            Accept Fate
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
};
