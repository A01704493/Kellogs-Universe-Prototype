import React from 'react';
import { useGameEconomy } from '../contexts/GameEconomyContext';

// Íconos SVG inline (se podrían reemplazar por imágenes reales)
const LevelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const CoinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a3.833 3.833 0 001.719-.756c.712-.566 1.112-1.35 1.112-2.178 0-.829-.4-1.612-1.113-2.178a3.833 3.833 0 00-1.718-.756V8.334c.374.1.72.298.997.53l.92.7a.75.75 0 00.9-1.2l-.92-.7a3.823 3.823 0 00-1.897-.87V6z" clipRule="evenodd" />
  </svg>
);

const DiamondIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
    <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 01.722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM12 15a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H12z" clipRule="evenodd" />
  </svg>
);

const GameEconomyBar: React.FC = () => {
  const { economy, getXPForNextLevel, getXPPercentage } = useGameEconomy();
  const xpPercentage = getXPPercentage();
  const xpForNextLevel = getXPForNextLevel();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/80 to-purple-700/80 backdrop-blur-md text-white p-2 shadow-lg flex items-center justify-center gap-4">
      {/* Nivel y XP */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full">
          <LevelIcon />
        </div>
        <div className="text-xs">
          <div className="font-bold">Nivel {economy.level}</div>
          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white" 
              style={{ width: `${xpPercentage}%` }} 
            />
          </div>
          <div className="text-[10px] mt-0.5">{economy.xp}/{xpForNextLevel} XP</div>
        </div>
      </div>
      
      {/* Monedas */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center justify-center w-7 h-7 bg-yellow-500/30 rounded-full">
          <CoinIcon />
        </div>
        <span className="font-mono font-bold">{economy.coins}</span>
      </div>
      
      {/* Diamantes K */}
      <div className="flex items-center gap-1.5">
        <div className="flex items-center justify-center w-7 h-7 bg-blue-500/30 rounded-full">
          <DiamondIcon />
        </div>
        <span className="font-mono font-bold">{economy.kDiamonds}</span>
      </div>
    </div>
  );
};

export default GameEconomyBar; 