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
    <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
  </svg>
);

const GameEconomyBar: React.FC = () => {
  const { economy, getXPForNextLevel, getXPPercentage } = useGameEconomy();
  const xpPercentage = getXPPercentage();
  const xpForNextLevel = getXPForNextLevel();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/80 to-purple-700/80 backdrop-blur-md text-white p-2 shadow-lg flex items-center justify-center gap-4">
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