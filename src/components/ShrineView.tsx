import React, { useState } from 'react';
import { SummonAltar } from './SummonAltar';
import { CollectionGallery } from './CollectionGallery';
import { OnChainPanel } from './OnChainPanel';
import { useGame } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Coins, Home, Users, Sparkles, ScrollText } from 'lucide-react';

type Tab = 'altar' | 'gallery' | 'quests' | 'onchain';

export const ShrineView = () => {
    const { gems, gold, shrineLevel } = useGame();
    const [activeTab, setActiveTab] = useState<Tab>('altar');
    const [summoning, setSummoning] = useState(false);

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#0a0510] relative shadow-2xl overflow-hidden">
            
            {/* Top Bar (Currencies) */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex flex-col">
                    <span className="font-serif text-[#FFE066] font-bold text-lg drop-shadow-md">Shrine Lv.{shrineLevel}</span>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                        <Coins size={16} className="text-yellow-400" />
                        <span className="font-mono text-sm">{gold}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                        <Gem size={16} className="text-pink-400" />
                        <span className="font-mono text-sm">{gems}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'altar' && <SummonAltar key="altar" onSummonStart={() => setSummoning(true)} onSummonEnd={() => setSummoning(false)} />}
                    {activeTab === 'gallery' && <CollectionGallery key="gallery" />}
                    {activeTab === 'onchain' && <OnChainPanel key="onchain" />}
                    {activeTab === 'quests' && (
                        <motion.div key="quests" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center justify-center w-full h-full text-indigo-300 font-serif text-2xl">
                            Quests Coming Soon
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            {!summoning && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-around items-end pb-4 px-2 z-20">
                    <NavButton icon={<Home size={24}/>} label="Altar" active={activeTab==='altar'} onClick={()=>setActiveTab('altar')} />
                    <NavButton icon={<Users size={24}/>} label="Gallery" active={activeTab==='gallery'} onClick={()=>setActiveTab('gallery')} />
                    <NavButton icon={<ScrollText size={24}/>} label="Quests" active={activeTab==='quests'} onClick={()=>setActiveTab('quests')} />
                    <NavButton icon={<Sparkles size={24}/>} label="Base Denim" active={activeTab==='onchain'} onClick={()=>setActiveTab('onchain')} />
                </div>
            )}
        </div>
    );
};

const NavButton = ({icon, label, active, onClick}: {icon:React.ReactNode, label:string, active:boolean, onClick:()=>void}) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-[#FFE066] scale-110 drop-shadow-[0_0_8px_rgba(255,224,102,0.6)]' : 'text-gray-500 hover:text-gray-300'}`}
    >
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
    </button>
)
