import React from 'react';
import { useGame, Unit } from '../store';
import { motion } from 'framer-motion';

export const CollectionGallery = () => {
    const { collection } = useGame();

    // Group by rarity or just sort by power
    const sorted = [...collection].sort((a, b) => b.power - a.power);

    if (collection.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0A0510] to-[#0A0510]">
                <h2 className="font-serif text-2xl text-[#FFE066] mb-4">Empty Gallery</h2>
                <p className="text-gray-400">Summon heroes to build your forces.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#0a0510] flex flex-col pt-20 pb-24 px-4 overflow-hidden">
            <h2 className="font-serif text-3xl text-white mb-6 text-center border-b border-white/10 pb-4">Sacred Roster</h2>
            
            <div className="flex-1 overflow-y-auto w-full grid grid-cols-3 gap-3 content-start">
                {sorted.map((unit, idx) => (
                    <motion.div 
                        key={unit.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(idx * 0.05, 0.5) }} // cap the delay
                        className="aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-end pb-2 relative overflow-hidden bg-black/80"
                        style={{
                            borderColor: 
                                unit.rarity === 'Common' ? '#C0C0C0' :
                                unit.rarity === 'Rare' ? '#00BFFF' :
                                unit.rarity === 'Epic' ? '#A020F0' :
                                unit.rarity === 'Legendary' ? '#FFD700' : '#FF1053',
                        }}
                    >
                        <div className="absolute inset-0 opacity-40 mix-blend-screen" style={{background: unit.image}} />
                        {unit.rarity === 'Legendary' && <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/30 to-transparent" />}
                        {unit.rarity === 'Divine' && <div className="absolute inset-0 bg-gradient-to-t from-[#FF1053]/30 to-transparent animate-pulse" />}
                        
                        <span className="relative z-10 text-[9px] uppercase font-bold tracking-wider rounded px-1 bg-black/60" style={{
                            color: 
                                unit.rarity === 'Common' ? '#C0C0C0' :
                                unit.rarity === 'Rare' ? '#00BFFF' :
                                unit.rarity === 'Epic' ? '#A020F0' :
                                unit.rarity === 'Legendary' ? '#FFD700' : '#FF1053',
                        }}>
                            {unit.rarity}
                        </span>
                        <span className="relative z-10 text-[10px] font-serif font-bold text-center mt-1 leading-tight px-1 drop-shadow-md pb-1">{unit.name}</span>
                        <div className="absolute top-1 right-1 bg-black/80 rounded px-1 text-[8px] font-mono text-white">
                            Lv.{unit.level}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
