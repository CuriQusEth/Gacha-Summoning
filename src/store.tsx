import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Divine';

export interface Unit {
  id: string;
  name: string;
  rarity: Rarity;
  level: number;
  image: string; // URL or placeholder color
  power: number;
}

export interface GameState {
  shrineLevel: number;
  gems: number;
  gold: number;
  pityCounter: number; // Summons without legendary
  collection: Unit[];
  rarestSummonOnChain: string | null;
  hybridScore: number;
}

interface GameContextType extends GameState {
  summon: (amount: number) => Unit[];
  upgradeShrine: () => void;
  addGems: (amount: number) => void;
  recordOnChain: (unitId: string) => void;
}

const initialGameState: GameState = {
  shrineLevel: 1,
  gems: 1000, // starting dev currency
  gold: 0,
  pityCounter: 0,
  collection: [],
  rarestSummonOnChain: null,
  hybridScore: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const POSSIBLE_UNITS: Omit<Unit, 'id'>[] = [
  { name: "Forest Sprite", rarity: "Common", level: 1, image: "#a8e6cf", power: 10 },
  { name: "Stone Golem", rarity: "Common", level: 1, image: "#dcedc1", power: 15 },
  { name: "Wind Wolf", rarity: "Rare", level: 1, image: "#ffd3b6", power: 30 },
  { name: "Fire Salamander", rarity: "Rare", level: 1, image: "#ffaaa5", power: 35 },
  { name: "Shadow Assassin", rarity: "Epic", level: 1, image: "#4a0072", power: 100 },
  { name: "Crystal Valkyrie", rarity: "Epic", level: 1, image: "#bbdefb", power: 120 },
  { name: "Sun God Ra", rarity: "Legendary", level: 1, image: "#FFD700", power: 500 },
  { name: "Void Dragon", rarity: "Legendary", level: 1, image: "#111111", power: 550 },
  { name: "Celestial Weaver", rarity: "Divine", level: 1, image: "linear-gradient(45deg, #FF1053, #A020F0)", power: 2000 },
];

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('gacha_state');
    return saved ? JSON.parse(saved) : initialGameState;
  });

  useEffect(() => {
    localStorage.setItem('gacha_state', JSON.stringify(state));
  }, [state]);

  const summon = (amount: number): Unit[] => {
    if (state.gems < amount * 100) return []; // 100 gems per summon
    
    let currentPity = state.pityCounter;
    const newUnits: Unit[] = [];

    for(let i=0; i<amount; i++) {
        currentPity++;
        
        let pullProb = Math.random();
        
        // Pity overrides
        if (currentPity >= 90) {
            pullProb = 0.005; // Force Legendary/Divine prob
        }
        
        let rarityRes: Rarity = "Common";
        // Rates improve slightly with shrine level
        const shrineBonus = state.shrineLevel * 0.001; 

        if (pullProb < 0.001 + (shrineBonus/10)) rarityRes = "Divine";
        else if (pullProb < 0.01 + shrineBonus) rarityRes = "Legendary";
        else if (pullProb < 0.10 + shrineBonus) rarityRes = "Epic";
        else if (pullProb < 0.40) rarityRes = "Rare";
        
        if (rarityRes === 'Legendary' || rarityRes === 'Divine') {
            currentPity = 0; // Reset pity
        }

        const pool = POSSIBLE_UNITS.filter(u => u.rarity === rarityRes);
        const selected = pool[Math.floor(Math.random() * pool.length)];
        
        newUnits.push({
            ...selected,
            id: Math.random().toString(36).substr(2, 9),
        });
    }

    setState(prev => ({
        ...prev,
        gems: prev.gems - (amount * 100),
        pityCounter: currentPity,
        collection: [...prev.collection, ...newUnits],
        hybridScore: prev.hybridScore + newUnits.reduce((acc, u) => acc + u.power, 0)
    }));

    return newUnits;
  };

  const upgradeShrine = () => {
    const cost = state.shrineLevel * 500;
    if (state.gold >= cost) {
      setState(prev => ({ ...prev, shrineLevel: Math.min(prev.shrineLevel + 1, 10), gold: prev.gold - cost }));
    }
  };

  const addGems = (amount: number) => {
    setState(prev => ({...prev, gems: prev.gems + amount}));
  }

  const recordOnChain = (unitId: string) => {
    setState(prev => ({ ...prev, rarestSummonOnChain: unitId }));
  }

  return (
    <GameContext.Provider value={{ ...state, summon, upgradeShrine, addGems, recordOnChain }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
